/*****************************
 * 設定
 *****************************/

let defconf = {
    application: {
        name: 'Tooterminal',
        website: 'https://wd-shiroma.github.io/',
        uris: 'urn:ietf:wg:oauth:2.0:oob',
        scopes: {
            read:   true,
            write:  true,
            follow: true
        }
    },
    terminal: {
        length: 0
    },
    instances: {
        terminal: {
            logging: {
                favourite: true,
                reblog: true,
                mention: true,
                following: true
            },
            monitor: [
                'local',
                'notification'
            ]
        },
        status: {},
    }
};

let config;
let ins;
let url_params;
let acls;

let term_mode;
let mode_global;
let mode_configuration;
let mode_instance;
let mode_config_instance;
let instance_name;
let beep_buf;

let context = new AudioContext();

let client_info = {
    modified: (new Date('2018-06-11')),
    version: '1.3.3',
    auther: 'Guskma',
    acct: 'guskma@abyss.fun',
    website: 'https://wd-shiroma.github.io/'
}


/*****************************
 * 本処理
 *****************************/

let enterCommand = (command, term) => {
    command = command.trim();
    term.resize(window.innerWidth - 36, window.innerHeight - 36);
    reduce_output();

    if (command.length === 0) {
        return;
    }

    let result = term_mode.execute(command, term);
    if (result !== true) {
        term.error(term_mode.result.message);
    }
    return;

};

let completion = (line, callback) => {
    let cmd_list = term_mode.getCompletion(line);
    if (cmd_list.length === 1) {
        $.terminal.active().set_command(term_mode.completion);
    }
    else {
        callback(cmd_list.sort().filter((val) => {
            return (val ? val : '<cr>');
        }));
    }
};

let initConfig = (term) => {
    let store = localStorage;
    let st_conf = store.getItem('configuration');
    /*
    if (st_conf) {
        config = new ConfigManager(JSON.parse(str);
    }
    else {
        console.log('Initialization: read default config')
        config = defconf;
    }*/
    let src_url = './sounds/boop.ogg';
    let req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 0 || req.status === 200) {
                if (req.response) {
                    context.decodeAudioData(req.response, function(buffer) {
                        beep_buf = buffer;
                    });
                }
                else {
                    $.terminal.active().error('Error: ポコポコできません');
                    console.log('error');
                    beep_buf = undefined;
                }
            }
        }
    };
    req.open('GET', src_url, true);
    req.send('')

    config = new ConfigManager(defconf, st_conf ? JSON.parse(st_conf) : {});
    url_params = {};

    if (!location.search.match(/^\?.+=.+/)) {
        return;
    }
    let params_org = location.search.replace(/^\?/, '').split(/[=&]/);
    for (let i = 0; i < params_org.length; i += 2) {
        url_params[params_org[i]] = params_org[i+1];
    }
    if (url_params.hasOwnProperty('code') && ins.name(url_params.instance_name)) {
        ins.get().auth_code = url_params.code;
        term.exec('instance ' + ins.name());
        history.replaceState('', '', location.pathname);
    }
    else if (url_params.hasOwnProperty('instance') && ins.name(url_params.instance)) {
        term.exec('instance ' + ins.name());
    }
};

let filterKey = (event, term) => {
    if(event.charCode === 63){
        let info = term_mode.information(term.get_command());

        let lines = info.map((cmd) => {
            return (typeof cmd.command === 'undefined')
                ? cmd : ('  ' + tab(cmd.command, cmd.description, 22));
        });
        lines.unshift(term.get_prompt() + term.get_command() + '?');
        lines.push('');
        more(term, lines, {reverse: true});
        let cmd = term.get_command();
        term.set_command('');
        setTimeout(() => {
            term.set_command(cmd);
        },10);
    }
};

let parseCommand = (command, term) => {
    try {
        term_mode.parse(command.replace(/\?$/, ''));
    }
    catch (e) {
        term.error('Invalid command characters. ([, \\)');
        term.set_command('');
    }
};

let init_instance = function(term) {
    term_mode = mode_instance;
    let _ins = ins.get();

    let ins_config;
    if (!_ins.hasOwnProperty('config')) {
        _ins['config'] = JSON.parse(JSON.stringify(config.find(['instances'])));
        ins.save();
    }

    let auto_term;
    if (config.find(['instances', 'terminal', 'auto'])){
        auto_term = config.find(['instances', 'terminal', 'monitor']);
        auto_term = auto_term.match(/(home|local|public|notification)/g);
    }
    if (url_params.hasOwnProperty('terminal')) {
        auto_term = url_params.terminal.match(/(home|local|public|notification)/g);
    }
    auto_term = (auto_term ? auto_term : []);
    if (auto_term.length > 0 && _ins.hasOwnProperty('access_token')) {
        if (typeof auto_term === 'string') {
            auto_term = [auto_term];
        }
        for (let i = 0; i < auto_term.length; i++) {
            ws.monitor[auto_term[i]] = true;
        }
        ws.startup = auto_term[0];
        if (!is_monitoring()) {
            term.exec('terminal monitor');
        }
    }
};

let exit_instance = function() {
    term_mode = mode_global;
    closeTootbox();
    ins.name('');
}

let count_toot_size = () => {
    let msg_size = 500 - $('#toot_box').val().length - $('#toot_cw').val().length;
    $('#toot_size').css('color', msg_size < 0 ? '#F00' : '#bbb').text(msg_size);
}

function upload_img(imageFile) {
    let formData = new FormData();
    let _ins = ins.get();
    let len = $('.toot_media img').length;
    $('#toot_media').append($('<img />').attr('id', 'media_' + len)).slideDown('first');
    formData.append('file', imageFile);
    $.ajax('https://' + _ins.domain + '/api/v1/media' , {
        type: 'POST',
        contentType: false,
        processData: false,
        headers: {
            Authorization: _ins.token_type + ' ' + _ins.access_token
        },
        data: formData
    }).then((data, status, jqxhr) => {
        $('#media_' + len)
            .attr('data-id', data.id)
            .attr('data-url', data.text_url);
        let img = new Image();
        img.onload = () => {
            $('#media_' + len).attr('src', data.preview_url);
            $('#toot_box').val($('#toot_box').val() + ' ' + data.text_url);
            autosize.update($('#toot_box'));
            count_toot_size();
        };
        img.onerror = (e) => {
            console.log(e);
        };
        img.src = data.preview_url;
    }, (jqxhr, status, error) => {
        $.terminal.active().error('Media upload error.(' + jqxhr.status + ')');
        $('#media_' + len).remove();
        console.log(jqxhr);
    });
}

let tl;
$(function() {
    mode_global        = new ModeManager(new GlobalModeElement);
    mode_configuration = new ModeManager(new ConfigurationModeElement);
    mode_instance      = new ModeManager(new InstanceModeElement);
    //mode_config_instance = new ModeManager(new InstanceConfigModeElement);
    ins = new InstanceManager();
    term_mode          = mode_global;
    let greetings = "=== CLI画面風 マストドンクライアント \"Tooterminal\" ===\n"
        + "                    Version " + client_info.version + ", modified "
        + client_info.modified.getFullYear() + "/"
        + ('0' + (client_info.modified.getMonth() + 1)).slice(-2) + "/"
        + ('0' + client_info.modified.getDate()).slice(-2) + "\n\n"
        + "使い方は\"help\"コマンドまたは\"?\"キーを押してください。\n\n"
    tl = $('#timeline').terminal(enterCommand, {
        name:        'global',
        greetings:   greetings,
        login:        false,
        onInit:       initConfig,
        prompt:       'Tooterminal# ',
        completion:   completion,
        height:       window.innerHeight - 18,
        onResize:     (term) => { term.resize($(window).width() - 36, $(window).height() - 36); },
        exit:         false,
        clear:        false,
        scrollOnEcho: false,
        keypress:     filterKey,
        onFocus:      (term) => { return true; },
        //onResume:     false,
        onCommandChange: parseCommand,
    });/*
    window.emojiPicker = new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: './img',
        popupButtonClasses: 'fa fa-smile-o'
    });
    window.emojiPicker.discover();*/
    $('#toot').on('keydown', (event) => {
        if (event.keyCode === 27) {
            closeTootbox();
        }
        else if(event.keyCode === 13 && event.ctrlKey) {
            post_status();
        }/*
        else if ($('#toot_box').val().match(/^@[0-9a-zA-Z_]+/) && $('.reply #sid').text() === '') {
            $('#toot_visibility').val('unlisted');
        }*/
    })
    .on('paste', (elem) => {

        if ($('.toot_media img').length >= 4) {
            return;
        }

        if (typeof elem.originalEvent.clipboardData !== 'undefined'
            && typeof elem.originalEvent.clipboardData.types !== 'undefined'
            && elem.originalEvent.clipboardData.types.length === 1
            && elem.originalEvent.clipboardData.types[0] === "Files"
        ) {
            let imageFile = elem.originalEvent.clipboardData.items[0].getAsFile();
            upload_img(imageFile);
        }
    });
    $('#toot_box').on('dragenter', (e) => {
        e.preventDefault();
        $('#toot_box').addClass('toot_imghover');

    })
    .on('dragover', (e) => {
    })
    .on('dragleave', (e) => {
        $('#toot_box').removeClass('toot_imghover');
    })
    .on('drop', (e) => {
        e.preventDefault();
        $('#toot_box').removeClass('toot_imghover');
        let files = e.originalEvent.dataTransfer.files;
        let f_max = 4 - $('#toot_media img').length;
        let f_uploadable = f_max < files.length ? f_max : files.length;
        for (let i = 0; i < f_uploadable; i++) {
            if (!files[i].type.match(/^(video|image)\//)) {
                continue;
            }
            upload_img(files[i]);
        }
    });
    $('#toot_cw').on('keyup', count_toot_size);
    $('#toot_box').on('keyup', count_toot_size);
    $('#toot_post').on('click', () => {
        post_status();
    });
    $('#help_close').on('click', () => {
        $('#help').slideUp('first');
        $.terminal.active().focus();
    });
    $('#reply_close').on('click', (e) => {
        $('#sid').text('');
        $('#reply').hide();
        $('#toot_box').val($('#toot_box').val().replace(/^@[a-zA-Z0-9_]+(?:@(?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z0-9]+)?\s+/, ''));
    });
    $('.img_background').on('click', function(){
        $('#img_view').fadeOut('first');
        $('#pre_view').fadeOut('first');
        $('#video_view').fadeOut('first');
        $('.img_background').fadeOut('first');
        $.terminal.active().enable();
    });
    $(document)
    .on('click', '.read_more', function() {
        $(this).next().toggle('fast');
    })
    .on('mouseover', '.status', function() {
        let cfg = config.find('instances.status.thumbnail');
        if (typeof cfg === 'undefined'){
            $(this).find('.status_thumbnail').show();
        }
    })
    .on('mouseout', '.status', function() {
        let cfg = config.find('instances.status.thumbnail');
        if (typeof cfg === 'undefined'){
            $(this).find('.status_thumbnail').hide();
        }
    })
    .on('click', '.status', function(e) {
        if ($(this).hasClass('status_deleted')) {
            return;
        }
        let id = $(this).data('sid');
        if (e.shiftKey) {
            let reply = '@' + $(this).data('acct').toString();
            let re = /((?:@([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-9_]+)))/g;
            let mul_reply = $(this).find('.status_contents')[0].textContent.replace(new RegExp(reply, 'g'), '').match(re);

            $.terminal.active().disable();
            $('#toot').slideDown('first');
            $('#reply').show();
            $('#sid').text($(this).data('sid'));
            $('#reply_head').text('reply to: ' + $(this).data('dispname'));
            $('#reply_body').text($(this).find('#status_contents')[0].textContent);
            $('#toot_box').focus().val('@' + $(this).data('acct') + ' ' + $(this).data('reply'));
            if ($($(this).find('.status_head i')[2]).hasClass('fa-envelope')) {
                $('#toot_visibility').val('direct');
            }
            else if ($($(this).find('.status_head i')[2]).hasClass('fa-lock')) {
                $('#toot_visibility').val('private');
            }
            else if ($($(this).find('.status_head i')[2]).hasClass('fa-unlock')) {
                $('#toot_visibility').val('unlisted');
            }
            else {
                $('#toot_visibility').val('public');
            }
        }
        if (e.ctrlKey) {
            favourite(this);
        }
        if (e.altKey) {
            boost(this);
        }
    })
    .on('click', '.status i', function(e){
        console.log(e);
        let target = $(e.target);
        let status = target.parents('.status');
        if (target.hasClass('fa-star') || target.hasClass('fa-star-o')) {
            favourite(status);
        }
        else if (target.hasClass('fa-check-circle-o') || target.hasClass('fa-retweet')) {
            boost(status);
        }
      /*+ $('<i />').addClass('fa fa-' + (contents.favourited ? 'star' : 'star-o')).attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (contents.visibility === 'direct' || contents.visibility === 'private' ? 'times-circle-o'
                        : contents.reblogged ? 'check-circle-o' : 'retweet'))*/
    })
    .on('dblclick', '.status', function(e){
        let term = $.terminal.active();
        if (term.name() === 'more') {
            term.pop();
        }
        if (term.name() !== 'instance') {
            return;
        }
        if ($(this).data('sid') > 0) {
            term.exec('show status id ' + $(this).data('sid'));
        }
        else {
            term.pause();
            callAPI('/api/v1/search', {
                type: 'GET',
                data: {
                    q: $(this).data('uri'),
                    limit: 1
                }
            }).then((data, status, jqxhr) => {
                if (data.statuses.length > 0) {
                    term.resume();
                    term.exec('show status id ' + data.statuses[0].id);
                }
                else {
                    term.echo('No status found. (Perhaps status was deleted)');
                    term.resume();
                }
            });
        }

    })
    .on('click', '.status img', function(e) {
        let elem = $(this);

        $.terminal.active().disable();
        $('.img_background').fadeIn('first');
        $('#pre_view').attr('src', elem.attr('src')).fadeIn('first');

        if (elem.data('type') === 'gifv') {
            let video = $('#video_view')[0];
            video.src = elem.data('url');
            video.loop = true;
            video.autoplay = true;
            video.muted = true;
            video.controls = true;
            video.oncanplay = () => {
                $('#pre_view').fadeOut('first');
            };
            $('#video_view').fadeIn('first');
        }
        else if (elem.data('type') === 'video') {
            let video = $('#video_view')[0];
            video.src = elem.data('url');
            video.loop = false;
            video.autoplay = true;
            video.muted = true;
            video.controls = true;
            video.oncanplay = () => {
                $('#pre_view').fadeOut('first');
            };
            $('#video_view').fadeIn('first');
        }
        else if (typeof elem.data('url') !== 'undefined') {
            let img = new Image();
            img.onload = () => {
                $('#img_view').attr('src', elem.data('url'));
            };
            img.onerror = (e) => {
                console.log(elem);
                console.log(e);
            };
            img.src = elem.data('url');
        }
    })
    .on('click', '.emoji_picker', function(e) {
        let term = $.terminal.active();
        if (term.name() !== 'instance') {
            return;
        }
        if ($('#toot').is(':hidden')) {
            term.exec('toot');
        }
        let elem = $(this);
        let content = $('#toot_box').val();
        let pos = $('#toot_box').prop('selectionStart');
        let before = content.slice(0, pos);
        let after = content.slice(pos);
        if (before.length > 0 && before.slice(-1).match(/[^ \n]/)) {
            before += ' ';
        }
        if (after.slice(0, 1) !== ' ') {
            after = ' ' + after;
        }
        let inserted = before + elem.data('tag') + after;
        pos = inserted.length - after.length + 1;
        $('#toot_box')
            .val(inserted)
            .prop('selectionStart', pos)
            .prop('selectionEnd', pos)
            .focus();
    })
    .on('click', '.emoji_summary', function(e) {
        let term = $.terminal.active();
        if (term.name() === 'more') {
            term.pop();
        }
        if (term.name() !== 'instance') {
            return;
        }
        let shortcode = $(this).children('span').text();
        term.exec('show emojis custom detail ' + shortcode);
    })
    .on('click', '.a_acct', function(e) {
        let term = $.terminal.active();
        if (term.name() === 'more') {
            term.pop();
        }
        if (term.name() !== 'instance') {
            return;
        }

        let acct = $(this).text().match(/((?:@?([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z0-9]+))|(?:@([a-zA-Z0-9_]+)))/);
        callAPI('/api/v1/accounts/search', {
            data: {
                q: acct[0],
                limit: 1
            }
        })
        .then((data, status, jqxhr) => {
            term.exec('show user id ' + data[0].id);
        });
    })
    .on('click', '[name=cmd_link]', (e) => {
        let term = $.terminal.active();
        let type = $(e.target).data('type');
        let len = parseInt(term.rows() / 5);
        let sid = parse_sid($(e.target).data('sid'));
        let command
            = (type === 'show_followed')
                ? 'show user id ' + $(e.target).data('uid') + ' followers'
            : (type === 'show_following')
                ? 'show user id ' + $(e.target).data('uid') + ' following'
            : (type === 'show_statuses_pinned')
                ? 'show user id ' + $(e.target).data('uid') + ' statuses pinned'
            : (type === 'show_statuses')
                ? 'show user id ' + $(e.target).data('uid') + ' statuses limit ' + len
            : (type === 'request')
                ? 'request ' + $(e.target).data('req') + ' ' + $(e.target).data('uid')
            : (type === 'show_faved')
                ? 'show statuses id ' + sid.id + ' favourited'
            : (type === 'show_att' && sid.type === 'unix_id')
                ? 'show timeline local max_id ' + sid.front + ('000000' + (parseInt(sid.rear) + 1)).slice(-6)
            : (type === 'show_att' && sid.type === 'number')
                ? 'show timeline local max_id ' + (parseInt(sid.id) + 1)
            : (type === 'show_rebbed')
                ? 'show statuses id ' + sid.id + ' reblogged'
            : (type === 'del_status')
                ? 'request delete ' + sid.id
            : false;

        if (term.name() === 'more') {
            term.pop();
        }
        if (term.name() === 'instance' && command) {
            term.exec(command);
        }
    })
    .on('keydown', '.img_background', (event) => {
        if (event.keyCode === 27) {
            $('.img_background').trigger('click');
        }
    })
    .on('click', '.status_enquete span', function(e) {
        let enquete = $(e.target).parent();
        let index = $(enquete).children().index(e.target);
        let status = enquete.parents('.status');
        let time_limit = Date.now() - Date.parse($(enquete).data('created'));
        let term = $.terminal.active();

        if (time_limit > 30000) {
            term.error('The vote has expired.');
            return;
        }

        let api = '/api/v1/votes/' + $(status).data('sid');
        callAPI(api, {
            type: 'POST',
            data: { item_index: index }
        })
        .then((data, status, jqxhr) => {
            if (data.valid) {
                term.echo('Vote: ' + $(e.target).text());
            }
            else {
                term.error(data.message);
            }
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
        });

    })
    .on('click', '.toot_media img', (e,e2,e3) => {
        $(e.target).remove();
        $('#toot_box').val($('#toot_box').val().replace($(e.target).data('url'),''));
        if ($('#toot_media img').length === 0) {
            $('#toot_media').slideUp('first');
        }
    })
    .on('keydown', (e) => {
        if (e.keyCode === 65 && e.altKey && term_mode === mode_instance) {
            if ($('#toot').css('display') === 'none') {
                $.terminal.active().exec('toot');
            }
            else {
                $('#toot_box').focus();
                $.terminal.active().focus(false);
            }
        }
        else if (!e.target.id.match(/^toot_/)
            && !e.ctrlKey && e.keyCode !== 17
            && !e.altKey && e.keyCode !== 18)
        {
            $.terminal.active().focus(true, true);
        }
    })
    .on('click', 'a', (e) => {
        let link = $(e.currentTarget).prop('href');
        let path = link.replace(/https?:\/\//, '').split('/');
        let status = $(e.currentTarget).parents('.status:first');
        let params = {};
        let command = '';
        if (path[0] === '') {
            return false;
        }
        if (path[1] === 'users') {
            params.user = path[2];
        }
        if (path[1].match(/^@/)) {
            params.user = path[1].replace('@', '');
            if (typeof path[2] !== 'undefined') {
                params.status = path[2];
            }
        }
        if (path[2] === 'accounts') {
            params.account = path[3];
        }
        if (path[3] === 'statuses') {
            params.status = path[4];
        }
        if (path[2] === 'statuses') {
            params.status = path[3];
        }
        if (path[1] === 'tags') {
            params.tag = path[2];
        }

        if (params.tag) {
            command = 'show timeline tag ' + params.tag;
        }
        else if (path[0] === ins.get().domain && params.status) {
            command = 'show status id ' + params.status;
        }
        else if (params.status) {
            command = 'search local ' + link;
        }
        else if (path[0] === ins.get().domain && params.account) {
            command = 'show user id ' + params.account
        }
        else if (params.user) {
            command = 'show user name ' + params.user + '@' + path[0];
        }

        if (command !== '') {
            let term = $.terminal.active();
            if (term.name() === 'more') {
                term.pop();
            }
            if (term.name() === 'instance') {
                term.exec(command);
            }
        }
        else {
            window.open(link);
        }
        return false;
    });
    window.onerror = function(msg, url, line, col, error) {
        console.log([msg,url,line,col,error]); // エラーの内容
    };
    autosize($('#toot_box'));
});

/*****************************
 * その他処理
 *****************************/

/*
function getConfig(config, index, d_conf) {
    let idxs = index.split('.');
    let cf = config;
    for (let i = 0; i < idxs.length; i++) {
        if (typeof cf[idxs[i]] !== 'undefined') {
            cf = cf[idxs[i]];
        }
        else {
            cf = undefined;
            break;
        }
    }
    if (typeof cf !== 'undefined') {
        return cf;
    }

    cf = (typeof d_conf !== 'undefined' ? d_conf : defconf);
    for (let i = 0; i < idxs.length; i++) {
        cf = cf[idxs[i]];
        if (typeof cf === 'undefined') {
            break;
        }
    }
    return cf;
}*/

function makeStatus(payload, optional) {
    // 初期化とか
    let is_reblog = (payload.reblog !== null);
    let is_mention = (payload.type === 'mention');
    let contents = is_reblog  ? payload.reblog
                 : is_mention ? payload.status
                 : payload;
    let date = new Date(contents.created_at);

    if (typeof optional !== 'object') {
        optional = {};
    }
    let ins_name = (typeof optional.ins_name === 'undefined') ? ins.name() : optional.ins_name;

    let _ins = ins.get(optional.ins_name);

    let result = {
        html: '',
        text: '',
        is_reblog: is_reblog,
        is_mention: is_mention,
        instance: ins_name,
        visibility: true,
        payload: payload,
        notification: {
            voice: false,
            desktop: false,
            color: false
        }
    }

    // ヘッダー部作るよ
    let app;
    if (contents.application === null) {
        app = '';
    }
    else if(!contents.application.website) {
        app = ' via ' + contents.application.name;
    }
    else{
        app = $('<a />')
            .text(contents.application.name)
            .attr('href', contents.application.website)
            .attr('target', '_blank')
            .prop('outerHTML');
        app = ' via ' + app;
    }

    let head = (is_reblog ? $.terminal.format("[[!i;;]reblogged by " + escapeHtml(payload.account.display_name) + ' @' + payload.account.acct + ']') + "<br />" : '') + '[ '
        + (typeof contents.account.display_name === 'undefined' ? '' : escapeHtml(contents.account.display_name))
        + ' ' + $.terminal.format('[[!;;]@' + contents.account.acct + ']') + ' '
        + $('<i />').addClass('fa fa-' + (contents.favourited ? 'star' : 'star-o')).attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (contents.visibility === 'direct' || contents.visibility === 'private' ? 'times-circle-o'
                        : contents.reblogged ? 'check-circle-o' : 'retweet'))
                .attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (
                    contents.visibility === 'public'   ? 'globe'
                  : contents.visibility === 'unlisted' ? 'unlock'
                  : contents.visibility === 'private'  ? 'lock'
                  : contents.visibility === 'direct'   ? 'envelope'
                  : 'question'))
            .attr('aria-hidden', 'true').prop('outerHTML')
        + (contents.in_reply_to_id ? ' ' + $($('<i />').addClass('fa fa-commenting'))
                  .attr('aria-hidden', 'true').prop('outerHTML') + ' ' : '')
        + ' ' + date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':'
        + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3) + ' ]' + app;
    head = '<span>' + head + '</span>';
    result.text = $(head).text();
    head = parse_twemoji(head);

    let reply = '';
    if (contents.mentions.length > 0) {
        for (let i = 0; i < contents.mentions.length; i++) {
            reply += '@' + contents.mentions[i].acct + ' ';
        }
        reply = reply.replace('@' + _ins.user.acct + ' ', '');
    }

    // アイコン部作るよ
    let avatar = $('<div />').addClass('status_cell status_avatar');
    let cfg_avatar = config.find('instances.status.avatar');
    if (typeof cfg_avatar === 'undefined') {
        avatar.hide();
    }
    else {
        let url_s = contents.account.avatar_static;
        let url_m = contents.account.avatar;
        if (!url_s.match(/^http/)) {
            url_s = 'https://' + _ins.domain + url_s;
        }
        if (!url_m.match(/^http/)) {
            url_m = 'https://' + _ins.domain + url_m;
        }
        avatar
            .append($('<img />')
                .addClass('avatar_static')
                .attr('name', 'avatar_s_' + contents.account.id)
                .attr('src', url_s))
            .append($('<img />')
                .addClass('avatar_animate')
                .attr('name', 'avatar_m_' + contents.account.id)
                .attr('src', url_m));

        let img_s = new Image();
        img_s.onload = () => {
            $('[name=avatar_s_' + contents.account.id + ']').attr('src', url_s);
            if (url_s === url_m) {
                $('[name=avatar_m_' + contents.account.id + ']').attr('src', url_s);
            }
        };
        img_s.onerror = (e) => {
            console.log(e);
        };
        img_s.src = url_s;

        if (contents.account.avatar_static !== contents.account.avatar) {
            let img_m = new Image();
            img_m.onload = () => {
                $('[name=avatar_m_' + contents.account.id + ']').attr('src', url_m);
            };
            img_m.onerror = (e) => {
                console.log(e);
            };
            img_m.src = url_m;
        }

        if (payload.reblog) {
            let url_r = payload.account.avatar_static;
            let avatar_r = $('<div />')
                .append($('<img />')
                    .addClass('avatar_reblog')
                    .attr('name', 'avatar_s_' + payload.account.id)
                    .attr('src', url_r));
            let img_r = new Image();
            img_r.onload = () => {
                $('[name=avatar_m_' + payload.account.id + ']').attr('src', url_r);
            };
            img_r.onerror = (e) => {
                console.log(e);
            };
            img_r.src = url_r;
            avatar.append(avatar_r);
        }
    }

    // 本文部作るよ(ここから)
    let content;
    let enquete;

    // ニコフレアンケート機能だよ
    if (typeof contents.enquete !== 'undefined' && contents.enquete !== null) {
        enquete = JSON.parse(contents.enquete);
        question = enquete.question;
        if ($(question).find('span.fa-spin').length) {
            question = $('<p />').append($(question).find('span').text()).prop('outerHTML');
        }
        question = question.replace(
                /^(?:<p>)?(.*?)(?:<\/p>)?$/g, '<p><span>$1' +
                (enquete.type === 'enquete' ? '(回答枠)' : '(結果)')
                + '</span></p>')
        content = $('<div />').append(question);
        let enquete_items = $('<div />')
                .addClass('status_' + enquete.type)
                .attr('data-created', contents.created_at);
        for (let i = 0; i < enquete.items.length; i++) {
            if (enquete.type === 'enquete') {
                enquete_items.append($('<span />')
                    .html(enquete.items[i]));
            }
            else {
                enquete_items
                    .append($('<span />')
                        .append($('<span />')
                            .addClass('progress ratio')
                            .text(enquete.ratios[i] + '%'))
                        .append($('<span />')
                            .addClass('progress item')
                            .text(enquete.items[i]))
                        .append($('<span />')
                            .addClass('proceed')
                            .css('width', enquete.ratios[i].toString() + '%')))
            }
        }
        content = content.append(enquete_items).prop('outerHTML');
    }
    // その他の機能だよ
    else {
        content = contents.content;
        if (content.match(/^<.+>$/)) {
            content = content.replace(/<p>(.*?)<\/p>/g, '<p><span>$1</span></p>');
        }
        else {
            content = $('<p />').append($('<span />').html(content)).prop('outerHTML');
        }
        if ($(content).find('span.fa-spin').length) {
            content = $('<p />').append($(content).find('span').text()).prop('outerHTML');
        }
    }

/*
    let userid = content.match(/<a[^>]*?u-url.+?<\/a>/g);
    if (userid !== null) {
        for (let i = 0; i < userid.length; i++) {
            let _userid = $.terminal.format('[[!;;]' + $(userid[i]).text() + ']');
            content = content.replace(userid[i], _userid);
        }
    }
*/
    // サムネ作るよ
    let thumb;
    if (contents.media_attachments.length > 0) {
        thumb = $('<div />').addClass('status_thumbnail');
        contents.media_attachments.forEach((media, index, arr) => {
            let preview_url = (!media.preview_url.match(/^https?:\/\//)
                    ? 'https://' + _ins.domain + media.preview_url
                    : media.preview_url);
            let url = media.remote_url ? media.remote_url : media.url;
            let id = 'media_' + media.id;
            thumb.append($('<img />')
                .attr('id', id)
                .attr('src', preview_url)
                .attr('data-url', url)
                .attr('data-type', media.type));
            let img = new Image();
            img.onload = () => {
                $('#' + id).attr('src', preview_url);
            };
            img.onerror = (e) => {
                console.log(e);
            };
            img.src = preview_url;
        });
        let cfg = config.find('instances.status.thumbnail');
        if (typeof cfg === 'undefined') {
            thumb.hide();
        }
    }

    // コンテンツを隠しつつ絵文字をパースするよ
    let content_visible = $('<div />')
        .addClass('status_contents')
        .attr('id', 'status_contents');
    let content_more;
    let spoiler_text = contents.spoiler_text;

    result.text += (spoiler_text.length ? $('<div />').html(spoiler_text).text() : '') + $(content).text();

    // 絵文字をパースするよ
    if (contents.account.hasOwnProperty('profile_emojis') && contents.account.profile_emojis.length > 0) {
        head = parse_emojis(head, contents.account.profile_emojis);
    }
    if (contents.hasOwnProperty('profile_emojis') && contents.profile_emojis.length > 0) {
        content = parse_emojis(content, contents.profile_emojis);
        spoiler_text = parse_emojis(spoiler_text, contents.profile_emojis);
    }
    if (contents.account.hasOwnProperty('emojis') && contents.account.emojis.length > 0) {
        head = parse_emojis(head, contents.account.emojis);
    }
    if (contents.hasOwnProperty('emojis') && contents.emojis.length > 0) {
        content = parse_emojis(content, contents.emojis);
        spoiler_text = parse_emojis(spoiler_text, contents.emojis);
    }
    content = parse_twemoji(content);
    spoiler_text = parse_twemoji(spoiler_text);

    // コンテンツを隠すよ
    if (contents.sensitive) {
        content_more = $('<div />');
        if (spoiler_text.length > 0) {
            content_visible.append('<span>' + spoiler_text + '</span>');
            content_more.append(content);
        }
        else {
            content_visible.append(content);
        }

        if(typeof thumb !== 'undefined') {
            content_more.append(thumb);
        }
    }
    else {
        if (spoiler_text.length > 0) {
            content_visible.append('<span>' + spoiler_text + '</span>');
            content_more = $('<div />');
            content_more.append(content);
        }
        else {
            content_visible.append(content);
        }
        if (typeof thumb !== 'undefined') {
            content_visible.append(thumb);
        }
    }

    if (typeof content_more !== 'undefined') {
        content_visible
            .append($('<div />')
                .addClass('read_more')
                .append($.terminal.format('[[bu;black;gray]-- More --]')))
            .append(content_more.hide());
    }

    // DOM構造を作るよ
    let main = $('<div />')
        .addClass('status_cell status_main')
        .append($('<div />').addClass('status_head').html(head))
        .append(content_visible);

    let status = $('<div />')
        .attr('name', 'id_' + contents.id)
        .attr('data-sid', contents.id)
        .attr('data-instance', ins_name)
        .attr('data-uid', contents.account.id)
        .attr('data-dispname', contents.account.display_name)
        .attr('data-acct', contents.account.acct)
        .attr('data-fav', contents.favorited ? '1' : '0')
        .attr('data-reb', contents.reblogged ? '1' : '0')
        .attr('data-reply', reply)
        .addClass('status')
        .append($('<div />')
            .addClass('status_table')
            .append(avatar)
            .append($(main)));

    if (contents.id === 0) {
        status.attr('data-uri', contents.uri);
    }

    if (cfg_avatar === 'mouseover') {
        status.addClass('status_mouseover');
    }
    else if (cfg_avatar === 'animation') {
        status.addClass('status_animation');
    }
    else if (cfg_avatar === 'standard' || cfg_avatar === true) {
        status.addClass('status_standard');
    }

    if (typeof optional.tl_name === 'string') {
        let name = 'stream_' + contents.id;
        if ($('[name=' + name + ']').length > 0) {
            result.visibility = false;
            return result;
        }
        let n_stream = ws.stream.length - (!ws.monitor.home && ws.monitor.notification ? 1 : 0);
        if (n_stream > 1) {
            let tl = $('<div />')
                .attr('name', name)
                .append($('<span />')
                    .html(optional.tl_name + ' streaming updated.'));
            result.text = tl.text() + result.text;
            status.prepend(tl);
        }
    }
    // 本文部作るよ(ここまで)

    // ACL処理するよ
    if (ins.acls.hasOwnProperty(ins_name)) {
        for (let acl_num in ins.acls[ins_name]) {
            let acl = ins.acls[ins_name][acl_num];
            if (result.text.match(acl.regexp)) {
                if(acl.type === 'deny') {
                    result.visibility = false;
                    break;
                }
                else if (acl.type === 'drop') {
                    break;
                }
                let _params = url_params.hasOwnProperty('acl') ? url_params.acl : "";
                _params = _params.split(',');
                if (acl.type === "permit" && acl.hasOwnProperty('color') && _params.indexOf('col') < 0) {
                    status.addClass('status_' + acl.color);
                    result.notification.color = acl.color;
                }
                let cfg_notify = config.find(['instances', 'terminal', 'monitor', 'notification'])
                if (acl.type === "permit" && acl.notify && _params.indexOf('not') < 0) {
                    let title = 'ACL ' + acl_num + ': '
                        + contents.account.display_name + ' @' + contents.account.acct;
                    let body = $(contents.content).text();
                    if (body.length > 100) {
                        body = body.slice(0, 100);
                    }
                    result.notification.desktop = {
                        title: title,
                        body: body,
                        icon: contents.account.avatar_static
                    };
                }
                if (acl.type === "permit" && acl.hasOwnProperty('voice') && _params.indexOf('voi') < 0) {
                    result.notification.voice = acl.voice;
                }
                break;
            }
        }
    }

    // 後処理して終了
    if (config.find('instances.status.separator')) {
        status.append(
            '<div><span>'
            + Array($.terminal.active().cols() - 5).join('-')
            + '</span></div>'
        );
    }
    status.append($('<div />')
        .addClass('status_all')
        .css('display', 'none')
        .text(JSON.stringify(payload)));
    result.html = status.prop('outerHTML');
    return result;
}

function make_notification(payload, notifies) {
    let is_fav = (payload.type === 'favourite') && notifies.favourite;
    let is_reb = (payload.type === 'reblog') && notifies.reblog;
    let is_fol = (payload.type === 'follow') && notifies.following;
    let is_men = (payload.type === 'mention') && notifies.mention;

    let result = {
        html: ''
    }

    let msg = '';
    if (is_fav || is_reb || is_fol || is_men) {
        let content = payload.status
                ? $.terminal.escape_brackets($(payload.status.content).text())
                : '(Status was deleted)';
        if (content.length > 100) {
            content = content.slice(0,100) + ' ...';
        }

        msg = '<i class="fa fa-' + (
                (payload.type === 'favourite') ? 'star' :
                (payload.type === 'reblog') ? 'retweet' :
                (payload.type === 'mention') ? 'commenting' :
                (payload.type === 'follow') ? 'handshake-o' : 'bell')
            + '" aria-hidden="true"></i> '
            + payload.account.display_name + ' '
            + $.terminal.format('[[!;;]@' + payload.account.acct + ']') + "<br />"
            + (payload.status ? content : '');
        msg = $('<span />').html(msg).addClass('status_notify').prop('outerHTML');
        if (payload.account.hasOwnProperty('profile_emojis') && payload.account.profile_emojis.length > 0) {
            msg = parse_emojis(msg, payload.status.account.profile_emojis);
        }
        if (payload.hasOwnProperty('emojis') && payload.emojis.length > 0) {
            msg = parse_emojis(msg, contents.emojis);
        }
        msg = parse_twemoji(msg);
        if (payload.type === 'mention') {
            result.status = makeStatus(payload.status);
            msg += result.status.html;
        }
    }
    result.html = msg;
    return result;
}

function parse_emojis(cont, emojis = []) {
    for (let i = 0; i < emojis.length; i++) {
        let img_name = 'emoji_' + emojis[i].shortcode.replace(/^@/, 'p-');
        let url = emojis[i].url;
        let tag = ':' + emojis[i].shortcode + ':';
        let e_tag = $('<img />')
            .addClass('emoji')
            .attr('name', img_name)
            .attr('alt', tag)
            .attr('title', tag)
            .attr('src', url);
        let re = new RegExp(tag + '(?!")', 'g')
        cont = cont.replace(re, e_tag.prop('outerHTML'));

        let img = new Image();
        img.onload = () => {
            $('[name=' + img_name + ']').attr('src', url);
        };
        img.onerror = (e) => {
            console.log(e);
        };
        img.src = url;
    }
    return cont;
}

function parse_twemoji(content) {
    return twemoji.parse(content, {
        callback: (icon, options) => {
            return './72x72/' + icon + '.png';
        },
        attributes: (icon, code) => {
            return {
                title: code
            };
        }
    });
}

function parse_sid(sid) {
    let b16 = Math.pow(2, 16);
    let str_id = new String(sid);
    let parsed = {};
    if (str_id.length > 16) {
        parsed.type = 'unix_id';
        parsed.unix = parseInt(str_id / b16);
        parsed.front = str_id.slice(0, -6);
        parsed.rear = str_id.slice(-6);
        parsed.id = str_id.toString();
    }
    else if(parseInt(str_id.toString())) {
        parsed.type = 'number';
        parsed.id = str_id.toString();
    }
    else {
        parsed.type = 'error'
    }
    return parsed;
}

function post_status() {
    let status = $('#toot_box').val().trim();
    let _ins = ins.get();
    let msg_size = 500 - $('#toot_box').val().length - $('#toot_cw').val().length;
    if (status.length === 0 || msg_size < 0) {
        return false;
    }
    else if(typeof _ins === 'undefined'
         && typeof _ins.access_token === 'undefined') {
        return false;
    }
    status = status
        .replace(/(:[a-zA-Z0-9_]{2,}:) /g, '$1' + String.fromCharCode(8203))
        .replace(/ (:[a-zA-Z0-9_]{2,}:)/g, String.fromCharCode(8203) + '$1');

    let cw = $('#toot_cw').val().trim();
    let visibility = $('#toot_visibility').val();
    let data = {
        status: status,
        visibility: visibility
    };
    if (cw.length !== 0) {
        cw = cw
            .replace(/(:[a-zA-Z0-9_]{2,}:) /g, '$1' + String.fromCharCode(8203))
            .replace(/ (:[a-zA-Z0-9_]{2,}:)/g, String.fromCharCode(8203) + '$1');
        data.spoiler_text = cw;
    }

    let reply_id = $('.reply #sid').text();
    if (reply_id !== '') {
        data.in_reply_to_id = reply_id;
    }

    data.media_ids = [];
    let imgs = $('#toot_media img');
    for (let i = 0; i < imgs.length; i++) {
        data.media_ids.push($(imgs[i]).data('id'));
    }

    if (data.media_ids.length > 0) {
        data.sensitive = $('#nsfw').prop('checked');
    }

    return $.ajax({
        url: 'https://' + _ins.domain + '/api/v1/statuses',
        type: 'POST',
        headers: {
            Authorization: _ins.token_type + ' ' + _ins.access_token
        },
        data: data,
        timeout: 5000
    }).then((data, status, jqxhr) => {
        let visibility = config.find('instances.visibility');
        if (typeof visibility === 'undefined') {
            visibility = 'public';
        }
        $('#toot_cw').val('');
        $('#toot_visibility').val(visibility);
        $('#reply_close').trigger('click');
        $('#toot_media').html('');
        $('#toot_box').val('').trigger('keyup').focus();
        autosize.update($('#toot_box'));
    }, (jqxhr, status, error) => {
        $.terminal.active().error('Toot post error.(' + jqxhr.status + ')');
        console.log(jqxhr);
    });
}

function reduce_output() {
    let outputs = $('.terminal-output>div');
    let old_outputs = outputs.length - 220;
    for (let i = 0; i < old_outputs; i++) {
        $(outputs[i]).remove();
    }
}

function callAPI(path, opts = {}) {
    let def;
    let _ins = typeof opts.instance_name === 'undefined'
            ? ins.get() : ins.get(opts.instance_name);
    if (typeof path === 'undefined') {
        def = new $.Deferred;
        def.reject('Undefined path');
    }
    else if (typeof _ins === 'undefined') {
        def = new $.Deferred;
        def.reject('No instance');
    }
    else if (typeof _ins.access_token === 'undefined') {
        def = new $.Deferred;
        def.reject('No login');
    }
    else {
        def = $.ajax({
            url: 'https://' + _ins.domain + path,
            type: typeof opts.type !== 'undefined' ? opts.type : 'GET',
            headers: {
                Authorization: _ins.token_type + ' ' + _ins.access_token
            },
            data: typeof opts.data ? opts.data : '',
            dataType: 'json',
            timeout: 5000
        })
        .done((data, status, jqxhr) => {
            return jqxhr;
        })
        .fail((jqxhr, status, error) => {
            term_error('API Request Error', {
                path: path,
                opts: opts
            });
            return jqxhr;
        });
    }
    return def;
}

function callMore(path, cb_mkmsg, optional = {}) {
    let limit = 20;
    let statuses = [];
    let data = {};
    let term;
    let current_sid;
    let raw = true;
    let params = {};

    if (optional.hasOwnProperty('params')) {
        data = optional.params;
    }

    if (optional.hasOwnProperty('limit')) {
        limit = optional.limit;
    }

    if (optional.hasOwnProperty('term')) {
        term = optional.term;
    }
    else {
        term = $.terminal.active();
    }

    if (optional.hasOwnProperty('raw')) {
        raw = optional.raw;
    }

    term.push(function(command, moreterm){ reduce_output(); },{
        name: 'more',
        //prompt: '[[;#111111;#DDDDDD]-- More --]',
        prompt: '--More-- ',
        onStart: function(moreterm){
            moreterm.pause();
            data.limit = limit;
            callAPI(path, {
                type: 'GET',
                data: data
            }).then((data, status, jqxhr) => {
                if (optional.hasOwnProperty('header')) {
                    moreterm.echo(optional.header);
                }
                for (let i = 0; i < data.length; i++) {
                    let msg = cb_mkmsg(data[i]);
                    if (msg) {
                        moreterm.echo(msg, {raw: raw});
                    }
                    if (optional.hasOwnProperty('next')) {
                        current_sid = optional.next(data, jqxhr);
                    }
                    else {
                        current_sid = data[i].id;
                    }
                }
                if (current_sid <= 0) {
                    moreterm.pop();
                }
                moreterm.resume();
            }, (jqxhr, status, error) => {
                moreterm.error('Getting data is failed.(' + jqxhr.status + ')');
                console.log(jqxhr);
                moreterm.pop();
                moreterm.resume();
            });
        },
        onExit: function(moreterm) {
            if (optional.hasOwnProperty('footer')) {
                moreterm.echo(optional.footer);
            }
            setTimeout(function() {
                moreterm.set_command('');
            }, 10);
            moreterm.resume();
        },
        keydown: function(event, moreterm){
            function echo_statuses(size) {
                if (!(size > 0)) {
                    return;
                }
                size = statuses.length < size ? statuses.length : size;
                let updated = [];
                for (let i = 0; i < size; i++) {
                    let stats = statuses.shift();
                    moreterm.echo(stats, {raw: raw, flush: false});
                }
                moreterm.flush();
            }
            switch(event.keyCode){
                /* 入れようと思ったけど、more中にコピーが出来なくなるので辞めた(暫定)
                case 67: // c
                    if (!event.ctrlKey) {
                        break;
                    }*/
                case 27: // Esc
                case 81: // q
                    moreterm.pop();
                    moreterm.set_command('');
                case 16: // Ctrl only
                case 17: // Alt only
                case 18: // Shift only
                    break;
                case 13: // Enter
                default: // Other
                    moreterm.pause();
                    let echo_size = (event.keyCode === 13) ? 1 : limit;
                    data.limit = 100;
                    if (current_sid > 0) {
                        data.max_id = current_sid;
                    }
                    else if (statuses.length === 0){
                        moreterm.pop();
                    }
                    if (!(statuses.length > 0)) {
                        callAPI(path, {
                            type: 'GET',
                            data: data
                        })
                        .then((data, status, jqxhr) => {
                            if (data.length === 0) {
                                moreterm.pop();
                                return;
                            }
                            statuses = [];
                            for (let i = 0; i < data.length; i++) {
                                let msg = cb_mkmsg(data[i]);
                                if (msg) {
                                    statuses.push(msg);
                                }
                                if (optional.hasOwnProperty('next')) {
                                    current_sid = optional.next(data, jqxhr);
                                }
                                else {
                                    current_sid = data[i].id;
                                }
                            }
                            echo_statuses(echo_size);
                            moreterm.resume();
                            if (statuses.length === 0 && current_sid <= 0) {
                                moreterm.pop();
                            }
                        }, (jqxhr, status, error) => {
                            console.log(jqxhr);
                            moreterm.error('Getting data is failed.(' + jqxhr.status + ')');
                        });
                    }
                    else {
                        echo_statuses(echo_size);
                        moreterm.resume();
                        if (statuses.length === 0 && current_sid <= 0) {
                            moreterm.pop();
                        }
                    }
                    setTimeout(() => { moreterm.set_command(''); }, 10);
            }
            reduce_output();
            return true;
        }
    });
}

function favourite(status, term) {
    if ($(status).data('sid') <= 0) {
        term.error('couldn\'t send a request (search engine status).');
        return;
    }
    let isFav = ($(status).data('fav') == 1);
    let head_fa = $(status).find('.status_head i');
    let api = '/api/v1/statuses/'
            + $(status).data('sid').toString()
            + (isFav ? '/unfavourite' : '/favourite' );
    if (typeof term === 'undefined') {
        term = $.terminal.active();
    }

    $(head_fa[0]).removeClass().addClass('fa fa-spinner fa-pulse');

    callAPI(api, {
        instance_name: $(status).data('instance'),
        type: 'POST'
    }).then((data, stat, jqxhr) => {
        $('[name=id_' + $(status).data('sid').toString() + ']').each((index, elem) => {
            $(head_fa[0])
                .removeClass()
                .addClass('fa fa-' + (data.favourited ? 'star' : 'star-o'))
            $(elem).data('fav', data.favourited ? '1' : '0');
        });
        if (isFav === data.favourited) {
            term.error('favourited missed...');
        }
    }, (jqxhr, stat, error) => {
        $.terminal.active().error('Favorite failed.(' + jqxhr.status + ')');
        $(head_fa[0]).removeClass().addClass('fa fa-' + (isFav ? 'star' : 'star-o'));
        console.log(jqxhr);
    });
}

function closeTootbox() {
    $('#sid').text('');
    $('#reply').hide();
    $('#toot_box').val('');
    $('#toot').slideUp('first');
    $.terminal.active().enable();
}

function boost(status) {
    if ($(status).data('sid') <= 0) {
        term.error('couldn\'t send a request (search engine status).');
        return;
    }
    let head_fa = $(status).find('.status_head i');
    if ($(head_fa[1]).hasClass('fa-times-circle-o')) {
        return;
    }
    let isReb = ($(status).data('reb') == 1);
    let api = '/api/v1/statuses/'
            + $(status).data('sid').toString()
            + (isReb ? '/unreblog' : '/reblog' );
    if (typeof term === 'undefined') {
        term = $.terminal.active();
    }

    $(head_fa[1]).removeClass().addClass('fa fa-spinner fa-pulse');

    callAPI(api, {
        instance_name: $(status).data('instance'),
        type: 'POST'
    }).then((data, stat, jqxhr) => {
        $('[name=id_' + $(status).data('sid').toString() + ']').each((index, elem) => {
            $(head_fa[1])
                .removeClass()
                .addClass('fa fa-' + (data.reblogged ? 'check-circle-o' : 'retweet'))
            $(elem).data('reb', data.reblogged ? '1' : '0');
        });
        if (isReb === data.reblogged) {
            term.error('reblogged missed...');
        }
    }, (jqxhr, stat, error) => {
        $.terminal.active().error('Reblogged failed.(' + jqxhr.status + ')');
        $(head_fa[1]).removeClass().addClass('fa fa-' + (isReb ? 'check-circle-o' : 'retweet'));
        console.log(jqxhr);
    });
}

function tab(arg1, arg2, indent){
    let arg1_escape = escape(arg1).replace(/%u[0-9a-f]{2,6}/ig, 'xx').replace(/%[0-9a-f]{2}/ig, 'x');
    let arg1_length = arg1_escape.length;

    let result = (indent <= arg1_length)
        ? arg1.substr(0, indent - 4) + '... ' : arg1;

    for(let i = arg1_length; i < indent; i++, result += ' ') {}
    return result + arg2;
}

String.prototype.addTab = function(arg1, indent){
    return tab(arg1, this, indent);
};

function term_error(msg, params) {
    let date = new Date();
    let _params;
    let s_config = localStorage.getItem('configuration');
    let errors = localStorage.getItem('term_error');
    errors = errors ? JSON.parse(errors) : [];

    s_config = s_config ? s_config : {};
    if (typeof params === 'object') {
        _params = JSON.parse(JSON.stringify(params));
    }
    else if (!params) {
        _params = {};
    }
    else {
        _params = params;
    }
    let info_text = JSON.stringify({
        running_config: config.config,
        startup_config: s_config,
        default_config: config.default,
        instances: ins.instances,
        status: {
            message: msg,
            created_at: date.getTime(),
        },
        params: _params
    });
    errors.push(JSON.parse(info_text));
    if (errors.length > 5) {
        errors.shift();
    }
    localStorage.setItem('term_error', JSON.stringify(errors));
}

function OutputText(text, fileName) {
    let b = new Blob(["\uFEFF", text]);
    if (navigator.msSaveBlob) {
        navigator.msSaveOrOpenBlob(b, fileName);
    } else {
        let a = $('<a />')
            .attr('href', URL.createObjectURL(b))
            .attr('download', fileName)
            .attr('target', '_blank')
        $('body').append(a);
        a[0].click();
        a.remove();
    }
}

function escapeHtml(string) {
    if(typeof string !== 'string') {
        return string;
    }
    return string.replace(/[&'`"<>]/g, function(match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}

function more(term, lines, optional = {}){
    let rows = term.rows();
    let command = term.get_command();
    let i = 0;
    term.push(function(command,term){},{
        name: 'more',
        //prompt: '[[;#111111;#DDDDDD]-- More --]',
        prompt: '--More-- ',
        onStart: function(moreterm){
            moreterm.echo(lines.slice(i, i + rows).join("\n"), optional.echo_opt);
            i += rows;
            if(i > lines.length){
                moreterm.pop();
                if(optional.reverse) moreterm.set_command(command);
            }
            moreterm.resume();
        },
        keydown: function(event, moreterm){
            switch(event.keyCode){
                case 81:
                    moreterm.pop();
                    if(optional.reverse) moreterm.set_command(command);
                    break;
                case 13:
                    moreterm.echo(lines.slice(i, i + 1).join("\n"), optional.echo_opt);
                    i++;
                    if(i > lines.length){
                        moreterm.pop();
                        if(optional.reverse) moreterm.set_command(command);
                    }
                    break
                default:
                    moreterm.echo(lines.slice(i, i + rows).join("\n"), optional.echo_opt);
                    i += rows;
                    if(i > lines.length){
                        moreterm.pop();
                        if(optional.reverse) moreterm.set_command(command);
                    }
                    moreterm.set_command("");
                    break;
            }
            return false;
        }
    });
}
function begin(term, lines, reverse, search){
    let i = 0;
    //console.log(search);
    //var re = new RegExp('\\s*' + search.name + '\\s+', '');
    //var keyword = search.command.replace(re, '');
    //console.log("//" + keyword + "/s/");
    for(i = 0; i < lines.length; i++){
        if(lines[i].match(search)){
            break;
        }
    }
    //console.log(["begin",result]);
    more(term, lines.slice(i), reverse, search);
}

function include(term, lines, reverse, search){
    let result = [];
    for(let i = 0; i < lines.length; i++){
        if(lines[i].match(search)){
            result.push(lines[i]);
        }
    }
    more(term, result, reverse);
}
function exclude(term, lines, reverse, search){
    let result = [];
    for(let i = 0; i < lines.length; i++){
        if(!lines[i].match(search)){
            result.push(lines[i]);
        }
    }
    more(term, result, reverse);
}

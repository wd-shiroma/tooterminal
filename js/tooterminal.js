/*****************************
 * 設定
 *****************************/

var def_conf = {
    application: {
        name: 'Tooterminal',
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
        monitor: 'local',
        status: {},
    }
}

var config;
var instances;
var prompt;

var term_mode;
var mode_global;
var mode_configuration;
var mode_instance;

/*****************************
 * 本処理
 *****************************/

var enterCommand = (command, term) => {
    command = command.trim();

    if (command.length === 0) {
        return;
    }

    var result = term_mode.execute(command, term);
    if (result !== true) {
        term.error(term_mode.result.message);
    }
    return;

};

var completion = (line, callback) => {
    var cmd_list = term_mode.getCompletion(line);
    if (cmd_list.length === 1) {
        $.terminal.active().set_command(term_mode.completion);
    }
    else {
        callback(cmd_list);
    }
};

var initConfig = (term) => {
    var store = localStorage;
    var str = store.getItem('configuration');
    if (str) {
        config = JSON.parse(str);
    }
    else {
        console.log('Initialization: read default config')
        config = def_conf;
    }

    str = store.getItem('instances');
    if (str) {
        instances = JSON.parse(str);
    }
    else {
        instances = {};
    }
};

var filterKey = (event, term) => {
    if(event.charCode === 63){
        var info = term_mode.information(term.get_command());

        var lines = info.map((cmd) => {
            return (typeof cmd.command === 'undefined')
                ? cmd : ('  ' + tab(cmd.command, cmd.description, 30));
        });
        lines.unshift(term.get_prompt() + term.get_command() + '?');
        lines.push('');
        more(term, lines, true);
        var cmd = term.get_command();
        term.set_command('');
        setTimeout(() => {
            term.set_command(cmd);
        },10);
    }
};

var parseCommand = (command, term) => {
    term_mode.parse(command.replace(/\?$/, ''));
};

var tl;
$(function() {
    mode_global        = new ModeManager(new GlobalModeElement);
    mode_configuration = new ModeManager(new ConfigurationModeElement);
    mode_instance      = new ModeManager(new InstanceModeElement);
    term_mode          = mode_global;
    tl = $('#timeline').terminal(enterCommand, {
        name:        'global',
        greetings:   "=== CLI画面風 マストドンクライアント \"Tooterminal\" ===\n\n使い方は\"help\"コマンドまたは\"?\"キーを押してください。\n\n",
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
        onFocus:      (term) => { return false; },
        onResume:     false,
        onCommandChange: parseCommand,
    });
    $('#toot').on('keydown', (event) => {
        if (event.keyCode === 27) {
            $('#sid').text('');
            $('#reply').hide();
            $('#toot_box').val($('#toot_box').val().replace(/^@[a-zA-Z0-9_]+\s?/, ''));
            $('#toot').slideUp('first');
        }
        else if(event.keyCode === 13 && event.ctrlKey) {
            post_status();
        }
        else if ($('#toot_box').val().match(/^@[0-9a-zA-Z_]+/) && $('.reply #sid').text() === '') {
            $('#toot_visibility').val('unlisted');
        }
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
            var imageFile = elem.originalEvent.clipboardData.items[0].getAsFile();
            var formData = new FormData();
            var ins = instances[instance_name];
            var len = $('.toot_media img').length;
            $('#toot_media').append($('<img />').attr('id', 'media_' + len));
            formData.append('file', imageFile);
            $.ajax('https://' + ins.domain + '/api/v1/media' , {
                type: 'POST',
                contentType: false,
                processData: false,
                headers: {
                    Authorization: ins.token_type + ' ' + ins.access_token
                },
                data: formData
            }).then((data, status, jqxhr) => {
                $('#media_' + len)
                    .attr('data-id', data.id)
                    .attr('data-url', data.text_url);
                var img = new Image();
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
    });
    $('#toot').on('dragenter', (e) => {
        //
    });
    var count_toot_size = () => {
        var msg_size = 500 - $('#toot_box').val().length - $('#toot_cw').val().length;
        $('#toot_size').css('color', msg_size < 0 ? '#F00' : '#bbb').text(msg_size);
    }
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
        $('#toot_box').val($('#toot_box').val().replace(/^@[a-zA-Z0-9_]+\s?/, ''));
    });
    $('.img_background').on('click', function(){
        $('#img_view').fadeOut('first');
        $('.img_background').fadeOut('first');
        $.terminal.active().enable();
    });
    $(document)
    .on('click', '.read_more', function() {
        $(this).next().toggle('fast');
    })
    .on('click', '.a_acct', function(e) {
        if (term_mode !== mode_instance) {
            return;
        }
        var acct = $(this).text().match(/((?:@?([a-zA-Z0-1_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-1_]+)))/);
        callAPI('/api/v1/accounts/search', {
            data: {
                q: acct[0],
                limit: 1
            }
        })
        .then((data, status, jqxhr) => {
            $.terminal.active().exec('show statuses id ' + data[0].id + ' limit 10')
            .done(() => {
                $.terminal.active().exec('show user id ' + data[0].id);
            })
        })
    })
    .on('mouseover', '.status', function() {
        var cfg = getConfig(config, 'instances.status.thumbnail', def_conf);
        if (typeof cfg === 'undefined'){
            $(this).find('.status_thumbnail').show();
        }
    })
    .on('mouseout', '.status', function() {
        var cfg = getConfig(config, 'instances.status.thumbnail', def_conf);
        if (typeof cfg === 'undefined'){
            $(this).find('.status_thumbnail').hide();
        }
    })
    .on('click', '.status', function(e) {
        if ($(this).hasClass('status_deleted')) {
            return;
        }
        var id = $(this).data('sid');
        if (e.shiftKey) {
            $('#toot').slideDown('first');
            $('#toot_box').focus().val('@' + $(this).data('acct').toString() + ' ');
            $('#reply').show();
            $('#sid').text($(this).data('sid'));
            $('#reply_head').text('reply to: ' + $(this).data('dispname'));
            $('#reply_body').text($(this).find('#status_contents')[0].textContent);
            if ($($(this).find('.status_head i')[2]).hasClass('fa-envelope')) {
                $('#toot_visibility').val('direct');
            }
        }
        if (e.ctrlKey) {
            favorite(this);
        }
        if (e.altKey) {
            boost(this);
        }
    })
    .on('click', '.status_contents img', function(e) {
        var elem = $(this);
        var img = new Image();
        img.onload = () => {
            $('#img_view').attr('src', elem.data('url')).fadeIn('first');
        };
        img.onerror = (e) => {
            console.log(e);
        };
        $('.img_background').fadeIn('first');
        $.terminal.active().disable();
        img.src = elem.data('url');
    })
    .on('keydown.img_background', (event) => {
        if (event.keyCode === 27) {
            $('.img_background').trigger('click');
        }
    })
    .on('click', '.status_enquete span', function(e) {
        $.terminal.active().echo('まだ投票できないです。。。');
    })
    .on('click', '.toot_media img', (e,e2,e3) => {
        $(e.target).remove();
        $('#toot_box').val($('#toot_box').val().replace($(e.target).data('url'),''));
    })
    .on('keydown', (e) => {
        if (e.keyCode === 65 && e.altKey && term_mode === mode_instance && $('#toot').css('display') === 'none') {
            $.terminal.active().exec('toot');
        }
    });
    autosize($('#toot_box'));
});

/*****************************
 * その他処理
 *****************************/


function getConfig(config, index, d_conf) {
    var idxs = index.split('.');
    var cf = config;
    for (var i = 0; i < idxs.length; i++) {
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

    cf = (typeof d_conf !== 'undefined' ? d_conf : def_conf);
    for (var i = 0; i < idxs.length; i++) {
        cf = cf[idxs[i]];
        if (typeof cf === 'undefined') {
            break;
        }
    }
    return cf;
}

function makeStatus(payload){
    var date = new Date(payload.created_at);
    var is_reblog = (typeof payload.reblog !== 'undefined' && payload.reblog !== null);
    var is_mention = (payload.type === 'mention');
    var contents = is_reblog  ? payload.reblog
                 : is_mention ? payload.status
                 : payload;

    var head = (is_reblog ? $.terminal.format("[[i;;]reblogged by " + payload.account.display_name + ' @' + payload.account.acct + ']') + "<br />" : '') + '[ '
        + (typeof contents.account.display_name === 'undefined' ? '' : contents.account.display_name)
        + ' ' + $.terminal.format('[[!;;]@' + contents.account.acct + ']') + ' '
        + $('<i />').addClass('fa fa-' + (contents.favourited ? 'star' : 'star-o')).attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (contents.reblogged ? 'check-circle-o' : 'retweet')).attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (
                    contents.visibility === 'public'   ? 'globe'
                  : contents.visibility === 'unlisted' ? 'unlock'
                  : contents.visibility === 'private'  ? 'lock'
                  : contents.visibility === 'direct'   ? 'envelope'
                  : 'question'))
            .attr('aria-hidden', 'true').prop('outerHTML')
        + ' ' + date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':'
        + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3)
        + ' ]' + (contents.application !== null ? ' from ' + contents.application.name : '');

    var avatar = $('<td />').addClass('status_avatar');
    var cfg = getConfig(config, 'instances.status.avatar', def_conf);
    if (typeof cfg !== 'undefined') {
        avatar.append($('<img />').attr('name', 'img_' + contents.account.id));
        var img = new Image();
        img.onload = () => {
            $('[name=img_' + contents.account.id + ']').attr('src', contents.account.avatar_static);
        };
        img.onerror = (e) => {
            console.log(e);
        };
        img.src = contents.account.avatar_static;
    }
    else {
        avatar.hide();
    }

    var content;
    var enquete;

    if (typeof contents.enquete !== 'undefined' && contents.enquete !== null) {
        enquete = JSON.parse(contents.enquete);
        content = $('<div />').append(enquete.question
            .replace(/<p>(.*?)<\/p>/g, '<p><span>$1' + (enquete.type === 'enquete' ? '(回答枠)' : '(結果)') + '</span></p>'));
        var enquete_items = $('<div />').addClass('status_' + enquete.type);
        for (var i = 0; i < enquete.items.length; i++) {
            if (enquete.type === 'enquete') {
                enquete_items.append($('<span />')
                    .html(enquete.items[i]));
            }
            else {
                enquete_items
                    .append($('<span />')
                        .append($('<span />')
                            .addClass('progress')
                            .text(enquete.items[i]))
                        .append($('<span />')
                            .addClass('proceed')
                            .css('width', enquete.ratios[i].toString() + '%')));
            }
        }
        content.append(enquete_items);
    }
    else {
        content = contents.content;
        if (content.match(/^<.+>$/)) {
            content = content.replace(/<p>(.*?)<\/p>/g, '<p><span>$1</span></p>')
        }
    }

    var thumb;
    if (contents.media_attachments.length > 0) {
        thumb = $('<div />').addClass('status_thumbnail');
        contents.media_attachments.forEach((media, index, arr) => {
            var id = 'media_' + media.id;
            thumb.append($('<img />').attr('id', id).attr('data-url', media.url));
            var img = new Image();
            img.onload = () => {
                $('#' + id).attr('src', media.preview_url);
            };
            img.onerror = (e) => {
                console.log(e);
            };
            img.src = media.preview_url;
        });
        var cfg = getConfig(config, 'instances.status.thumbnail', def_conf);
        if (typeof cfg === 'undefined') {
            thumb.hide();
        }
    }

    var content_visible = $('<div />')
        .addClass('status_contents')
        .attr('id', 'status_contents');
    var content_more;

    if (contents.sensitive) {
        content_more = $('<div />');
        if (contents.spoiler_text.length > 0) {
            content_visible.append($.terminal.format(contents.spoiler_text));
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
        if (contents.spoiler_text.length > 0) {
            content_visible.append($.terminal.format(contents.spoiler_text));
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

    var main = $('<td />')
        .addClass('status_main')
            .append($('<div />').addClass('status_head').html($.terminal.format(head)))
            .append(content_visible);


    var status = $('<table />')
        .attr('name', 'id_' + contents.id)
        .attr('data-sid', contents.id)
        .attr('data-instance', instance_name)
        .attr('data-uid', contents.account.id)
        .attr('data-dispname', contents.account.display_name)
        .attr('data-acct', contents.account.acct)
        .attr('data-fav', contents.favorited ? '1' : '0')
        .attr('data-reb', contents.reblogged ? '1' : '0')
        .addClass('status')
        .append(avatar)
        .append(main);
    return status.prop('outerHTML');
}

function post_status() {
    var status = $('#toot_box').val().trim();
    var cw = $('#toot_cw').val().trim();
    var visibility = $('#toot_visibility').val();
    var data = {
        status: status,
        visibility: visibility
    };
    var msg_size = 500 - $('#toot_box').val().length - $('#toot_cw').val().length
    if (status.length === 0 || msg_size < 0) {
        return false;
    }
    else if(typeof instances[instance_name] === 'undefined'
         && typeof instances[instance_name].access_token === 'undefined') {
        return false;
    }
    if (cw.length !== 0) {
        data.spoiler_text = cw;
    }

    var reply_id = $('.reply #sid').text();
    if (reply_id !== '') {
        data.in_reply_to_id = reply_id;
    }

    data.media_ids = [];
    var imgs = $('#toot_media img');
    for (var i = 0; i < imgs.length; i++) {
        data.media_ids.push($(imgs[i]).data('id'));
    }

    return $.ajax({
        url: 'https://' + instances[instance_name].domain + '/api/v1/statuses',
        type: 'POST',
        headers: {
            Authorization: instances[instance_name].token_type + ' ' + instances[instance_name].access_token
        },
        data: data
    }).then((data, status, jqxhr) => {
        var visibility = getConfig(config, 'instances.visibility', def_conf);
        if (typeof visibility === 'undefined') {
            visibility = 'public';
        }
        $('#toot_cw').val('');
        $('#toot_box').val('').trigger('keyup');
        $('#toot_visibility').val(visibility);
        $('#reply_close').trigger('click');
        $('#toot_media').html('');
        autosize.update($('#toot_box'));
        $('#toot').slideUp('fast');
        $('#timeline').focus();
    }, (jqxhr, status, error) => {
        $.terminal.active().error('Toot post error.(' + jqxhr.status + ')');
        console.log(jqxhr);
    });
}

function callAPI(path, opts = {}) {
    var def;
    var ins = typeof opts.instance_name === 'undefined'
            ? instances[instance_name] : instances[opts.instance_name];
    if (typeof path === 'undefined') {
        def = new $.Deffered;
        def.reject('Undefined path');
    }
    else if (typeof ins === 'undefined') {
        def = new $.Deffered;
        def.reject('No instance');
    }
    else if (typeof ins.access_token === 'undefined') {
        def = new $.Deffered;
        def.reject('No login');
    }
    else {
        def = $.ajax({
            url: 'https://' + ins.domain + path,
            type: typeof opts.type !== 'undefined' ? opts.type : 'GET',
            headers: {
                Authorization: ins.token_type + ' ' + ins.access_token
            },
            data: typeof opts.data ? opts.data : '',
            dataType: 'json'
        });
    }
    return def;
}

function favorite(status, term) {
    var isFav = ($(status).data('fav') == 1);
    var api = '/api/v1/statuses/'
            + $(status).data('sid').toString()
            + (isFav ? '/unfavourite' : '/favourite' );
    if (typeof term === 'undefined') {
        term = $.terminal.active();
    }
    callAPI(api, {
        instance_name: $(status).data('instance'),
        type: 'POST'
    }).then((data, stat, jqxhr) => {
        var fav = $('[name=id_' + $(status).data('sid').toString() + ']').find('i')[0];
        $(fav).removeClass().addClass('fa fa-' + (data.favourited ? 'star' : 'star-o'));
        $(status).data('fav', data.favourited ? '1' : '0');
        if (isFav === data.favourited) {
            term.error('favourited missed...');
        }
    }, (jqxhr, stat, error) => {
        $.terminal.active().error('Favorite failed.(' + jqxhr.status + ')');
        console.log(jqxhr);
    });
}

function boost(status) {
    var isReb = ($(status).data('reb') == 1);
    var api = '/api/v1/statuses/'
            + $(status).data('sid').toString()
            + (isReb ? '/unreblog' : '/reblog' );
    if (typeof term === 'undefined') {
        term = $.terminal.active();
    }
    callAPI(api, {
        instance_name: $(status).data('instance'),
        type: 'POST'
    }).then((data, stat, jqxhr) => {
        var reb = $('[name=id_' + $(status).data('sid').toString() + ']').find('i')[1];
        $(reb).removeClass().addClass('fa fa-' + (data.reblogged ? 'check-circle-o' : 'retweet'));
        $(status).data('reb', data.reblogged ? '1' : '0');
        if (isReb === data.reblogged) {
            term.error('reblogged missed...');
        }
    }, (jqxhr, stat, error) => {
        $.terminal.active().error('Reblogged failed.(' + jqxhr.status + ')');
        console.log(jqxhr);
    });
}

function tab(arg1, arg2, indent){
    var arg1_escape = escape(arg1).replace(/%u[0-9a-f]{2,6}/ig, 'xx').replace(/%[0-9a-f]{2}/ig, 'x');
    var arg1_length = arg1_escape.length;

    var result = (indent <= arg1_length)
        ? arg1.substr(0, indent - 4) + '... ' : arg1;

    for(var i = arg1_length; i < indent; i++, result += ' ');
    return result + arg2;
}

String.prototype.addTab = function(arg1, indent){
    return tab(arg1, this, indent);
};


function more(term, lines, reverse){
    var rows = term.rows();
    var command = term.get_command();
    var i = 0;
    term.push(function(command,term){},{
        name: 'more',
        //prompt: '[[;#111111;#DDDDDD]-- More --]',
        prompt: '--More-- ',
        onStart: function(moreterm){
            moreterm.echo(lines.slice(i, i + rows).join("\n"));
            i += rows;
            if(i > lines.length){
                moreterm.pop();
                if(reverse) moreterm.set_command(command);
            }
            moreterm.resume();
        },
        keydown: function(event, moreterm){
            switch(event.keyCode){
                case 81:
                    moreterm.pop();
                    if(reverse) moreterm.set_command(command);
                    break;
                case 13:
                    moreterm.echo(lines.slice(i, i + 1).join("\n"));
                    i++;
                    if(i > lines.length){
                        moreterm.pop();
                        if(reverse) moreterm.set_command(command);
                    }
                    break
                default:
                    moreterm.echo(lines.slice(i, i + rows).join("\n"));
                    i += rows;
                    if(i > lines.length){
                        moreterm.pop();
                        if(reverse) moreterm.set_command(command);
                    }
                    moreterm.set_command("");
                    break;
            }
            return false;
        }
    });
}
function begin(term, lines, reverse, search){
    var i = 0;
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
    var result = [];
    for(var i = 0; i < lines.length; i++){
        if(lines[i].match(search)){
            result.push(lines[i]);
        }
    }
    more(term, result, reverse);
}
function exclude(term, lines, reverse, search){
    var result = [];
    for(var i = 0; i < lines.length; i++){
        if(!lines[i].match(search)){
            result.push(lines[i]);
        }
    }
    more(term, result, reverse);
}

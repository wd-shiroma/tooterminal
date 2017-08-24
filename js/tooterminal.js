/*****************************
 * 設定
 *****************************/

var default_config = {
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
        config = default_config;
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
        onResize:     (term) => { console.log(window); term.resize($(window).width() - 36, $(window).height() - 36); },
        exit:         false,
        clear:        false,
        scrollOnEcho: false,
        keypress:     filterKey,
        onCommandChange: parseCommand,
    }).focus();;
    $('#toot_box').on('keydown', (event) => {
        if (event.keyCode === 27) {
            $('#sid').text('');
            $('#reply').hide();
            $('#toot_box').val($('#toot_box').val().replace(/^@[a-zA-Z0-9_]+\s?/, ''));
            $('#toot').slideUp('first');
            $.terminal.active().focus();
        }
        else if(event.keyCode === 13 && event.ctrlKey) {
            post_status();
        }
        else if ($('#toot_box').val().match(/^@[0-9a-zA-Z_]+/) && $('.reply #sid').text() === '') {
            $('#toot_visibility').val('unlisted');
        }
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
    $(document).on('click', '.read_more', function() {
        $(this).next().toggle('fast');
    });
    $(document).on('click', '.status', function(e) {
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
            $('#reply_body').text($(this).find('#post_body')[0].textContent);
        }
        if (e.ctrlKey) {
            favorite(this);
        }
        if (e.altKey) {
            boost(this);
        }
    });
    autosize($('#toot_box'));
});

/*****************************
 * その他処理
 *****************************/


function getConfig(config, index, def_conf) {
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

    cf = (typeof def_conf !== 'undefined' ? def_conf : default_config);
    for (var i = 0; i < idxs.length; i++) {
        cf = cf[idxs[i]];
    }
    return cf;
}

function makeStatus(payload) {
    var date = new Date(payload.created_at);

    var is_reblog = payload.reblog !== null;
    var contents = (is_reblog ? payload.reblog : payload);

    var head = '[ '
        + (typeof contents.account.display_name === 'undefined' ? '' : contents.account.display_name)
        + ' @' + contents.account.acct + ' '
        + $('<i />').addClass('fa fa-' + (contents.favourited ? 'star' : 'star-o')).attr('aria-hidden', 'true').prop('outerHTML') + ' '
        + $('<i />').addClass('fa fa-' + (contents.reblogged ? 'check-circle-o' : 'retweet')).attr('aria-hidden', 'true').prop('outerHTML')
        + ' ' + date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':'
        + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3)
        + ' ]' + (contents.application !== null ? ' from ' + contents.application.name
                : is_reblog ? "<br />reblogged by " + payload.account.display_name + ' @' + payload.account.acct : '');

    var avatar = $('<div />').addClass('status_avatar');
    if (typeof config.instances.status.avatar !== 'undefined') {
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

    var status = $('<div />')
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
        .append($('<span />')
            .html(head))
        .append('<br />');
    var content = contents.content.replace(/^<p>(.+)<\/p>$/, '$1').replace(/<\/p><p>/g, '<br />');
    if (contents.spoiler_text.length > 0) {
        status.append($('<div />')
            .attr('id', 'post_body')
            .append($('<div />')
                .append($('<span />').text(contents.spoiler_text)))
            .append($('<div />')
                .addClass('read_more')
                .append($.terminal.format('[[bu;black;gray]-- More --]')))
            //.append('<br>')
            .append($('<div />')
                .append($('<span />').html(content))
                .addClass('status_contents')
                .hide()));
    }
    else {
        status
            .append($('<div />')
                .attr('id', 'post_body')
                .append($('<span />').html(content))
                .addClass('status_contents'));
    }
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

    return $.ajax({
        url: 'https://' + instances[instance_name].domain + '/api/v1/statuses',
        type: 'POST',
        headers: {
            Authorization: instances[instance_name].token_type + ' ' + instances[instance_name].access_token
        },
        data: data
    }).then((data, status, jqxhr) => {
        $('#toot_box').val('');
        $('#toot_cw').val('');
    }, (jqxhr, status, error) => {
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
        console.log('favorite: failed');
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
        console.log('favorite: failed');
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

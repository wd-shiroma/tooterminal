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

var readConfiguration = (term) => {
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
    //console.log($.terminal.parse_arguments(t.get_command()));
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
        onInit:       readConfiguration,
        prompt:       'Tooterminal# ',
        completion:   completion,
        height:       $(window).height() - 20,
        exit:         false,
        clear:        false,
        keypress:     filterKey,
        onCommandChange: parseCommand,
    }).focus();;
    $('#toot_box').on('keydown', (event) => {
        if (event.keyCode === 27) {
            $('#toot').slideUp('first');
            $.terminal.active().focus();
        }
        else if(event.keyCode === 13 && event.ctrlKey) {
            post_status();
        }
    });
    $('#toot_post').on('click', () => {
        post_status();
    });
    $('#help_close').on('click', () => {
        $('#help').slideUp('first');
        $.terminal.active().focus();
    });
    $(document).on('click', '.read_more', function() {
        $(this).next().toggle('fast');
    });
});

/*****************************
 * その他処理
 *****************************/


function makeStatus(payload) {
    var date = new Date(payload.created_at);
    var head = '[ '
        + (typeof payload.account.display_name === 'undefined' ? '' : payload.account.display_name)
        + ' @'       + payload.account.username
        + ' '        + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' '
        + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()
        + ' ]' + (payload.application !== null ? ' from ' + payload.application.name : '');
    var status = $('<div />')
        .attr('id', 'id_' + payload.id)
        .addClass('status')
        .css('margin', '0em 0.5em')
        .append($('<span />').text(head))
        .append('<br>');
    if (payload.spoiler_text.length > 0) {
        status
            .append($('<div />')
                .append($('<span />').text(payload.spoiler_text)))
            .append($('<div />')
                .addClass('read_more')
                .append($.terminal.format('[[bu;black;gray]-- More --]')))
            //.append('<br>')
            .append($('<div />')
                .append($('<span />').html($(payload.content).html()))
                .addClass('status_contents')
                .hide());
    }
    else {
        status
            .append($('<div />')
                .append($('<span />').html($(payload.content).html()))
                .addClass('status_contents'));
    }
    return status.append('<br>').html();
}

function post_status() {
    var status = $('#toot_box').val().trim();
    var cw = $('#toot_cw').val().trim();
    var visibility = $('#toot_visibility').val();
    var data = {
        status: status,
        visibility: visibility
    };

    if (status.length === 0) {
        return false;
    }
    else if(typeof instances[instance_name] === 'undefined'
         && typeof instances[instance_name].access_token === 'undefined') {
        return false;
    }
    if (cw.length !== 0) {
        data.spoiler_text = cw;
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
    if (typeof path === 'undefined') {
        def = new $.Deffered;
        def.reject('Undefined path');
    }
    else if (typeof instances[instance_name] === 'undefined') {
        def = new $.Deffered;
        def.reject('No instance');
    }
    else if (typeof instances[instance_name].access_token === 'undefined') {
        def = new $.Deffered;
        def.reject('No login');
    }
    else {
        var ins = instances[instance_name];
        def = $.ajax({
            url: 'https://' + ins.domain + path,
            type: typeof opts.type ? opts.type : 'GET',
            headers: {
                Authorization: ins.token_type + ' ' + ins.access_token
            },
            data: typeof opts.data ? opts.data : '',
            dataType: 'json'
        });
    }
    return def;
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

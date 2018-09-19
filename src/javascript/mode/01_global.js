var GlobalModeElement = (function () {
    function GlobalModeElement() {
        this._cmd_mode = "global";
        this._dataset = [
            {
                "type": "command",
                "name": "show",
                "description": "情報を表示します。",
                "children": [
                    {
                        "type": "command",
                        "name": "instances",
                        "description": "全インスタンスの概要を表示します。",
                        "execute": this.show_instance_statistics,
                        "children": [
                            {
                                "type": "command",
                                "name": "statistics",
                                "description": "全インスタンスの概要を表示します。",
                                "execute": this.show_instance_statistics
                            }, {
                                "type": "paramater",
                                "name": "instance_name",
                                "description": "指定インスタンスの詳細を表示します。",
                                "execute": this.show_instance_detail
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "running-config",
                        "description": "設定されたコンフィグを確認します。",
                        "execute": this.show_running_config
                    }, {
                        "type": "command",
                        "name": "startup-config",
                        "description": "保存されたコンフィグを確認します。",
                        "execute": this.show_startup_config
                    }, {
                        "type": "command",
                        "name": "version",
                        "description": "クライアントのバージョンを表示します。",
                        "execute": this.show_version
                    }, {
                        "type": "command",
                        "name": "clock",
                        "description": "現在時刻を表示します。",
                        "execute": this.show_clock
                    }, {
                        "type": "command",
                        "name": "tech-support",
                        "description": "サポート問い合わせ用レポートファイルを出力します。",
                        "execute": this.show_tech,
                        "children": [
                            {
                                "type": "command",
                                "name": "encrypt",
                                "optional": "encrypt",
                                "description": "ファイルを暗号化します。",
                                "execute": this.show_tech
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "instance",
                "description": "インスタンスモードに移行します。",
                "children": [
                    {
                        "type": "paramater",
                        "name": "instance_name",
                        "description": "インスタンスを登録します。",
                        "execute": this.entry_instance
                    }
                ]
            }, {
                "type": "command",
                "name": "delete",
                "description": "インスタンスの削除をします。",
                "children": [
                    {
                        "type": "command",
                        "name": "instance",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "instance_name",
                                "description": "インスタンス名",
                                "execute": this.delete_instance
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "configure",
                "description": "アプリケーションの設定を行います",
                "children": [
                    {
                        "type": "command",
                        "name": "terminal",
                        "description": "アプリケーションの設定を行います",
                        "execute": this.configure_terminal
                    }
                ]
            }, {
                "type": "command",
                "name": "reload",
                "description": "画面を再読み込みします。",
                "execute": this.reload
            }, {
                "type": "command",
                "name": "clear",
                "description": "画面を消去します。",
                "execute": this.clear
            }, {
                "type": "command",
                "name": "write",
                "description": "設定をローカルストレージに保存します。",
                "execute": this.write_memory,
                "children": [
                    {
                        "type": "command",
                        "name": "memory",
                        "description": "設定をローカルストレージに保存します。",
                        "execute": this.write_memory
                    }, {
                        "type": "command",
                        "name": "erase",
                        "description": "ローカルストレージに保存された設定を削除します。",
                        "execute": this.write_erase
                    }
                ]
            }, {
                "type": "command",
                "name": "reset",
                "description": "ターミナルの状態をリセットします。",
                "children": [
                    {
                        "type": "command",
                        "name": "display-size",
                        "description": "ターミナルサイズを自動調整します。",
                        "execute": this.reset_display_size
                    }
                ]
            }, {
                "type": "command",
                "name": "help",
                "description": "ヘルプウインドウを表示します。",
                "execute": this.help,
            }
        ];
    }
    Object.defineProperty(GlobalModeElement.prototype, "dataset", {
        get: function () {
            return this._dataset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalModeElement.prototype, "cmd_mode", {
        get: function () {
            return this._cmd_mode;
        },
        enumerable: true,
        configurable: true
    });
    GlobalModeElement.prototype.show_running_config = function (term, analyzer) {
        let strconfig = JSON.stringify(config.config, null, '    ').replace(/\[/g, '［');
        term.echo(strconfig);
        return true;
    };
    GlobalModeElement.prototype.show_startup_config = function (term, analyzer) {
        let strconfig;
        let store = localStorage;
        let str = store.getItem('configuration');
        if (str) {
            strconfig = JSON.parse(str);
            strconfig = JSON.stringify(strconfig, null, '    ');
        }
        else {
            strconfig = 'startup-config is not present';
        }
        term.echo(strconfig);
        return true;
    };
    GlobalModeElement.prototype.show_version = function (term, analyzer) {
        term.echo([
            'Mastodon Client Tooterminal, Version ' + client_info.version + ', RELEASE SERVICE(Beta)',
            'Technical Support: ' + client_info.website,
            'Copyright (c) ' + client_info.modified.getFullYear() + ' by ' + client_info.auther,
            'Updated ' + client_info.modified.toDateString() + ' by ' + client_info.acct,
            '',
            'Powered by:',
            'jQuery (' + $.fn.jquery + ')',
            'https://jquery.org',
            'jQuery Terminal Emulator Plugin (' + $.terminal.version + ')',
            'http://terminal.jcubic.pl',
            'autosize (4.0.2)',
            'http://www.jacklmoore.com/autosize',
            'twemoji(v11.0.1)',
            'https://twitter.github.io/twemoji/',
            '',
            'License info:',
            'Tooterminal, jQuery, jQuery Terminal Emulator Plugin, autosize is licensed by MIT LICENSE',
            'https://tldrlegal.com/license/mit-license'
        ].join('\n'));

        return true;
    };
    GlobalModeElement.prototype.reset_display_size = function (term, analyzer) {
        term.resize(window.innerWidth - 36, window.innerHeight - 36);
        return true;
    };

    GlobalModeElement.prototype.show_instance_statistics = function (term, analyzer) {
        let lines = [
            '',
            'name      | domain                      | scope | username',
            '--------------------------------------------------------------------',
        ];
        let cnt = 0;
        for (let name in ins.instances) {
            let _ins = ins.get(name);
            lines.push(
                ('| ' + (typeof _ins.user !== 'undefined' ? '@' + _ins.user.username : ''))
                    .addTab('|  ' + (_ins.application.scopes.read   ? 'r' : '-')
                        + (_ins.application.scopes.write  ? 'w' : '-')
                        + (_ins.application.scopes.follow ? 'f' : '-'), 8)
                    .addTab('| ' + _ins.domain, 30).addTab(name, 10)
            );
            cnt++;
        }
        lines.push('--------------------------------------------------------------------');
        lines.push(' 登録件数: ' + cnt + '件');
        lines.push('');
        term.echo(lines.join("\n"));
        return true;
    };
    GlobalModeElement.prototype.show_instance_detail = function (term, analyzer) {
        let name = ins.name(analyzer.paramaters.instance_name);
        let _ins = ins.get();
        if (!_ins) {
            term.error('instance has no regist');
            return false;
        }
        let lines = [
            'Instance',
            tab('Name:',        name,                 15),
            tab('Domain:',      _ins.domain,           15),
            '',
            'Application',
            tab('Client Name:', _ins.application.name, 17),
            tab('Client ID:', _ins.client_id, 17),
            tab('Client Secret:', _ins.client_secret, 17),
            tab('Website:', _ins.application.website, 17),
            tab('Redirect URI:', _ins.application.uris, 17),
            tab('Read:',        _ins.application.scopes.read,      17),
            tab('Write:',       _ins.application.scopes.write,     17),
            tab('Follow:',      _ins.application.scopes.follow,    17),
            '',
            'Autheorized user',
            tab('Access Token:', _ins.access_token, 20),
            tab('Monitor defaults:', _ins.monitor, 20),
            tab('User Account:', '@' + _ins.user.acct, 20),
            tab('User ID:', _ins.user.id, 20),

        ];

        more(term, lines, true);

        return true;
    };
    GlobalModeElement.prototype.entry_instance = function (term, analyzer) {
        function auth_account() {
            let account = callAPI('/api/v1/accounts/verify_credentials');
            let instance = callAPI('/api/v1/instance');
            $.when(account, instance)
            .then((data_acc, data_ins) => {
                let data = data_acc[0];
                let account = parse_account(data);

                term.echo(`<span>Hello! ${account.parsed_display_name} @${account.acct_full}</span>`, {raw: true});
                _ins.user = data;
                _ins.info = data_ins[0];

                ins.save();
                term.resume();

                let prompt = _ins.user.username;
                prompt += '@' + _ins.domain + '# ';

                delete(_ins.auth_code);
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: init_instance,
                    onExit:  exit_instance,
                    exit:    false
                });
                return this;
            }, (jqxhr, error, status) => {
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                term.resume();
                return this;
            });
        }
        ins.name(analyzer.paramaters.instance_name);
        let _ins = ins.get();
        let domain = '';
        if (typeof _ins === 'undefined') {
            ins.create(analyzer.paramaters.instance_name);
            term.push(regist_instance, {
                prompt: 'Input instance domain: ',
                onExit: (term) => {
                    ins.save();
                },
                keydown: (e, term) => {
                    if (e.keyCode === 67 && e.ctrlKey) {
                        term.echo(term.get_prompt() + term.get_command());
                        term.pop();
                        term.set_command('');
                    }
                }
            });
        }
        else if (_ins.hasOwnProperty('auth_code')){
            term.pause();
            $.ajax({
                url: 'https://' + _ins.domain + '/oauth/token',
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: 'authorization_code',
                    client_id: _ins.client_id,
                    client_secret: _ins.client_secret,
                    code: _ins.auth_code,
                    redirect_uri: _ins.application.uris
                }
            }).then((data, status, jqxhr) => {
                _ins.access_token = data.access_token;
                _ins.token_type = data.token_type;
                delete(_ins.auth_code);
                ins.save();
                return auth_account();
            }, (jqxhr, status, error) => {
                term.error('User token updating error.(' + jqxhr.status + ')');
                delete(_ins.auth_code);
                console.log(jqxhr);
            }).then((data_acc, data_ins) => {
            }, (jqxhr, status, error) => {
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function(term) {
                        term_mode = mode_instance;
                        term.exec('login');
                    },
                    onExit:  exit_instance,
                    exit:    false
                });
            });
        }
        else if (_ins.hasOwnProperty('access_token')){
            term.pause();
            auth_account();
        }
        else {
            let prompt = '@' + _ins.domain + '# '
            term.echo('Enter \'login\' and regist your access_token');
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart:  function(term) {
                    term_mode = mode_instance;
                    term.exec('login');
                },
                onExit:  exit_instance,
                exit:    false
            });
        }
        return true;
    };
    GlobalModeElement.prototype.delete_instance = function (term, analyzer) {
        let name = ins.name(analyzer.paramaters.instance_name);
        let _ins = ins.get();
        let prompt = 'Instance "' + name + '" registration will delete! Continue? [confirm]';
        if (typeof _ins === 'undefined') {
            term.error('no instance registration.');
            return false;
        }
        term.push((input) => {
                ins.delete();
                term.echo('[OK]');
                term.echo('Erase of instance: complete');
                term.pop();
            }, {
                prompt: prompt,
                keypress: (event, term) => {
                    term.set_command('');
                    term.echo(prompt + event.key);
                    term.echo('File system erase is not confirmed or Could not be completed');
                    term.pop();
                }
            }
        );
        return true;
    };
    GlobalModeElement.prototype.configure_terminal = function (term, analyzer) {
        term.push(enterCommand, {
            name:   'configuration',
            prompt: 'Tooterminal(config)# ',
            onStart: function() { term_mode = mode_configuration; },
            onExit:  function() { term_mode = mode_global; },
            exit:    true
        });
        return true;
    };
    GlobalModeElement.prototype.write_memory = function (term, analyzer) {
        let store = localStorage;
        term.echo('Building configuration...');
        store.setItem('configuration', JSON.stringify(config.config));
        term.echo('[OK]');
        return true;
    };
    GlobalModeElement.prototype.write_erase = function (term, analyzer) {
        let prompt = 'Erasing the localStorage will remove all configuration files! Continue? [confirm]';
        term.push((input) => {
                let store = localStorage;
                store.removeItem('configuration');
                term.echo('[OK]');
                term.echo('Erase of nvram: complete');
                term.pop();
            }, {
                prompt: prompt,
                keypress: (event, term) => {
                    term.set_command('');
                    term.echo(prompt + event.key);
                    term.echo('File system erase is not confirmed or Could not be completed');
                    term.pop();
                }
            }
        );
    };
    GlobalModeElement.prototype.reload = function (term, analyzer) {
        location.reload();
        return true;
    };
    GlobalModeElement.prototype.clear = function (term, analyzer) {
        term.clear();
        return true;
    };
    GlobalModeElement.prototype.show_clock = function (term, analyzer) {
        term.echo(Date().toString());
        return true;
    };
    GlobalModeElement.prototype.show_tech = function (term, analyzer) {
        let s_config = localStorage.getItem('configuration');
        s_config = s_config ? JSON.parse(s_config) : {};
        let date = new Date();
        let errors = localStorage.getItem('term_error');
        errors = errors ? JSON.parse(errors) : [];
        let info_text = JSON.stringify({
            running_config: config.config,
            startup_config: s_config,
            default_config: config.default,
            instances: ins.instances,
            status: {
                created_at: date.getTime(),
                location: location.href
            },
            errors: errors
        });

        let filename = 'tech-support_'
            + (date.getFullYear())
            + ('0' + (date.getMonth() + 1)).substr(-2)
            + ('0' + date.getDate()).substr(-2)
            + ('0' + date.getHours()).substr(-2)
            + ('0' + date.getMinutes()).substr(-2)
            + ('0' + date.getSeconds()).substr(-2)
            + '.txt';

        let export_str = "";
        if (analyzer.optional.encrypt) {
            let encrypted = [];
            info_text = encodeURIComponent(info_text);
            while (info_text.length) {
                let slice_text = info_text.slice(0, 30);
                let enc_text = slice_text;
                encrypted.push(enc_text.cipher);
                info_text = info_text.slice(30);
            }
            export_str = encrypted.join("\n");
        }
        else {
            export_str = info_text;
        }
        OutputText(export_str, filename);

        return true;
    };
    GlobalModeElement.prototype.help = function (term, analyzer) {
        $('#help').slideDown('first');
        term.disable();
        $(document).on('keydown.help', (event) => {
            if (event.keyCode === 27) {
                $('#help_close').trigger('click');
            }
        });
        return true;
    };
    return GlobalModeElement;
}());

let cnt;
var regist_instance = (input, term) => {
    input = input.trim();
    if (!input.match(/^([A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+$/)) {
        term.error('domain couldn\'t unrecognize');
        ins.delete();
    }
    else if (input.length > 0) {
        term.pause();
        let path = 'https://' + input + '/api/v1/apps';
        let uri = location.origin + location.pathname;
        let matches = uri.match(/^https?:\/\/([^\/:]+)(?::(\d+))?/);
        let is_redirect = (matches && !matches[1].match(/(?:\d+\.){3}\d+$/));
        if (!is_redirect) {
            uri = 'urn:ietf:wg:oauth:2.0:oob';
        }
        let form_data = {
            client_name: config.find('application.name'),
            redirect_uris: uri,
            website: config.find('application.website'),
            scopes:
                  (config.find('application.scopes.read')   ? 'read '  : '')
                + (config.find('application.scopes.write')  ? 'write ' : '')
                + (config.find('application.scopes.follow') ? 'follow' : '')
        };
        $.ajax({
            url: path,
            dataType: 'json',
            type: 'POST',
            data: form_data
        })
        .then((data, status, jqxhr) => {
            let redirect_uri = data.redirect_uri;
            let ins_name = ins.name();
            if (typeof redirect_uri === 'undefined') {
                redirect_uri = form_data.redirect_uris;
            }
            if (is_redirect) {
                redirect_uri += '?instance_name=' + ins_name;
            }
            let _ins           = JSON.parse(JSON.stringify(config.find('instances')));
            _ins.client_id     = data.client_id;
            _ins.client_secret = data.client_secret;
            _ins.domain        = input;
            _ins.application   = config.find('application');
            _ins.application.uris = redirect_uri;

            let prompt = '@' + _ins.domain + '# ';
            term.echo('New instance registed. enter \'login\' and regist your access_token');

            ins.set(_ins);
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart: function(term) {
                    term_mode = mode_instance;
                    prompt = '@' + _ins.domain + '# ';
                    if (_ins.hasOwnProperty('user')) {
                        prompt = _ins.user.username + prompt;
                        term.set_prompt(prompt);
                    }
                    else {
                        term.exec('login');
                    }
                },
                onExit:  function() { term_mode = mode_global; ins.name(''); },
                exit:    false
            });
        }, (jqxhr, status, error) => {
            let msg = 'Failed to connect the instance "' + input + '"';
            ins.delete();
            term.error(msg);
            term_error(msg, {
                path: path,
                opts: data,
                jqxhr: jqxhr
            })
            term.resume();
        });
    }
    term.pop();
    return;
};

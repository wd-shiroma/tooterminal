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
        let strconfig = JSON.stringify(config.config, null, '    ');
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
        let date = new Date('2017-9-16');
        let ver = '0.3.6';
        term.echo('Mastodon Client Tooterminal, Version ' + ver + ', RELEASE SERVICE(Beta)');
        term.echo('Technical Support: https://github.com/wd-shiroma/tooterminal/blob/gh-pages/README.md');
        term.echo('Copyright (c) 2017 by Gusk-ma(Shiroma)');
        term.echo('Updated ' + date.toDateString() + ' by shiroma@mstdn.jp');
        term.echo('<br>', {raw: true});
        term.echo('Powered by:');
        term.echo('jQuery (' + $.fn.jquery + ')');
        term.echo('https://jquery.org');
        term.echo('jQuery Terminal Emulator Plugin (' + $.terminal.version + ')');
        term.echo('http://terminal.jcubic.pl');
        term.echo('autosize (4.0.0)');
        term.echo('http://www.jacklmoore.com/autosize');
        term.echo('cryptico');
        term.echo('http://wwwtyro.github.io/cryptico/');
        term.echo('<br>', {raw: true});
        term.echo('License info:');
        term.echo('Tooterminal, jQuery, jQuery Terminal Emulator Plugin, autosize is licensed by MIT LICENSE');
        term.echo('https://tldrlegal.com/license/mit-license');

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
        for (ins in instances) {
            lines.push(
                ('| ' + (typeof instances[ins].user !== 'undefined' ? '@' + instances[ins].user.username : ''))
                    .addTab('|  ' + (instances[ins].application.scopes.read   ? 'r' : '-')
                        + (instances[ins].application.scopes.write  ? 'w' : '-')
                        + (instances[ins].application.scopes.follow ? 'f' : '-'), 8)
                    .addTab('| ' + instances[ins].domain, 30).addTab(ins, 10)
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
        let name = analyzer.paramaters.instance_name;

        if (typeof instances[name] === 'undefined') {
            term.error('instance has no regist');
            return false;
        }
        let ins = instances[name];

        let lines = [
            'Instance',
            tab('Name:',        name,                 15),
            tab('Domain:',      ins.domain,           15),
            '',
            'Application',
            tab('Client Name:', ins.application.name, 17),
            tab('Client ID:', ins.client_id, 17),
            tab('Client Secret:', ins.client_secret, 17),
            tab('Website:', ins.application.website, 17),
            tab('Redirect URI:', ins.application.uris, 17),
            tab('Read:',        ins.application.scopes.read,      17),
            tab('Write:',       ins.application.scopes.write,     17),
            tab('Follow:',      ins.application.scopes.follow,    17),
            '',
            'Autheorized user',
            tab('Access Token:', ins.access_token, 20),
            tab('Monitor defaults:', ins.monitor, 20),
            tab('User Account:', '@' + ins.user.acct, 20),
            tab('User ID:', ins.user.id, 20),

        ];

        more(term, lines, true);

        return true;
    };
    GlobalModeElement.prototype.entry_instance = function (term, analyzer) {
        instance_name = analyzer.paramaters.instance_name;
        let ins = instances[instance_name];
        let domain = '';
        if (typeof ins === 'undefined') {
            term.push(regist_instance, {
                prompt: 'Input instance domain: ',
            });
        }
        else if (ins.hasOwnProperty('auth_code')){
            term.pause();
            $.ajax({
                url: 'https://' + ins.domain + '/oauth/token',
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: 'authorization_code',
                    client_id: ins.client_id,
                    client_secret: ins.client_secret,
                    code: ins.auth_code,
                    redirect_uri: ins.application.uris
                }
            }).then((data, status, jqxhr) => {
                ins.access_token = data.access_token;
                ins.token_type = data.token_type;
                let store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                delete(ins.auth_code);
                return callAPI('/api/v1/accounts/verify_credentials');
            }, (jqxhr, status, error) => {
                term.error('User token updating error.(' + jqxhr.status + ')');
                delete(ins.auth_code);
                console.log(jqxhr);
            }).then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                ins.user = data2;

                let store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                term.resume();

                let prompt = ins.user.username;
                prompt += '@' + ins.domain + '# ';

                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: init_instance,
                    onExit:  function() { term_mode = mode_global; closeTootbox(); },
                    exit:    false
                });

            }, (jqxhr, status, error) => {
                let prompt = '@' + ins.domain + '# '
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                //term.echo('Enter \'login\' and reflesh your access_token');
                term.resume();
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function(term) {
                        term_mode = mode_instance;
                        term.exec('login');
                    },
                    onExit:  function() { term_mode = mode_global; closeTootbox(); },
                    exit:    false
                });
            });
        }
        else if (ins.hasOwnProperty('access_token')){
            term.pause();
            callAPI('/api/v1/accounts/verify_credentials')
            .then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                ins.user = data2;

                let store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                term.resume();

                let prompt = ins.user.username;
                prompt += '@' + ins.domain + '# ';

                delete(ins.auth_code);
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: init_instance,
                    onExit:  function() { term_mode = mode_global; closeTootbox(); },
                    exit:    false
                });

            }, (jqxhr, status, error) => {
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                term.resume();
            });
        }
        else {
            let prompt = '@' + ins.domain + '# '
            term.echo('Enter \'login\' and regist your access_token');
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart:  function(term) {
                    term_mode = mode_instance;
                    term.exec('login');
                },
                onExit:  function() { term_mode = mode_global; closeTootbox(); },
                exit:    false
            });
        }
        return true;
    };
    GlobalModeElement.prototype.delete_instance = function (term, analyzer) {
        let name = analyzer.paramaters.instance_name;
        let prompt = 'Instance "' + name + '" registration will delete! Continue? [confirm]';
        if (typeof instances[name] === 'undefined') {
            term.error('no instance registration.');
            return false;
        }
        term.push((input) => {
                let store = localStorage;
                delete(instances[name]);
                store.setItem('instances', JSON.stringify(instances));
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
        let pubkey = 'fxDuMgvOBYwvpkQvZ++boTmicqo3IqvJh/WsYw6IH1ClLowIn/7vm5DJiJKcU+OTRQgwp1KZuq1bZqam/OG3n1xEo7n/i4YJ38TtGUbdBdcxzKSx5xNP/CRtHrdMCbnKV8DxFocPM2GnCl7xvGbfFumEtSiCkCgODuGDQhz9xIRKgsI/VGgPlKzgAUT0tJaaSQeCSRtE3B0DZqZkXJChlGy+tpeytIokT9dGVdOLVe/DdgL/JpIjjgeBqul9T56BtFbrawUhv8CSoDPbLT4UxZ7qLKao/X5xd+cLQ031FnKxhhSz2/YUuoL2QM5qxZfVt/bSYAjy6ZtXwHY9UOXtOw==';
        let s_config = localStorage.getItem('configuration');
        s_config = s_config ? JSON.parse(s_config) : {};
        let date = new Date();
        let errors = localStorage.getItem('term_error');
        errors = errors ? JSON.parse(errors) : [];
        let info_text = JSON.stringify({
            running_config: config.config,
            startup_config: s_config,
            default_config: config.default,
            instances: instances,
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
                let enc_text = cryptico.encrypt(slice_text, pubkey);
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
        let data = {
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
            data: data
        })
        .then((data, status, jqxhr) => {
            let redirect_uri = data.redirect_uri;
            if (is_redirect) {
                redirect_uri += '?instance_name=' + instance_name;
            }
            instances[instance_name]               = config.find('instances')
            instances[instance_name].client_id     = data.client_id;
            instances[instance_name].client_secret = data.client_secret;
            instances[instance_name].domain        = input;
            instances[instance_name].application   = config.find('application');
            instances[instance_name].application.uris = redirect_uri;

            let prompt = '@' + instances[instance_name].domain + '# ';
            term.echo('New instance registed. enter \'login\' and regist your access_token');

            let store = localStorage;
            store.setItem('instances', JSON.stringify(instances));
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart: function(term) {
                    term_mode = mode_instance;
                    prompt = '@' + instances[instance_name].domain + '# ';
                    if (instances[instance_name].hasOwnProperty('user')) {
                        prompt = instances[instance_name].user.username + prompt;
                        term.set_prompt(prompt);
                    }
                    else {
                        term.exec('login');
                    }
                },
                onExit:  function() { term_mode = mode_global; },
                exit:    false
            });
        }, (jqxhr, status, error) => {
            let msg = 'Failed to connect the instance "' + input + '"';
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

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
        var strconfig = JSON.stringify(config, null, '    ');
        term.echo(strconfig);
        return true;
    };
    GlobalModeElement.prototype.show_startup_config = function (term, analyzer) {
        var strconfig;
        var store = localStorage;
        var str = store.getItem('configuration');
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
        term.echo('version 0.3.1 (updated at 2017-09-07)');
        return true;
    };
    GlobalModeElement.prototype.reset_display_size = function (term, analyzer) {
        term.resize(window.innerWidth - 36, window.innerHeight - 36);
        return true;
    };

    GlobalModeElement.prototype.show_instance_statistics = function (term, analyzer) {
        var lines = [
            '',
            'name      | domain                      | scope | username',
            '--------------------------------------------------------------------',
        ];
        var cnt = 0;
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
        var name = analyzer.paramaters.instance_name;

        if (typeof instances[name] === 'undefined') {
            term.error('instance has no regist');
            return false;
        }
        var ins = instances[name];

        var lines = [
            'Instance',
            tab('Name:',        name,                 15),
            tab('Domain:',      ins.domain,           15),
            tab('Application:', ins.application.name, 15),
            '',
            'Scopes',
            tab('Read:',        ins.application.scopes.read,      15),
            tab('Write:',       ins.application.scopes.write,     15),
            tab('Follow:',      ins.application.scopes.follow,    15),
            ''
        ];

        more(term, lines, true);

        return true;
    };
    GlobalModeElement.prototype.entry_instance = function (term, analyzer) {
        instance_name = analyzer.paramaters.instance_name;
        var domain = '';
        if (typeof instances[instance_name] === 'undefined') {
            term.push(regist_instance, {
                prompt: 'Input instance domain: ',
            });
        }
        else if (instances[instance_name].hasOwnProperty('auth_code')){
            console.log(instances[instance_name]);
            term.pause();
            $.ajax({
                url: 'https://' + instances[instance_name].domain + '/oauth/token',
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: 'authorization_code',
                    redirect_uri: instances[instance_name].application.redirect_uri,
                    client_id: instances[instance_name].client_id,
                    client_secret: instances[instance_name].client_secret,
                    code: instances[instance_name].auth_code,
                    redirect_uri: instances[instance_name].application.uris
                }
            }).then((data, status, jqxhr) => {
                instances[instance_name].access_token = data.access_token;
                instances[instance_name].token_type = data.token_type;
                var store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                delete(instances[instance_name].auth_code);
                return callAPI('/api/v1/accounts/verify_credentials');
            }, (jqxhr, status, error) => {
                term.error('User token updating error.(' + jqxhr.status + ')');
                delete(instances[instance_name].auth_code);
                console.log(jqxhr);
            }).then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                instances[instance_name].user = data2;

                var store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                term.resume();

                var prompt = instances[instance_name].user.username;
                prompt += '@' + instances[instance_name].domain + '# ';

                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function() { term_mode = mode_instance; },
                    onExit:  function() { term_mode = mode_global; },
                    exit:    false
                });

            }, (jqxhr, status, error) => {
                var prompt = '@' + instances[instance_name].domain + '# '
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                term.echo('Enter \'login\' and reflesh your access_token');
                term.resume();
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function() { term_mode = mode_instance; },
                    onExit:  function() { term_mode = mode_global; },
                    exit:    false
                });
            });
        }
        else if (instances[instance_name].hasOwnProperty('access_token')){
            term.pause();
            callAPI('/api/v1/accounts/verify_credentials')
            .then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                instances[instance_name].user = data2;

                var store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                term.resume();

                var prompt = instances[instance_name].user.username;
                prompt += '@' + instances[instance_name].domain + '# ';

                delete(instances[instance_name].auth_code);
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function() { term_mode = mode_instance; },
                    onExit:  function() { term_mode = mode_global; },
                    exit:    false
                });

            }, (jqxhr, status, error) => {
                var prompt = '@' + instances[instance_name].domain + '# '
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                term.echo('Enter \'login\' and reflesh your access_token');
                term.resume();
                term.push(enterCommand, {
                    name:   'instance',
                    prompt:  prompt,
                    onStart: function() { term_mode = mode_instance; },
                    onExit:  function() { term_mode = mode_global; },
                    exit:    false
                });
            });
        }
        else {
            var prompt = '@' + instances[instance_name].domain + '# '
            term.echo('Enter \'login\' and regist your access_token');
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart: function() { term_mode = mode_instance; },
                onExit:  function() { term_mode = mode_global; },
                exit:    false
            });
        }
        return true;
    };
    GlobalModeElement.prototype.delete_instance = function (term, analyzer) {
        var name = analyzer.paramaters.instance_name;
        var prompt = 'Instance "' + name + '" registration will delete! Continue? [confirm]';
        if (typeof instances[name] === 'undefined') {
            term.error('no instance registration.');
            return false;
        }
        term.push((input) => {
                var store = localStorage;
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
        var store = localStorage;
        term.echo('Building configuration...');
        store.setItem('configuration', JSON.stringify(config));
        term.echo('[OK]');
        return true;
    };
    GlobalModeElement.prototype.write_erase = function (term, analyzer) {
        var prompt = 'Erasing the localStorage will remove all configuration files! Continue? [confirm]';
        term.push((input) => {
                var store = localStorage;
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

var cnt;
var regist_instance = (input, term) => {
    input = input.trim();
    if (!input.match(/^([A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+$/)) {
        term.error('domain couldn\'t unrecognize');
    }
    else if (input.length > 0) {
        term.pause();
        var uri = location.origin + location.pathname;
        console.log(uri);
        $.ajax({
            url: 'https://' + input + '/api/v1/apps',
            dataType: 'json',
            type: 'POST',
            data:{
                client_name: config.application.name,
                redirect_uris: uri,
                website: config.application.website,
                scopes:
                      (config.application.scopes.read   ? 'read '  : '')
                    + (config.application.scopes.write  ? 'write ' : '')
                    + (config.application.scopes.follow ? 'follow' : '')
            }
        })
        .then((data, status, jqxhr) => {
            var redirect_uri = data.redirect_uri + '?instance_name=' + instance_name;
            instances[instance_name]               = config.instances
            instances[instance_name].client_id     = data.client_id;
            instances[instance_name].client_secret = data.client_secret;
            instances[instance_name].domain        = input;
            instances[instance_name].application   = config.application;
            instances[instance_name].application.uris = redirect_uri;

            var prompt = '@' + instances[instance_name].domain + '# ';
            term.echo('New instance registed. enter \'login\' and regist your access_token');

            var store = localStorage;
            store.setItem('instances', JSON.stringify(instances));
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart: function(term) {
                    term_mode = mode_instance;
                    term.exec('login');
                },
                onExit:  function() { term_mode = mode_global; },
                exit:    false
            });
        }, (jqxhr, status, error) => {
            term.error('Failed to connect the instance "' + input + '"');
            term.resume();
            console.log(jqxhr);
        });
    }
    term.pop();
    return;
};

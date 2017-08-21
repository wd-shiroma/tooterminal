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
                        "name": "running-configuration",
                        "description": "設定されたコンフィグを確認します。",
                        "execute": this.show_running_config
                    }, {
                        "type": "command",
                        "name": "startup-configuration",
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
            //strconfig = default_config;
            strconfig = 'startup-config is not present';
        }
        term.echo(strconfig);
        return true;
    };
    GlobalModeElement.prototype.show_version = function (term, analyzer) {
        term.echo('version 0.1 (updated at 2017-08-10)');
        return true;
    };

    /*
    instances['jp'] = {domain:'mstdn.jp', scopes:{read:true,write:true,follow:false}, application: {name: 'tootle'}}
    instances['nico'] = {domain:'friends.nico', scopes:{read:true,write:false,follow:true}, application: {name: 'friends.nico for iOS'}}
    instances['pawoo'] = {domain:'pawoo.net', scopes:{read:false,write:false,follow:true}, application: {name: 'Pawoo for iOS'}}
    */
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
        else{
            var prompt = '';
            if (typeof instances[instance_name].user !== 'undefined') {
                prompt = '' + instances[instance_name].user.username + '';
            }
            prompt += '@' + instances[instance_name].domain + '# '

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
var instance_name;
var regist_instance = (input, term) => {
    input = input.trim();
    if (!input.match(/^([A-Za-z0-9][A-Za-z0-9\-]{1,61}[A-Za-z0-9]\.)+[A-Za-z]+$/)) {
        term.error('domain couldn\'t unrecognize');
    }
    else if (input.length > 0) {
        term.pause();
        $.ajax({
            url: 'https://' + input + '/api/v1/apps',
            dataType: 'json',
            type: 'POST',
            data:{
                client_name: config.application.name,
                redirect_uris: config.application.uris,
                website: 'https://wd-shiroma.github.io/tooterminal',
                scopes:
                      (config.application.scopes.read   ? 'read '  : '')
                    + (config.application.scopes.write  ? 'write ' : '')
                    + (config.application.scopes.follow ? 'follow' : '')
            }
        })
        .then((data, status, jqxhr) => {
            instances[instance_name] = {
                client_id: data.client_id,
                client_secret: data.client_secret,
                domain: input,
                application: config.application,
            };

            var prompt = '@' + instances[instance_name].domain + '# ';
            term.echo('New instance registed. enter \'login\' and regist your access_token');

            var store = localStorage;
            store.setItem('instances', JSON.stringify(instances));
            term.resume();
            term.push(enterCommand, {
                name:   'instance',
                prompt:  prompt,
                onStart: function() { term_mode = mode_instance; },
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


var ConfigurationModeElement = (function () {
    function ConfigurationModeElement() {
        this._cmd_mode = "configuration";
        this._dataset = [
            {
                "type": "command",
                "name": "application",
                "description": "アプリケーション登録に関する設定を行います。",
                "children": [
                    {
                        "type": "command",
                        "name": "name",
                        "description": "アプリケーション名を設定します。",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "app_name",
                                "description": "アプリケーション名",
                                "execute": this.set_paramater
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "scopes",
                        "description": "アクセス権限を設定します。",
                        "children": [
                            {
                                "type": "command",
                                "name": "read",
                                "description": "読み取り",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "write",
                                "description": "書き込み",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "follow",
                                "description": "フォロー",
                                "execute": this.set_default
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "terminal",
                "description": "ターミナル表示に関する設定を行います。",
                "children": [
                    {
                        "type": "command",
                        "name": "length",
                        "description": "ターミナル表示行数を設定します。",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "number(0-)",
                                "description": "表示行数(0で無限)",
                                "execute": this.set_number
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "instances",
                "description": "インスタンス登録の際の雛形設定を行います。",
                "children": [
                    {
                        "type": "command",
                        "name": "terminal",
                        "description": "ストリーミングに関する設定をします。",
                        "children": [
                            {
                                "type": "command",
                                "name": "monitor",
                                "description": "ストリーミングを有効にします。",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "home",
                                "description": "ホームタイムラインのストリーミングを有効にします。",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "local",
                                "description": "ローカルタイムラインのストリーミングを有効にします。",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "federate",
                                "description": "連合タイムラインのストリーミングを有効にします。",
                                "execute": this.set_true
                            }, {
                                "type": "command",
                                "name": "notification",
                                "description": "通知タイムラインのストリーミングを有効にします。",
                                "execute": this.set_default
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "broadcast-to",
                        "description": "投稿範囲を設定します。",
                        "children": [
                            {
                                "type": "command",
                                "name": "private",
                                "description": "非公開",
                                "execute": this.set_broadcast
                            }, {
                                "type": "command",
                                "name": "unlisted",
                                "description": "非収容",
                                "execute": this.set_broadcast
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": "公開",
                                "execute": this.set_broadcast
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "statuses",
                        "description": "トゥート取得数を設定します。",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "number(1-40)",
                                "description": "トゥート取得数",
                                "execute": this.set_number
                            }
                        ]
                    }/*, {
                        "type": "command",
                        "name": "display",
                        "description": "表示に関する設定をします。",
                        "children": [
                            {
                                "type": "command",
                                "name": "icon",
                                "description": "アイコンを表示します。",
                                "execute": this.set_config
                            }, {
                                "type": "command",
                                "name": "cw",
                                "description": "閲覧注意文章の表示を標準にします。",
                                "execute": this.set_config
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": "閲覧注意画像の表示を標準にします。",
                                "execute": this.set_config
                            }
                        ]
                    }*/
                ]
            }, {
                "type": "command",
                "name": "no",
                "description": "設定の削除を行います。",
                "children": [
                    {
                        "type": "command",
                        "name": "terminal",
                        "description": "ターミナル表示に関する設定を行います。",
                        "children": [
                            {
                                "type": "command",
                                "name": "length",
                                "description": "ターミナル表示行数を設定します。",
                                "execute": this.set_default
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "instances",
                        "description": "インスタンス登録の際の雛形設定を削除します。",
                        "children": [
                            {
                                "type": "command",
                                "name": "terminal",
                                "description": "ストリーミングに関する設定を削除します。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "monitor",
                                        "description": "ストリーミングを無効にします。",
                                        "execute": this.set_false
                                    }, {
                                        "type": "command",
                                        "name": "home",
                                        "description": "ホームタイムラインのストリーミングを無効にします。",
                                        "execute": this.set_false
                                    }, {
                                        "type": "command",
                                        "name": "local",
                                        "description": "ローカルタイムラインのストリーミングを無効にします。",
                                        "execute": this.set_false
                                    }, {
                                        "type": "command",
                                        "name": "federate",
                                        "description": "連合タイムラインのストリーミングを無効にします。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "notification",
                                        "description": "通知タイムラインのストリーミングを無効にします。",
                                        "execute": this.set_false
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "broadcast-to",
                                "description": "投稿範囲を削除します。",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "statuses",
                                "description": "トゥート取得数を削除します。",
                                "execute": this.set_default
                            }/*, {
                                "type": "command",
                                "name": "display",
                                "description": "表示に関する設定をします。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "icon",
                                        "description": "アイコンを表示します。",
                                        "execute": this.instance_display_icon
                                    }, {
                                        "type": "command",
                                        "name": "cw",
                                        "description": "閲覧注意文章の表示を標準にします。",
                                        "execute": this.instance_display_cw
                                    }, {
                                        "type": "command",
                                        "name": "public",
                                        "description": "閲覧注意画像の表示を標準にします。",
                                        "execute": this.instance_display_nsfw
                                    }
                                ]
                            }*/
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "exit",
                "description": "コンフィギュレーションモードを終了します。",
                "execute": this.exit_configuration
            }, {
                "type": "command",
                "name": "end",
                "description": "コンフィギュレーションモードを終了します。",
                "execute": this.exit_configuration
            }
        ];
    }
    Object.defineProperty(ConfigurationModeElement.prototype, "dataset", {
        get: function () {
            return this._dataset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationModeElement.prototype, "cmd_mode", {
        get: function () {
            return this._cmd_mode;
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationModeElement.prototype.set_paramater = function (term, analyzer) {
        config.application.name = analyzer.paramaters.app_name;
        return true;
    };
    ConfigurationModeElement.prototype.set_default = function (term, analyzer) {
        var target = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        var cmd = 'delete(config';
        for (var i = 0; i < analyzer.line_parsed.length; i++) {
            cmd += '.' + analyzer.line_parsed[i].name;
            target = target[analyzer.line_parsed[i].name];
        }
        cmd += ')';
        eval(cmd);

        return true;
    };
    ConfigurationModeElement.prototype.set_number = function (term, analyzer) {
        term.echo('executed!');
        return true;
    };
    ConfigurationModeElement.prototype.set_true = function (term, analyzer) {
        var target = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        var cmd = 'config';
        for (var i = 0; i < analyzer.line_parsed.length; i++) {
            cmd += '.' + analyzer.line_parsed[i].name;
            if (eval('typeof ' + cmd) === 'undefined') {
                eval(cmd + ' = {}');
            }
            target = target[analyzer.line_parsed[i].name];
        }
        cmd += ' = true';
        eval(cmd);
        return true;
    };
    ConfigurationModeElement.prototype.set_false = function (term, analyzer) {
        var target = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        var cmd = 'config';
        for (var i = 0; i < analyzer.line_parsed.length; i++) {
            cmd += '.' + analyzer.line_parsed[i].name;
            if (eval('typeof ' + cmd) === 'undefined') {
                eval(cmd + ' = {}');
            }
            target = target[analyzer.line_parsed[i].name];
        }
        cmd += ' = false';
        eval(cmd);
        return true;
    };
    ConfigurationModeElement.prototype.set_broadcast = function (term, analyzer) {
        term.echo('executed!');
        return true;
    };
    ConfigurationModeElement.prototype.exit_configuration = function (term, analyzer) {
        term.pop();
        return true;
    };
    return ConfigurationModeElement;
}());

var ws;
var InstanceModeElement = (function () {
    function InstanceModeElement() {
        this._cmd_mode = "global";
        this._dataset = [
            {
                "type": "command",
                "name": "toot",
                "description": "書き込みを投稿します。",
                "execute": this.toot,
                "children": [
                    {
                        "type": "command",
                        "name": "public",
                        "description": '公開範囲を "公開" に設定します。',
                        "execute": this.toot,
                    }, {
                        "type": "command",
                        "name": "unlisted",
                        "description": '公開範囲を "未収容" に設定します。',
                        "execute": this.toot,
                    }, {
                        "type": "command",
                        "name": "private",
                        "description": '公開範囲を "非公開" に設定します。',
                        "execute": this.toot,
                    }
                ]
            }, {
                "type": "command",
                "name": "show",
                "description": "情報を表示します。",
                "children": [
                    {
                        "type": "command",
                        "name": "user",
                        "description": 'ユーザー情報を表示します。',
                        "execute": this.show_user,
                        "children": [
                            {
                                "type": "paramater",
                                "name": "userid",
                                "description": 'ユーザーID',
                                "execute": this.show_user,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "statuses",
                                        "description": 'ユーザーの投稿を表示します。',
                                        "execute": this.show_statuses,
                                    }, {
                                        "type": "command",
                                        "name": "following",
                                        "description": 'フォローアカウントを表示します。',
                                        "execute": this.show_follows,
                                    }, {
                                        "type": "command",
                                        "name": "followers",
                                        "description": 'フォロワーアカウントを表示します。',
                                        "execute": this.show_follows,
                                    }
                                ]
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "instance",
                        "description": 'インスタンス情報を表示します。',
                        "execute": this.show_instance,
                    }, {
                        "type": "command",
                        "name": "authentication",
                        "description": 'インスタンス情報を表示します。',
                        "execute": this.show_authentication,
                    }, {
                        "type": "command",
                        "name": "timeline",
                        "description": 'タイムラインの最新トゥートを表示します。',
                        "execute": this.show_statuses,
                        "children": [
                            {
                                "type": "command",
                                "name": "home",
                                "description": 'ホームタイムライン',
                                "execute": this.show_statuses,
                            }, {
                                "type": "command",
                                "name": "local",
                                "description": 'ローカルタイムライン',
                                "execute": this.show_statuses,
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": '連合タイムライン',
                                "execute": this.show_statuses,
                            }, {
                                "type": "command",
                                "name": "tag",
                                "description": 'ハッシュタグ',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "tag_name",
                                        "description": 'タグ名',
                                        "execute": this.show_statuses,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "search",
                "description": "ユーザー検索を行います",
                "children": [
                    {
                        "type": "paramater",
                        "name": "query",
                        "description": '検索キーワード',
                        "execute": this.search_query,
                    }
                ]
            }, {
                "type": "command",
                "name": "login",
                "description": 'クライアントにログインします。',
                "execute": this.login,
            }, {
                "type": "command",
                "name": "terminal",
                "description": 'ストリーミングの設定を行います。',
                "execute": this.terminal_monitor,
                "children": [
                    {
                        "type": "command",
                        "name": "monitor",
                        "description": 'ストリーミングを有効にします。',
                        "execute": this.terminal_monitor,
                    }, {
                        "type": "command",
                        "name": "no",
                        "description": 'ストリーミングを無効にします。',
                        "execute": this.terminal_monitor,
                        "children": [
                            {
                                "type": "command",
                                "name": "monitor",
                                "description": 'ストリーミングを無効にします。',
                                "execute": this.terminal_monitor,
                                "children": [
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "exit",
                "description": 'インスタンスモードを終了します。',
                "execute": this.exit,
            }
        ];
    }
    Object.defineProperty(InstanceModeElement.prototype, "dataset", {
        get: function () {
            return this._dataset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstanceModeElement.prototype, "cmd_mode", {
        get: function () {
            return this._cmd_mode;
        },
        enumerable: true,
        configurable: true
    });
    InstanceModeElement.prototype.login = function (term, analyzer) {
        var url =
            'https://'         + instances[instance_name].domain
            + '/oauth/authorize?response_type=code'
            + '&client_id='    + instances[instance_name].client_id
            + '&redirect_uri=' + instances[instance_name].application.uris
            + '&scope='        + (instances[instance_name].application.scopes.read   ? 'read '  : '')
                               + (instances[instance_name].application.scopes.write  ? 'write ' : '')
                               + (instances[instance_name].application.scopes.follow ? 'follow' : '');
        window.open(url, '_blank');
        term.push((input, term) => {
            if (input.trim().length == 0) {
                term.pop()
            }
            term.pause();
            term.prompt = '';
            $.ajax({
                url: 'https://' + instances[instance_name].domain + '/oauth/token',
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: 'authorization_code',
                    redirect_uri: instances[instance_name].application.uris,
                    client_id: instances[instance_name].client_id,
                    client_secret: instances[instance_name].client_secret,
                    code: input.trim()
                }
            }).then((data, status, jqxhr) => {
                instances[instance_name].access_token = data.access_token;
                instances[instance_name].token_type = data.token_type;
                var store = localStorage;
                store.setItem('instances', JSON.stringify(instances));

                console.log(data);

                return callAPI('/api/v1/accounts/verify_credentials');
            }).then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                instances[instance_name].user = data2;

                console.log(data2);
                console.log(jqxhr);

                var store = localStorage;
                store.setItem('instances', JSON.stringify(instances));
                term.resume();
                term.pop();

                var prompt = instances[instance_name].user.username;
                prompt += '@' + instances[instance_name].domain + '# ';
                $.terminal.active().set_prompt(prompt);
            }, (jqxhr, status, error) => {
                term.error('Ajax Error.');
                term.resume();
                term.pop();
            });
        }, {
            prompt: 'Input Authentication Code: ',
        });
        return true;
    };
    InstanceModeElement.prototype.terminal_monitor = function (term, analyzer) {
        if (
            (typeof analyzer.line_parsed[1] === 'undefined' || analyzer.line_parsed[1].name === 'monitor')
            && (typeof ws === 'undefined' || ws.readyStatus >= WebSocket.CLOSING)
        ) {
            ws = new WebSocket(
                'wss://' + instances[instance_name].domain + '/api/v1/streaming/public'
                + '?access_token=' + instances[instance_name].access_token
                + '&stream=public:local'
            );

            ws.onmessage = (e) => {
                var data = JSON.parse(e.data);

                if (data.event === 'delete') {
                    return;
                }

                var payload = JSON.parse(data.payload);
                var status = makeStatus(payload);
                term.echo(status, { raw: true });
                //console.log(payload);
            };

            ws.onopen = () => {
                term.echo("Streaming start.");
            };

            ws.onerror = (e) => {
                console.warn(e);
            };

            ws.onclose = () => {
                term.echo("Streaming closed.");
            };
        }
        else if(analyzer.line_parsed[1].name === 'no'){
            ws.close();
            ws = undefined;
        }
    };
    InstanceModeElement.prototype.toot = function (term, analyzer) {
        if (typeof analyzer.line_parsed[1] !== 'undefined') {
            $('#toot_visibility').val(analyzer.line_parsed[1].name);
        }
        $('#toot').slideDown('first');
        $('#toot_box').focus();
        term.focus(false);
    };
    InstanceModeElement.prototype.show_user = function (term, analyzer) {
        term.pause();
        var api;
        if (typeof analyzer.line_parsed[2] === 'undefined') {
            api = callAPI('/api/v1/accounts/verify_credentials', {
                type: 'GET',
            });
        }
        else {
            api = callAPI('/api/v1/accounts/' + analyzer.paramaters['userid'], {
                type: 'GET',
            });
        }

        api.then((data, status, jqxhr) => {
            var created = new Date(data.created_at);
            var passing = parseInt((Date.now() - created.getTime()) / 60000);
            var minutes = passing % 60;
            var hours   = (passing = (passing - minutes) / 60) % 24;
            var days    = (passing = (passing - hours) / 24) % 7;
            var weeks   = (passing - days) / 7;
            term.echo(data.display_name + ' ID:' + data.id
                + (data.locked ? ' is locked' : ' is unlocked'), {flush: false});
            term.echo('Username is ' + data.username + ', Fullname is ' + data.acct, {flush: false});
            term.echo('Created at ' + created.toString(), {flush: false});
            term.echo('Uptime is '
                    + weeks + ' weeks, ' + days + ' days, ' + hours + ' hours, '
                    + minutes + ' minutes (' + passing + ' days have passed)', {flush: false});
            term.echo(data.statuses_count  + ' statuses posted, '
                    + data.following_count + ' accounts are following, '
                    + data.followers_count + ' accounts are followed', {flush: false});
            term.echo('1 day toot rate ' + parseInt(data.statuses_count / passing) + ' posts/day', {flush: false});
            term.echo($.terminal.format('Note:' + data.note), {raw: true, flush: false});
            term.echo('URL: ' + data.url, {raw: false, flush: false});
            term.echo('[OK]', {flush: false});
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            var response = JSON.parse(jqxhr.responseText);
            term.echo(response.error);
            term.resume();
        });

    };
    InstanceModeElement.prototype.search_query = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/search', {
            type: 'GET',
            data: {
                q: analyzer.paramaters['query']
            }
        }).then((data, status, jqxhr) => {
            var lines = [
                'User Accounts:',
                'id       | account name                | display name',
                '----------------------------------------------------------'
            ];
            for (var i = 0; i < data.accounts.length; i++) {
                lines.push(
                    ('| ' + data.accounts[i].display_name)
                        .addTab('| ' + data.accounts[i].acct, 30)
                        .addTab(data.accounts[i].id, 9)
                );
            }
            lines.push('----------------------------------------------------------');
            lines.push('  該当件数：' + data.accounts.length + '件');
            lines.push('');
            lines.push('Hash tags:');
            lines.push('-----------------------------------');
            for (var i = 0; i < data.hashtags.length; i++) {
                lines.push('#' + data.hashtags[i]);
            }
            lines.push('-----------------------------------');
            lines.push('  該当件数：' + data.hashtags.length + '件');
            term.echo(lines.join("\n"));
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_instance = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            //var json_str = JSON.stringify(data, null, '    ');
            //term.echo(json_str);
            term.echo('Instance name: ' + data.title, {flush: false});
            term.echo('Version: ' + data.version, {flush: false});
            term.echo('Description: ' + data.description, {flush: false});
            term.echo('E-mail: ' + data.email, {flush: false});
            term.echo('URI: ' + data.uri, {flush: false});
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_authentication = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            var json_str = JSON.stringify(data, null, '    ');
            term.echo(json_str);
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.exit = function (term, analyzer) {
        term.pop();
    };
    InstanceModeElement.prototype.show_statuses = function (term, analyzer) {
        term.pause();
        var api;
        if (analyzer.line_parsed[1].name === 'timeline') {
            var type = typeof analyzer.line_parsed[2] === 'undefined' ? 'local' : analyzer.line_parsed[2].name;
            var path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
            if (typeof analyzer.line_parsed[3] !== 'undefined') {
                path += '/' + analyzer.paramaters.tag_name;
            }
            api = callAPI(path, {
                type: 'GET',
                data: (type === 'local' ? {local: true} : undefined)
            });
        }
        else if (analyzer.line_parsed[1].name === 'statuses') {
            api = callAPI('/api/v1/statuses', {
                type: 'GET',
            });
        }
        else {
            api = callAPI('/api/v1/accounts/' + analyzer.paramaters.userid + '/statuses', {
                type: 'GET',
            });
        }
        api.then((data, status, jqxhr) => {
            //var json_str = JSON.stringify(data, null, '    ');
            //term.echo(json_str);
            for (var i = data.length-1; i >= 0; i--) {
                var s = makeStatus(data[i]);
                term.echo(s, { raw: true, flush: false });
            }
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_follows = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/accounts/' + analyzer.paramaters.userid + '/' + analyzer.line_parsed[3].name, {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            var lines = [
                'Accounts:',
                'id       | account name                | display name',
                '----------------------------------------------------------'
            ];
            for (var i = 0; i < data.length; i++) {
                lines.push(
                    ('| ' + data[i].display_name)
                        .addTab('| ' + data[i].acct, 30)
                        .addTab(data[i].id, 9)
                );
            }
            lines.push('----------------------------------------------------------');
            lines.push('  該当件数：' + data.length + '件');
            lines.push('');
            term.echo(lines.join("\n"));
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_followers = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/accounts/' + analyzer.paramaters.userid + '/followers', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            var json_str = JSON.stringify(data, null, '    ');
            term.echo(json_str);
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    /* template */
    InstanceModeElement.prototype.template = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            var json_str = JSON.stringify(data, null, '    ');
            term.echo(json_str);
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            term.resume();
        });
    };
    return InstanceModeElement;
}());
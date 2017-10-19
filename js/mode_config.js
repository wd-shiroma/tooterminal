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
                                "name": "string",
                                "description": "アプリケーション名",
                                "execute": this.set_paramater
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "website",
                        "description": "アプリケーションWebページを設定します。",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "string",
                                "description": "URL",
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
                        "description": "トゥート表示件数を設定します。",
                        "children": [
                            {
                                "type": "number",
                                "name": "posts",
                                "min": 1,
                                "max": 40,
                                "description": "表示件数(デフォルト20)",
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
                                "description": "取得するタイムラインの設定をします。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "home",
                                        "description": "ホームタイムラインのストリーミングを有効にします。",
                                        "execute": this.set_array
                                    }, {
                                        "type": "command",
                                        "name": "local",
                                        "description": "ローカルタイムラインのストリーミングを有効にします。",
                                        "execute": this.set_array
                                    }, {
                                        "type": "command",
                                        "name": "public",
                                        "description": "連合タイムラインのストリーミングを有効にします。",
                                        "execute": this.set_array
                                    }, {
                                        "type": "command",
                                        "name": "notification",
                                        "description": "連合タイムラインのストリーミングを有効にします。",
                                        "execute": this.set_array
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "logging",
                                "description": "ストリーミングに表示する通知の設定をします。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "delete",
                                        "description": "削除されたトゥートIDの通知を表示します。",
                                        "execute": this.set_true
                                    }, {
                                        "type": "command",
                                        "name": "favourite",
                                        "description": "お気に入り登録の通知を表示します。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "reblog",
                                        "description": "ブーストの通知を表示します。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "mention",
                                        "description": "リプライの通知を表示します。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "following",
                                        "description": "フォロー通知を表示します。",
                                        "execute": this.set_default
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "notification",
                                "optional": "desktop_notification",
                                "description": "デスクトップ通知の設定をします。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "favourite",
                                        "description": "お気に入り登録の通知を表示します。",
                                        "execute": this.set_true
                                    }, {
                                        "type": "command",
                                        "name": "reblog",
                                        "description": "ブーストの通知を表示します。",
                                        "execute": this.set_true
                                    }, {
                                        "type": "command",
                                        "name": "mention",
                                        "description": "リプライの通知を表示します。",
                                        "execute": this.set_true
                                    }, {
                                        "type": "command",
                                        "name": "following",
                                        "description": "フォローの通知を表示します。",
                                        "execute": this.set_true
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "boop",
                                "description": "通知音を設定します。",
                                "execute": this.set_true
                            }, {
                                "type": "command",
                                "name": "length",
                                "description": "トゥートの取得数について設定します。",
                                "children": [
                                    {
                                        "type": "number",
                                        "name": "number",
                                        "max": 100,
                                        "min": 0,
                                        "description": "取得数(初期値20)",
                                        "execute": this.set_number
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "auto",
                                "description": "ログイン後、terminal monitorを自動発行します。",
                                "execute": this.set_true
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "status",
                        "description": "トゥート表示に関する設定をします。",
                        "children": [
                            {
                                "type": "command",
                                "name": "avatar",
                                "description": "アイコンを表示します。",
                                "execute": this.set_true,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "standard",
                                        "description": "常にアイコンを表示し、マウスオーバーで動画GIFを再生します。",
                                        "execute": this.set_command
                                    }, {
                                        "type": "command",
                                        "name": "animation",
                                        "description": "常に動画GIFを再生します。",
                                        "execute": this.set_command
                                    }, {
                                        "type": "command",
                                        "name": "mouseover",
                                        "description": "アイコンは非表示、マウスオーバーで表示と動画GIFを再生します。",
                                        "execute": this.set_command
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "thumbnail",
                                "description": "サムネイル画像を表示します。",
                                "execute": this.set_true
                            }, {
                                "type": "command",
                                "name": "separator",
                                "description": "ステータス表示に区切り線を表示します。",
                                "execute": this.set_true
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "visibility",
                        "description": "投稿範囲を設定します。",
                        "children": [
                            {
                                "type": "command",
                                "name": "public",
                                "description": "公開",
                                "execute": this.set_command
                            }, {
                                "type": "command",
                                "name": "unlisted",
                                "description": "未収載",
                                "execute": this.set_command
                            }, {
                                "type": "command",
                                "name": "private",
                                "description": "非公開",
                                "execute": this.set_command
                            }, {
                                "type": "command",
                                "name": "direct",
                                "description": "ダイレクト",
                                "execute": this.set_command
                            }
                        ]
                    }/*, { そのうち対応するよ
                        "type": "command",
                        "name": "mode",
                        "description": "インスタンスコンフィギュレーションモードに入ります。",
                        "children": [
                            {
                                "type": "paramater",
                                "name": "instance_name",
                                "description": "インスタンス名",
                                "execute": this.entry_instance
                            }
                        ]
                    }*/
                ]
            }, {
                "type": "command",
                "name": "no",
                "optional": "is_no",
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
                                        "description": "取得するタイムラインの設定を削除します。",
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "home",
                                                "description": "ホームタイムラインのストリーミングを無効にします。",
                                                "execute": this.set_array
                                            }, {
                                                "type": "command",
                                                "name": "local",
                                                "description": "ローカルタイムラインのストリーミングを無効にします。",
                                                "execute": this.set_array
                                            }, {
                                                "type": "command",
                                                "name": "public",
                                                "description": "連合タイムラインのストリーミングを無効にします。",
                                                "execute": this.set_array
                                            }, {
                                                "type": "command",
                                                "name": "notification",
                                                "description": "連合タイムラインのストリーミングを無効にします。",
                                                "execute": this.set_array
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "logging",
                                        "description": "ストリーミングに表示する通知の設定をします。",
                                        "execute": this.set_false,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "delete",
                                                "description": "削除されたトゥートIDの通知を非表示にします。",
                                                "execute": this.set_default
                                            }, {
                                                "type": "command",
                                                "name": "favourite",
                                                "description": "お気に入り登録の通知を非表示にします。",
                                                "execute": this.set_false
                                            }, {
                                                "type": "command",
                                                "name": "reblog",
                                                "description": "ブーストの通知を非表示にします。",
                                                "execute": this.set_false
                                            }, {
                                                "type": "command",
                                                "name": "mention",
                                                "description": "リプライの通知を非表示にします。",
                                                "execute": this.set_false
                                            }, {
                                                "type": "command",
                                                "name": "following",
                                                "description": "フォロー通知を非表示にします。",
                                                "execute": this.set_false
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "notification",
                                        "optional": "desktop_notification",
                                        "description": "デスクトップ通知の設定をします。",
                                        "execute": this.set_false,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "favourite",
                                                "description": "お気に入り登録の通知を非表示にします。",
                                                "execute": this.set_default
                                            }, {
                                                "type": "command",
                                                "name": "reblog",
                                                "description": "ブーストの通知を非表示にします。",
                                                "execute": this.set_default
                                            }, {
                                                "type": "command",
                                                "name": "mention",
                                                "description": "リプライの通知を非表示にします。",
                                                "execute": this.set_default
                                            }, {
                                                "type": "command",
                                                "name": "following",
                                                "description": "フォロー通知を非表示にします。",
                                                "execute": this.set_default
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "boop",
                                        "description": "通知音を無効にします。",
                                        "execute": this.set_default
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "broadcast-to",
                                "description": "投稿範囲を削除します。",
                                "execute": this.set_default
                            }, {
                                "type": "command",
                                "name": "status",
                                "description": "トゥート表示に関する設定を削除します。",
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "avatar",
                                        "description": "アイコンを非表示にします。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "thumbnail",
                                        "description": "サムネイル画像を非表示にします。",
                                        "execute": this.set_default
                                    }, {
                                        "type": "command",
                                        "name": "separator",
                                        "description": "ステータス表示に区切り線を非表示にします。",
                                        "execute": this.set_default
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "exit",
                "description": "コンフィギュレーションモードに戻ります。",
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
        let index = analyzer.line_parsed.length - 1;

        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length - 1; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }

        return config.write(nodes, analyzer.paramaters.string);
    };
    ConfigurationModeElement.prototype.set_default = function (term, analyzer) {
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length - 1; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }

        return config.erase(nodes);
    };
    ConfigurationModeElement.prototype.set_number = function (term, analyzer) {
        let limit = parseInt(analyzer.paramaters.number);
        return config.write(['instances', 'terminal', 'length'], limit);
    };
    ConfigurationModeElement.prototype.set_true = function (term, analyzer) {
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }

        if (analyzer.optional.desktop_notification === true) {
            Notification.requestPermission(function(result) {
              if (result === 'granted') {
                config.write(nodes, true);
              }
              else {
                console.log('Desktop-Notification is rejected: ' + result);
              }
            });
        }
        else {
            config.write(nodes, true);
        }
        return true;
    };
    ConfigurationModeElement.prototype.set_false = function (term, analyzer) {
        //var t_conf = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }
        return config.write(nodes, false);
    };
    ConfigurationModeElement.prototype.set_command = function (term, analyzer) {
        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length - 1; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }
        return config.write(nodes, analyzer.line_parsed.pop().name);
    };
    ConfigurationModeElement.prototype.set_object = function (term, analyzer) {
        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }
        if (typeof config.find(nodes) === 'object') {
            return true;
        }
        return config.write(nodes, {});
    };
    ConfigurationModeElement.prototype.set_array = function (term, analyzer) {
        if (analyzer.optional.is_no === true) {
            analyzer.line_parsed.shift();
        }
        let nodes = [];
        for (let i = 0; i < analyzer.line_parsed.length - 1; i++) {
            nodes.push(analyzer.line_parsed[i].name);
        }
        let arr = config.find(nodes);
        if (typeof arr !== 'object') {
            arr = [];
        }
        arr = arr.filter((val) => {
            return (val !== analyzer.line_parsed[3].name);
        });
        if (analyzer.optional.is_no !== true) {
            arr.unshift(analyzer.line_parsed[3].name);
        }
        return config.write(nodes, arr);
    };
    ConfigurationModeElement.prototype.entry_instance = function (term, analyzer) {
        if (!ins.instances.hasOwnProperty(analyzer.paramaters.instance_name)) {
            term.error('No instance name.')
            return false;
        }
        term.push(enterCommand, {
            name: 'ins_config',
            prompt: 'Tooterminal(config-ins)# ',
            onStart: function () {
                term_mode = mode_config_instance;
                ins.name(analyzer.paramaters.instance_name);
            },
            onExit: function() {
                term_mode = mode_configuration;
                ins.name('');
            }
        })
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

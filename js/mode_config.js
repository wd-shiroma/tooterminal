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
                                        "execute": this.set_command
                                    }, {
                                        "type": "command",
                                        "name": "local",
                                        "description": "ローカルタイムラインのストリーミングを有効にします。",
                                        "execute": this.set_command
                                    }, {
                                        "type": "command",
                                        "name": "public",
                                        "description": "連合タイムラインのストリーミングを有効にします。",
                                        "execute": this.set_command
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
                                "execute": this.set_command,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "animation",
                                        "description": "常にアニメーションを再生します。",
                                        "execute": this.set_command
                                    }, {
                                        "type": "command",
                                        "name": "mouseover",
                                        "description": "マウスオーバーでアニメーションを再生します。",
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
                    }
                    /*, {
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
                                        "description": "取得するタイムラインの設定をします。",
                                        "execute": this.set_default
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
        var index = analyzer.line_parsed.length - 1;
        var t_conf = config;
        for (var i = 0; i < index-1; i++) {
            if (typeof t_conf[analyzer.line_parsed[i].name] === 'undefined') {
                t_conf[analyzer.line_parsed[i].name] = {};
            }
            t_conf = t_conf[analyzer.line_parsed[i].name];
        }
        t_conf[analyzer.line_parsed[index-1].name] = analyzer.paramaters.string;
        return true;
    };
    ConfigurationModeElement.prototype.set_default = function (term, analyzer) {
        var t_conf = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }
        var index = analyzer.line_parsed.length - 1;

        for (var i = 0; i < index; i++) {
            t_conf = t_conf[analyzer.line_parsed[i].name];
            if (typeof t_conf === 'undefined') {
                return true;
            }
        }
        delete(t_conf[analyzer.line_parsed[index].name]);

        return true;
    };
    ConfigurationModeElement.prototype.set_number = function (term, analyzer) {
        term.echo('executed!');
        return true;
    };
    ConfigurationModeElement.prototype.set_true = function (term, analyzer) {
        var t_conf = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        var cmd = 'config';
        for (var i = 0; i < analyzer.line_parsed.length; i++) {
            cmd += '.' + analyzer.line_parsed[i].name;
            if (eval('typeof ' + cmd) === 'undefined') {
                eval(cmd + ' = {}');
            }
            t_conf = t_conf[analyzer.line_parsed[i].name];
        }
        cmd += ' = true';
        eval(cmd);
        return true;
    };
    ConfigurationModeElement.prototype.set_false = function (term, analyzer) {
        var t_conf = config;
        if (analyzer.line_parsed[0].name === 'no') {
            analyzer.line_parsed.shift();
        }

        var cmd = 'config';
        for (var i = 0; i < analyzer.line_parsed.length; i++) {
            cmd += '.' + analyzer.line_parsed[i].name;
            if (eval('typeof ' + cmd) === 'undefined') {
                eval(cmd + ' = {}');
            }
            t_conf = t_conf[analyzer.line_parsed[i].name];
        }
        cmd += ' = false';
        eval(cmd);
        return true;
    };
    ConfigurationModeElement.prototype.set_command = function (term, analyzer) {
        var index = analyzer.line_parsed.length - 1;
        var t_conf = config;
        for (var i = 0; i < index-1; i++) {
            if (typeof t_conf[analyzer.line_parsed[i].name] === 'undefined') {
                t_conf[analyzer.line_parsed[i].name] = {};
            }
            t_conf = t_conf[analyzer.line_parsed[i].name];
        }
        if (typeof analyzer.line_parsed[index].children === 'undefined') {
            t_conf[analyzer.line_parsed[index-1].name] = analyzer.line_parsed[index].name;
        }
        else {
            t_conf[analyzer.line_parsed[index-1].name] = {};
            t_conf[analyzer.line_parsed[index-1].name][analyzer.line_parsed[index].name] = {}
        }
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

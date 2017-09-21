var ws = [];
let InstanceModeElement = (function () {
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
                        "description": '公開範囲を "未収載" に設定します。',
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
                        "name": "access-list",
                        "description": '正規表現フィルターを表示します。',
                        "execute": this.show_acl,
                    }, {
                        "type": "command",
                        "name": "user",
                        "description": 'ユーザー情報を表示します。',
                        "execute": this.show_user,
                        "children": [
                            {
                                "type": "command",
                                "name": "id",
                                "description": 'ユーザーIDを指定',
                                "children": [
                                    {
                                        "type": "number",
                                        "name": "userid",
                                        "min": 1,
                                        "max": 9999999,
                                        "description": 'ユーザID',
                                        "execute": this.show_user,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "statuses",
                                                "description": 'ユーザの最新トゥートを表示',
                                                "execute": this.show_statuses,
                                                "children": [
                                                    {
                                                        "type": "command",
                                                        "name": "limit",
                                                        "description": 'トゥート表示件数を設定します。',
                                                        "children": [
                                                            {
                                                                "type": "number",
                                                                "name": "post_limits",
                                                                "min": 1,
                                                                "max": 40,
                                                                "description": 'トゥート数(初期値20)',
                                                                "execute": this.show_statuses
                                                            }
                                                        ]
                                                    }, {
                                                        "type": "command",
                                                        "name": "pinned",
                                                        "optional": "pinned",
                                                        "description": '固定トゥートを表示します。',
                                                        "execute": this.show_statuses
                                                    }
                                                ]
                                            }, {
                                                "type": "command",
                                                "name": "following",
                                                "description": 'フォローアカウントを表示します。',
                                                "execute": this.show_follows
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
                                "name": "self",
                                "description": 'ログインユーザー',
                                "execute": this.show_user,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "statuses",
                                        "description": 'ユーザの最新トゥートを表示',
                                        "execute": this.show_statuses,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "limit",
                                                "description": 'トゥート表示件数を設定します。',
                                                "children": [
                                                    {
                                                        "type": "number",
                                                        "name": "post_limits",
                                                        "min": 1,
                                                        "max": 40,
                                                        "description": 'トゥート数(初期値20)',
                                                        "execute": this.show_statuses
                                                    }
                                                ]
                                            }, {
                                                "type": "command",
                                                "name": "pinned",
                                                "optional": "pinned",
                                                "description": '固定トゥートを表示します。',
                                                "execute": this.show_statuses
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "following",
                                        "description": 'フォローアカウントを表示します。',
                                        "execute": this.show_follows
                                    }, {
                                        "type": "command",
                                        "name": "followers",
                                        "description": 'フォロワーアカウントを表示します。',
                                        "execute": this.show_follows,
                                    }
                                ]
                            }, /*{
                                "type": "command",
                                "name": "select",
                                "description": 'トゥートから選択',
                                "execute": this.show_user
                            }*/
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
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "limit",
                                        "description": '取得トゥート数',
                                        "children": [
                                            {
                                                "type": "number",
                                                "name": "post_limits",
                                                "min": 1,
                                                "max": 40,
                                                "description": 'トゥート数(初期値20)',
                                                "execute": this.show_statuses,
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "local",
                                "description": 'ローカルタイムライン',
                                "execute": this.show_statuses,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "limit",
                                        "description": '取得トゥート数',
                                        "children": [
                                            {
                                                "type": "number",
                                                "name": "post_limits",
                                                "min": 1,
                                                "max": 40,
                                                "description": 'トゥート数(初期値20)',
                                                "execute": this.show_statuses,
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": '連合タイムライン',
                                "execute": this.show_statuses,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "limit",
                                        "description": '取得トゥート数',
                                        "children": [
                                            {
                                                "type": "number",
                                                "name": "post_limits",
                                                "min": 1,
                                                "max": 40,
                                                "description": 'トゥート数(初期値20)',
                                                "execute": this.show_statuses,
                                            }
                                        ]
                                    }
                                ]
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
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "limit",
                                                "description": '取得トゥート数',
                                                "children": [
                                                    {
                                                        "type": "number",
                                                        "name": "post_limits",
                                                        "min": 1,
                                                        "max": 40,
                                                        "description": 'トゥート数(初期値20)',
                                                        "execute": this.show_statuses,
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "notifications",
                                "description": '通知タイムライン',
                                "execute": this.show_notifications,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "limit",
                                        "description": '取得通知数',
                                        "children": [
                                            {
                                                "type": "number",
                                                "name": "post_limits",
                                                "min": 1,
                                                "max": 40,
                                                "description": '通知数(初期値20)',
                                                "execute": this.show_notifications,
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "statuses",
                        "description": 'トゥートを表示します。',
                        "children": [
                            {
                                "type": "command",
                                "name": "id",
                                "description": 'トゥートIDを指定',
                                "children": [
                                    {
                                        "type": "number",
                                        "name": "status_id",
                                        "min": 1,
                                        "max": 9999999999,
                                        "description": 'トゥートID',
                                        "execute": this.show_status_id
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "self",
                                "description": 'ログインユーザー',
                                "execute": this.show_statuses
                            },
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
                "description": 'インスタンスにログインをし、アクセストークンを更新します',
                "execute": this.login,
            }, {
                "type": "command",
                "name": "terminal",
                "description": 'ストリーミングの設定を行います。',
                "execute": this.terminal_monitor,
                "optional": "on_monitor",
                "children": [
                    {
                        "type": "command",
                        "name": "monitor",
                        "description": 'ストリーミングを有効にします。',
                        "execute": this.terminal_monitor,
                        "children": [
                            {
                                "type": "command",
                                "name": "home",
                                "description": 'ホームタイムラインをモニターします。',
                                "execute": this.terminal_monitor,
                            }, {
                                "type": "command",
                                "name": "local",
                                "description": 'ローカルタイムラインをモニターします。',
                                "execute": this.terminal_monitor,
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": '連合タイムラインをモニターします。',
                                "execute": this.terminal_monitor,
                            }, {
                                "type": "command",
                                "name": "tag",
                                "description": 'ハッシュタグをモニターします。',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "hashtag",
                                        "description": 'ハッシュタグ文字列',
                                        "execute": this.terminal_monitor,
                                        "children": [
                                        ]
                                    }
                                ]
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "no",
                        "description": 'ストリーミングを無効にします。',
                        "execute": this.terminal_monitor,
                        "optional": "no_monitor",
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
                "name": "monitor",
                "description": 'デフォルトのストリーミング設定を行います。',
                "children": [
                    {
                        "type": "command",
                        "name": "home",
                        "description": 'ホームタイムラインをモニターします。',
                        "execute": this.monitor,
                    }, {
                        "type": "command",
                        "name": "local",
                        "description": 'ローカルタイムラインをモニターします。',
                        "execute": this.monitor,
                    }, {
                        "type": "command",
                        "name": "public",
                        "description": '連合タイムラインをモニターします。',
                        "execute": this.monitor,
                    }, {
                        "type": "command",
                        "name": "tag",
                        "description": 'ハッシュタグをモニターします。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "hashtag",
                                "description": 'ハッシュタグ文字列',
                                "execute": this.monitor,
                                "children": [
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "access-list",
                "description": '正規表現フィルタを設定します。',
                "children": [
                    {
                        "type": "number",
                        "name": "acl_num",
                        "description": 'ACL番号',
                        "min": 1,
                        "max": 99,
                        "children": [
                            {
                                "type": "command",
                                "name": "deny",
                                "description": '非表示にするトゥート',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "regular_expression",
                                        "description": '正規表現文字列',
                                        "execute": this.set_acl
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "permit",
                                "description": '強調するトゥート',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "regular_expression",
                                        "description": '正規表現文字列',
                                        "execute": this.set_acl,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "color",
                                                "description": "背景色を設定します",
                                                "children": [
                                                    {
                                                        "type": "command",
                                                        "name": "red",
                                                        "optional": "is_color",
                                                        "description": "赤色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "green",
                                                        "optional": "is_color",
                                                        "description": "緑色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "blue",
                                                        "optional": "is_color",
                                                        "description": "青色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "yellow",
                                                        "optional": "is_color",
                                                        "description": "黄色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "purple",
                                                        "optional": "is_color",
                                                        "description": "紫色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "cyan",
                                                        "optional": "is_color",
                                                        "description": "水色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-red",
                                                        "optional": "is_color",
                                                        "description": "濃赤色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-blue",
                                                        "optional": "is_color",
                                                        "description": "紺色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-green",
                                                        "optional": "is_color",
                                                        "description": "深緑色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-yellow",
                                                        "optional": "is_color",
                                                        "description": "山吹色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-purple",
                                                        "optional": "is_color",
                                                        "description": "紫紺色",
                                                        "execute": this.set_acl
                                                    }, {
                                                        "type": "command",
                                                        "name": "dark-cyan",
                                                        "optional": "is_color",
                                                        "description": "藍色",
                                                        "execute": this.set_acl
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "no",
                "description": '設定を削除します。',
                "children": [
                    {
                        "type": "command",
                        "name": "access-list",
                        "description": '正規表現フィルタを削除します。',
                        "execute": this.set_acl,
                        "children": [
                            {
                                "type": "number",
                                "name": "acl_num",
                                "description": '正規表現文字列',
                                "min": 1,
                                "max": 99,
                                "execute": this.set_acl
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "clear",
                "description": "画面を消去します。",
                "execute": this.clear
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
        term.pause();
        let _ins = ins.get();
        let uri = encodeURIComponent(_ins.application.uris);
        let url =
            'https://'         + _ins.domain
            + '/oauth/authorize?response_type=code'
            + '&client_id='    + _ins.client_id
            + '&redirect_uri=' + uri
            + '&scope='        + (_ins.application.scopes.read   ? 'read '  : '')
                               + (_ins.application.scopes.write  ? 'write ' : '')
                               + (_ins.application.scopes.follow ? 'follow' : '');
        if (uri.match(/^https?:\/\//)) {
            location.href = url;
            term.pause();
            return true;
        }

        window.open(url, '_blank');
        term.push((input, term) => {
            if (input.trim().length == 0) {
                term.pop()
            }
            term.pause();
            term.prompt = '';
            $.ajax({
                url: 'https://' + _ins.domain + '/oauth/token',
                type: 'POST',
                dataType: 'json',
                data: {
                    grant_type: 'authorization_code',
                    redirect_uri: _ins.application.uris,
                    client_id: _ins.client_id,
                    client_secret: _ins.client_secret,
                    code: input.trim()
                }
            }).then((data, status, jqxhr) => {
                _ins.access_token = data.access_token;
                _ins.token_type = data.token_type;
                ins.save();

                return callAPI('/api/v1/accounts/verify_credentials');
            }, (jqxhr, status, error) => {
                term.error('User token updating error.(' + jqxhr.status + ')');
                console.log(jqxhr);
            }).then((data2, status, jqxhr) => {
                term.echo('Hello! ' + data2.display_name + ' @' + data2.username);
                _ins.user = data2;

                ins.save();
                term.resume();

                let prompt = _ins.user.username;
                prompt += '@' + _ins.domain + '# ';

                delete(_ins.auth_code);
                term.pop();

            }, (jqxhr, status, error) => {
                console.log(jqxhr);
                term.error('Getting user status failed.(' + jqxhr.status + ')');
                term.resume();
            });
        }, {
            prompt: 'Input Authentication Code: ',
        });
        return true;
    };
    InstanceModeElement.prototype.terminal_monitor = function (term, analyzer) {
        if (
            (analyzer.optional.on_monitor === true)
            && (ws.length === 0 || ws[0].readyStatus >= WebSocket.CLOSING)
        ) {
            let _ins = ins.get();
            if (typeof analyzer.line_parsed[2] === 'undefined') {
                monitor = config.find('instances.terminal.monitor');
            }
            else if (analyzer.line_parsed[2].name === 'tag') {
                monitor = analyzer.paramaters.hashtag;
            }
            else {
                monitor = analyzer.line_parsed[2].name;
            }
            let notifies = config_notify();

            let is_noti = false;
            for (let noti in notifies) {
                is_noti = (is_noti || noti);
            }

            let api = 'wss://' + _ins.domain
                            + '/api/v1/streaming?access_token='
                            + _ins.access_token
                            + '&stream=user';

            let type = typeof analyzer.line_parsed[2] === 'undefined' ? 'local' : analyzer.line_parsed[2].name;
            let path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
            let limit = config.find(['instances', 'terminal', 'length']);
            limit = (limit > 0) ? limit : 20;
            params = { limit: limit };
            if (type === 'local') {
                params.local = true;
            }
            else if (type === 'tag') {
                path += '/' + analyzer.paramaters.tag_name;
            }
            term.pause();
            callAPI(path, { data: params })
            .then((data, status, jqxhr) => {
                for (let i = data.length - 1; i >= 0; i--) {
                    if (analyzer.optional.pinned && !data[i].pinned) {
                        continue;
                    }
                    term.echo(makeStatus(data[i]), {raw: true, flush: false});
                }
                term.resume();
                term.flush();
            })

            if (monitor === 'home') {
                let ws_t = new WebSocket(api);

                ws_t.onmessage = (e) => {
                    let data = JSON.parse(e.data);
                    let payload;

                    if (data.event === 'delete') {
                        payload = data.payload;
                        $('[name=id_' + payload + ']').addClass('status_deleted');
                        if (notifies.delete) {
                            term.error('deleted ID:' + payload);
                        }
                    }
                    else if(data.event === 'notification') {
                        payload = JSON.parse(data.payload);
                        term.echo(make_notification(payload, notifies), {raw: true});

                        if(beep_buf) {
                            let source = context.createBufferSource();
                            source.buffer = beep_buf;
                            source.connect(context.destination);
                            source.start(0);
                        }
                    }
                    else if(data.event === 'update') {
                        payload = JSON.parse(data.payload);
                        let status = makeStatus(payload);
                        term.echo(status, { raw: true });
                    }
                    reduce_status();
                    //console.log(payload);
                };

                ws_t.onopen = () => {
                    term.echo("Home Streaming start.");
                };

                ws_t.onerror = (e) => {
                    term.error('Home Streaming error. closed.');
                    console.log(e);
                };

                ws_t.onclose = () => {
                    term.echo("Home Streaming closed.");
                };
                ws.push(ws_t);
            }
            else {
                let ws_t = new WebSocket(api);

                if (is_noti) {
                    ws_t.onmessage = (e) => {
                        let data = JSON.parse(e.data);
                        let payload;

                        if(data.event === 'notification') {
                            payload = JSON.parse(data.payload);
                            term.echo(make_notification(payload, notifies), {raw: true});
                        }
                    };

                    ws_t.onopen = () => {
                        term.echo("Notification Streaming start.");
                    };

                    ws_t.onerror = (e) => {
                        console.warn(e);
                    };

                    ws_t.onclose = () => {
                        term.echo("Notification Streaming closed.");
                    };

                    ws.push(ws_t);
                }
                api = 'wss://'
                        + _ins.domain
                        + '/api/v1/streaming?access_token='
                        + _ins.access_token
                        + ((monitor === 'local')  ? '&stream=public:local'
                         : (monitor === 'public') ? '&stream=public'
                         : ('&stream=hashtag&tag=' + monitor));

                ws_t = new WebSocket(api);

                ws_t.onmessage = (e) => {
                    let data = JSON.parse(e.data);
                    let payload;

                    if (data.event === 'delete') {
                        payload = data.payload;
                        $('[name=id_' + payload + ']').addClass('status_deleted');
                        if (notifies.delete) {
                            term.error('deleted ID:' + payload);
                        }
                    }
                    else if(data.event === 'update') {
                        payload = JSON.parse(data.payload);
                        let status = makeStatus(payload);
                        term.echo(status, { raw: true });
                    }
                    reduce_status();
                };

                ws_t.onopen = () => {
                    term.echo(monitor + " Streaming start.");
                };

                ws_t.onerror = (e) => {
                    console.warn(e);
                };

                ws_t.onclose = () => {
                    term.echo(monitor + " Streaming closed.");
                };
                ws.push(ws_t);
            }
        }
        else if(analyzer.optional.no_monitor === true){
            for (let i = 0; i < ws.length; i++) {
                ws[i].close();
                ws[i] = undefined;
            }
            ws = [];
        }
    };
    InstanceModeElement.prototype.toot = function (term, analyzer) {
        let visibility;
        if (typeof analyzer.line_parsed[1] !== 'undefined') {
            visibility = analyzer.line_parsed[1].name;
        }
        else {
            visibility = config.find('instances.visibility');
        }
        if (typeof visibility === 'undefined') {
            visibility = 'public';
        }
        $('#toot_visibility').val(visibility);
        $('#toot').slideDown('first');
        $('#toot_box').focus();
        term.focus(false);
    };
    InstanceModeElement.prototype.monitor = function (term, analyzer) {
        ins.get().monitor = (analyzer.line_parsed[1].name === 'tag')
                    ? analyzer.paramaters.hashtag
                    : analyzer.line_parsed[1].name;
        ins.save();
    };
    InstanceModeElement.prototype.show_user = function (term, analyzer) {
        term.pause();
        let api;
        if (typeof analyzer.line_parsed[2] === 'undefined' || analyzer.line_parsed[2].name === 'self') {
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
            let created = new Date(data.created_at);
            let passing = parseInt((Date.now() - created.getTime()) / 60000);
            let minutes = passing % 60;
            let hours   = (passing = (passing - minutes) / 60) % 24;
            let days    = (passing = (passing - hours) / 24) % 7;
            let weeks   = (passing - days) / 7;
            term.echo(data.display_name + ' ID:' + data.id
                + (data.locked ? ' is locked' : ' is unlocked'), {flush: false});
            term.echo('Username is ' + data.username + ', Fullname is ' + data.acct, {flush: false});
            term.echo('Created at ' + created.toString(), {flush: false});
            term.echo('Uptime is '
                    + weeks + ' weeks, ' + days + ' days, ' + hours + ' hours, '
                    + minutes + ' minutes (' + passing + ' days have passed)', {flush: false});
            term.echo(data.statuses_count  + ' statuses posted, '
                    + $('<a />')
                        .attr('name', 'cmd_following')
                        .attr('data-uid', data.id)
                        .text(data.following_count + ' accounts are following')
                        .prop('outerHTML') + ', '
                    + $('<a />')
                        .attr('name', 'cmd_followers')
                        .attr('data-uid', data.id)
                        .text(data.followers_count + ' accounts are followed')
                        .prop('outerHTML')
            , {raw: true, flush: false});
            term.echo('1 day toot rate ' + parseInt(data.statuses_count / passing) + ' posts/day', {flush: false});
            term.echo($.terminal.format('Note:' + data.note), {raw: true, flush: false});
            term.echo('URL: ' + data.url, {raw: false, flush: false});

            return callAPI('/api/v1/accounts/' + data.id + '/statuses', {
                data: { pinned: true }
            });
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            let response = JSON.parse(jqxhr.responseText);
            term.echo('Getting user data failed.(' + jqxhr + ')');
            term.resume();
        })
        .then((data, status, jqxhr) => {
            if (data.length > 0 && data[0].pinned) {
                term.echo('<br />', {raw: true, flush: false})
                term.echo('[[ub;;]Pinned statuses]', {flush: false});
                for (let i = 0; i < data.length; i++) {
                    if (i > 2) {
                        let more = $('<a />')
                            .attr('name', 'cmd_status_pinned')
                            .attr('data-uid', data[i].account.id)
                            .text('... and more pinned status');
                        term.echo(more.prop('outerHTML'), {raw: true, flush: false});
                        break;
                    }
                    else {
                        term.echo(makeStatus(data[i]), {raw: true, flush: false});
                    }
                }
            }
            term.echo('[OK]', {flush: false});
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            console.log(jqxhr);
            let response = JSON.parse(jqxhr.responseText);
            //term.echo('Getting user data failed.(' + jqxhr + ')');
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
            let max_len = 15;
            for (let i = 0; i < data.accounts.length; i++) {
                if (max_len < data.accounts[i].acct.length) {
                    max_len = data.accounts[i].acct.length;
                }
            }
            max_len += 7;

            let sep;
            for (sep = '---------------'; sep.length < (max_len); sep += '-') {};
            sep += '----------------------------';
            let lines = [
                'Accounts:',
                ('| display name').addTab('| account name', max_len).addTab('id', 9),
                sep
            ];
            for (let i = 0; i < data.accounts.length; i++) {
                lines.push(
                    ('| ' + data.accounts[i].display_name)
                        .addTab('| @' + data.accounts[i].acct, max_len)
                        .addTab(data.accounts[i].id, 9)
                );
            }


            lines.push('----------------------------------------------------------');
            lines.push('  該当件数：' + data.accounts.length + '件');
            lines.push('');
            lines.push('Hash tags:');
            lines.push('-----------------------------------');
            for (let i = 0; i < data.hashtags.length; i++) {
                lines.push('#' + data.hashtags[i]);
            }
            lines.push('-----------------------------------');
            lines.push('  該当件数：' + data.hashtags.length + '件');
            term.echo(lines.join("\n"));
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Search request is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_instance = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            console.log(data);
            term.echo('======== API Information ========', {flush: false});
            term.echo('Instance name: ' + data.title, {flush: false});
            term.echo('Version: ' + data.version, {flush: false});
            term.echo('Description: ' + data.description, {flush: false});
            term.echo('E-mail: ' + data.email, {flush: false});
            term.echo('URI: ' + data.uri, {flush: false});
            if (data.hasOwnProperty('stats')) {
                term.echo('Connection instances: ' + data.stats.domain_count, {flush: false});
                term.echo('Posted toots: ' + data.stats.status_count, {flush: false});
                term.echo('Registed users: ' + data.stats.user_count, {flush: false});
            }
            term.echo('Streaming uri: ' + data.urls.streaming_api, {flush: false});
            term.echo('[OK]', {flush: false});/*
            term.echo('<br >======== User Information ========', { raw: true, flush: false});
            term.echo('Instance name: ' + data.title, {flush: false});
            term.echo('Version: ' + data.version, {flush: false});
            term.echo('Description: ' + data.description, {flush: false});
            term.echo('E-mail: ' + data.email, {flush: false});
            term.echo('URI: ' + data.uri, {flush: false});*/
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting instance data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_authentication = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            let json_str = JSON.stringify(data, null, '    ');
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
        let api;
        let path;
        let params;

        let limit = (
            typeof analyzer.paramaters.post_limits !== 'undefined'
            && analyzer.paramaters.post_limits > 0
        ) ? analyzer.paramaters.post_limits : config.find(['instances', 'terminal', 'length']);
        limit = (limit > 0) ? limit : 20;

        if (analyzer.line_parsed[1].name === 'timeline') {
            let type = typeof analyzer.line_parsed[2] === 'undefined' ? 'local' : analyzer.line_parsed[2].name;
            path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
            params = {};
            if (type === 'local') {
                params.local = true;
            }
            else if (type === 'tag') {
                path += '/' + analyzer.paramaters.tag_name;
            }
        }
        else if (analyzer.line_parsed[1].name === 'user'){
            let userid = (analyzer.line_parsed.length === 2 || analyzer.line_parsed[2].name === 'self')
                       ? ins.get().user.id
                       : analyzer.line_parsed[2].name === 'id' ? analyzer.paramaters.userid
                       : -1;
            if (userid > 0) {
                params = {
                    limit: limit,
                }
                if (analyzer.optional.hasOwnProperty('pinned')) {
                    params.pinned = true;
                }
                path = '/api/v1/accounts/' + userid + '/statuses'
            }
            else {
                term.error('no login.');
                return;
            }
        }

        if (typeof path === 'undefined') {
            term.error('show status error.');
            return;
        }
        let statuses = [];
        let current_sid = 0;
        term.push(function(command, moreterm){},{
            name: 'more',
            //prompt: '[[;#111111;#DDDDDD]-- More --]',
            prompt: '--More-- ',
            onStart: function(moreterm){
                moreterm.pause();
                callAPI(path, {
                    type: 'GET',
                    data: params
                })
                .then((data, status, jqxhr) => {
                    statuses = [];
                    for (let i = 0; i < data.length; i++) {
                        if (analyzer.optional.pinned && !data[i].pinned) {
                            continue;
                        }
                        moreterm.echo(makeStatus(data[i]), {raw: true, flush: false});
                        current_sid = data[i].id;
                    }
                    moreterm.resume();
                    moreterm.flush();
                    if (data.length < limit) {
                        moreterm.pop();
                    }
                }, (jqxhr, status, error) => {
                    moreterm.error('Failed to getting statsues.');
                    moreterm.resume();
                })
            },
            onExit: function(term) {
                setTimeout(function() {
                    term.set_command('');
                }, 10);
            },
            keydown: function(event, term){
                function echo_statuses(size) {
                    if (!(size > 0)) {
                        return;
                    }
                    size = statuses.length < size ? statuses.length : size;
                    let updated = [];
                    for (let i = 0; i < size; i++) {
                        let stats = statuses.shift();
                        term.echo(stats, {raw: true, flush: false});
                    }
                    term.flush();
                }
                switch(event.keyCode){
                    case 27:
                    case 81:
                        term.pop();
                        term.set_command('');
                        break;
                    case 13:
                    default:
                        term.pause();
                        let echo_size = (event.keyCode === 13) ? 1 : limit;
                        params.limit = 100;
                        if (current_sid > 0) {
                            params.max_id = current_sid - 1;
                        }
                        if (!(statuses.length > 0)) {
                            callAPI(path, {
                                type: 'GET',
                                data: params
                            })
                            .then((data, status, jqxhr) => {
                                if (data.length === 0) {
                                    term.pop();
                                    return;
                                }
                                statuses = [];
                                for (let i = 0; i < data.length; i++) {
                                    if (analyzer.optional.pinned && !data[i].pinned) {
                                        continue;
                                    }
                                    statuses.push(makeStatus(data[i]));
                                    current_sid = data[i].id;
                                }
                                echo_statuses(echo_size);
                                term.resume();
                            }, (jqxhr, status, error) => {
                                term.error('Failed to getting statsues.');
                            });
                        }
                        else {
                            echo_statuses(echo_size);
                            term.resume();
                        }
                }
                setTimeout(() => { term.set_command(''); }, 10);
                return true;
            }
        });
        return;
    };
    InstanceModeElement.prototype.show_status_id = function (term, analyzer) {
        term.pause();
        let sid = analyzer.paramaters.status_id;
        $.when(
            callAPI('/api/v1/statuses/' + sid, { type: 'GET' }),
            callAPI('/api/v1/statuses/' + sid + '/context', { type: 'GET' }),
            callAPI('/api/v1/statuses/' + sid + '/card', { type: 'GET' })
        ).then((res_status, res_context, res_card) => {
            let status = res_status[0];
            let context = res_context[0];
            let card = res_card[0];

            let s;
            for (let i = 0; i < context.ancestors.length; i++) {
                s = makeStatus(context.ancestors[i]);
                term.echo(s, { raw: true, flush: false });
            }
            term.echo(makeStatus(status), { raw: true, flush: false });
            if (card.hasOwnProperty('url')) {
                let card_elem = $('<a />')
                        .attr('href', card.url)
                        .attr('target', '_blank')
                        .addClass('status_card')
                        .append($('<div />')
                            .append($('<span />').text('[ ' + card.title + ' ]'))
                            .append($('<br />'))
                            .append($('<span />').text(card.description)));
                if (config.find(['instances', 'status', 'avater']) === true) {
                    card_elem.append($('<img />').attr('src', card.image));
                }

                let img = new Image();
                img.onload = () => {
                    $('[name=card_' + status.id + '] img').attr('src', card.image);
                };
                img.onerror = (e) => {
                    console.log(e);
                };
                img.src = card.image;
                term.echo(card_elem.prop('outerHTML'), {raw: true, flush: false});
                term.echo('<br />', {raw: true, flush: false});
            }
            let cur_detail = status.favourites_count + ' account favourited, '
                    + status.reblogs_count + ' account reblogged.\n'
                    + 'URL: ' + status.url + '\n';

            if (config.find('instances.status.separator')) {
                cur_detail += Array($.terminal.active().cols() - 5).join('-') + '\n';
            }

            term.echo(cur_detail, { flush: false });
            for (let i = 0; i < context.descendants.length; i++) {
                s = makeStatus(context.descendants[i]);
                term.echo(s, { raw: true, flush: false });
            }
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting statuses is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_follows = function (term, analyzer) {
        term.pause();
        let api;
        let userid;
        let type;
        if (analyzer.line_parsed.length === 2 || analyzer.line_parsed[2].name === 'self'){
            userid = ins.get().user.id;
            type = analyzer.line_parsed[3].name;
        }
        else {
            userid = analyzer.paramaters.userid;
            type = analyzer.line_parsed[4].name;
        }
        api = '/api/v1/accounts/' + userid + '/' + type;
        callAPI(api, {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            let max_len = 15;
            for (let i = 0; i < data.length; i++) {
                if (max_len < data[i].acct.length) {
                    max_len = data[i].acct.length;
                }
            }
            max_len += 7;

            let sep;
            for (sep = '---------------'; sep.length < (max_len); sep += '-') {};
            sep += '----------------------------';
            let lines = [
                'Accounts:',
                ('| display name').addTab('| account name', max_len).addTab('id', 9),
                sep
            ];
            for (let i = 0; i < data.length; i++) {
                lines.push(
                    ('| ' + data[i].display_name)
                        .addTab('| @' + data[i].acct, max_len)
                        .addTab(data[i].id, 9)
                );
            }
            lines.push(sep);
            lines.push('  該当件数：' + data.length + '件');
            lines.push('');
            term.echo(lines.join("\n"));
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting account data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_notifications = function (term, analyzer) {
        term.pause();
        let data = {};
        let notifies = config_notify();
        if (analyzer.paramaters.post_limits) {
            data.limit = analyzer.paramaters.post_limits;
        }
        callAPI('/api/v1/notifications', {
            type: 'GET',
            data: data
        }).then((data, status, jqxhr) => {
            for (let i = data.length-1; i >= 0; i--) {
                term.echo(make_notification(data[i], notifies), {raw: true});
            }
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_acl = function (term, analyzer) {
        let acls = ins.acls[ins.name()];
        if (!acls) {
            return;
        }
        for (let acl_num in acls) {
            term.echo('Standard Status access list ' + acl_num);
            term.echo('    ' + acls[acl_num].type + ' regexp '
                + acls[acl_num].regexp.toString()
                + ', color ' + acls[acl_num].color);
        }
        return true;
    };
    InstanceModeElement.prototype.set_acl = function (term, analyzer) {
        let _ins = ins.get();
        let bgcolor = analyzer.optional.is_color ? analyzer.line_parsed[5].name : 'dark-blue';
        if (analyzer.line_parsed[0].name === 'no') {
            if (analyzer.paramaters.hasOwnProperty('acl_num')) {
                delete(_ins.acl[analyzer.paramaters.acl_num]);
            }
            else {
                delete(_ins.acl);
            }
        }
        else {
            if (!_ins.hasOwnProperty('acl')) {
                _ins.acl = {};
            }
            if (!_ins.acl[analyzer.paramaters.acl_num]) {
                _ins.acl[analyzer.paramaters.acl_num] = {};
            }
            let _acl = _ins.acl[analyzer.paramaters.acl_num];
            _acl.type = analyzer.line_parsed[2].name;
            _acl.regexp = analyzer.paramaters.regular_expression;
            _acl.color = bgcolor;
        }
        ins.parse_acl();
        ins.save();
        return true;
    };
    /* template */
    InstanceModeElement.prototype.template = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/instance', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            let json_str = JSON.stringify(data, null, '    ');
            term.echo(json_str);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.clear = function (term, analyzer) {
        term.clear();
        return true;
    };
    return InstanceModeElement;
}());

function config_notify() {
    let notifies = {};
    let noti_src = config.find(['instances', 'terminal', 'logging']);
    if (url_params.hasOwnProperty('notification')) {
        noti_src = url_params.notification.split(',');
        notifies = {
            delete: noti_src.indexOf('del') >= 0,
            favourite: noti_src.indexOf('fav') >= 0,
            reblog: noti_src.indexOf('reb') >= 0,
            mention: noti_src.indexOf('men') >= 0,
            following: noti_src.indexOf('fol') >= 0,
        };
    }
    else if (typeof noti_src === 'object') {
        notifies = {
            delete: (noti_src !== false && noti_src.delete === true),
            favourite: (noti_src !== false && noti_src.favourite !== false),
            reblog: (noti_src !== false && noti_src.reblog !== false),
            mention: (noti_src !== false && noti_src.mention !== false),
            following: (noti_src !== false && noti_src.following !== false)
        };
    }
    else {
        notifies = {
            delete: false,
            favourite: true,
            reblog: true,
            mention: true,
            following: true
        }
    }
    return notifies;
}
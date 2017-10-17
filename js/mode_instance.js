var ws = {
    stream: [],
    startup: 'local',
    monitor: {
        home: false,
        local: false,
        public: false,
        tag: false,
        notification: false
    },
};
let InstanceModeElement = (function () {
    function InstanceModeElement() {
        this._cmd_mode = "global";
        this._user_max = 9999999;
        this._sh_stats_opt = [
            {
                "type": "command",
                "name": "limit",
                "optional": "limit",
                "description": '取得トゥート数',
                "children": [
                    {
                        "type": "number",
                        "name": "post_limits",
                        "min": 1,
                        "max": 40,
                        "description": 'トゥート数(初期値20)',
                        "execute": this.show_statuses,
                        "children": [
                            {
                                "type": "command",
                                "name": "max_id",
                                "optional": "max_id",
                                "description": '指定ID以前のトゥートを表示',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "status_id",
                                        "description": 'トゥートID',
                                        "execute": this.show_statuses
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "max_id",
                "optional": "max_id",
                "description": '指定ID以前のトゥートを表示',
                "children": [
                    {
                        "type": "paramater",
                        "name": "status_id",
                        "description": 'トゥートID',
                        "execute": this.show_statuses,
                        "children": [
                            {
                                "type": "command",
                                "name": "limit",
                                "optional": "limit",
                                "description": '取得トゥート数',
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
                            }
                        ]
                    }
                ]
            }
        ];
        this._acl_opts = [
            {
                "type": "command",
                "name": "color",
                "optional": "is_color",
                "description": "背景色を設定します",
                "children": [
                    {
                        "type": "command",
                        "name": "red",
                        "description": "赤色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "green",
                        "description": "緑色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "blue",
                        "description": "青色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "yellow",
                        "description": "黄色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "purple",
                        "description": "紫色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "cyan",
                        "description": "水色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-red",
                        "description": "濃赤色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-blue",
                        "description": "紺色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-green",
                        "description": "深緑色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-yellow",
                        "description": "山吹色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-purple",
                        "description": "紫紺色",
                        "execute": this.set_acl
                    }, {
                        "type": "command",
                        "name": "dark-cyan",
                        "description": "藍色",
                        "execute": this.set_acl
                    }
                ]
            }, {
                "type": "command",
                "name": "notification",
                "optional": "is_notify",
                "description": "デスクトップ通知を設定します。",
                "execute": this.set_acl
            }, {
                "type": "command",
                "name": "voice",
                "optional": "is_voice",
                "description": "合成音声を設定します。",
                "children": [
                    {
                        "type": "paramater",
                        "name": "voice_text",
                        "description": "文字",
                        "execute": this.set_acl
                    }
                ]
            }
        ];
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
                        "name": "terminal",
                        "description": '再生中のストリーミング情報を表示します。',
                        "execute": this.show_terminal,
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
                                        "max": this._user_max,
                                        "description": 'ユーザID',
                                        "execute": this.show_user,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "statuses",
                                                "description": 'ユーザの最新トゥートを表示',
                                                "execute": this.show_statuses,
                                                "children": this._sh_stats_opt
                                                /*"children": [ 固定トゥ表示は一旦廃止～
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
                                                ]*/
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
                                        "children": this._sh_stats_opt
                                        /*"children": [
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
                                        ]*/
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
                                "children": this._sh_stats_opt
                            }, {
                                "type": "command",
                                "name": "local",
                                "description": 'ローカルタイムライン',
                                "execute": this.show_statuses,
                                "children": this._sh_stats_opt
                            }, {
                                "type": "command",
                                "name": "public",
                                "description": '連合タイムライン',
                                "execute": this.show_statuses,
                                "children": this._sh_stats_opt
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
                                        "children": this._sh_stats_opt
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "notifications",
                                "description": '通知タイムライン',
                                "execute": this.show_notifications,
                                "children": this._sh_stats_opt
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
                                        "type": "paramater",
                                        "name": "status_id",
                                        "description": 'トゥートID',
                                        "execute": this.show_status_id,
                                        "children": [
                                            {
                                                "type": "command",
                                                "name": "favourited",
                                                "description": 'お気に入りユーザー一覧',
                                                "execute": this.show_follows
                                            }, {
                                                "type": "command",
                                                "name": "reblogged",
                                                "description": 'ブーストユーザー一覧',
                                                "execute": this.show_follows
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
                "name": "search",
                "description": "検索を行います",
                "children": [
                    {
                        "type": "command",
                        "name": "local",
                        "description": 'インスタンス内から検索します。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "query",
                                "description": '検索キーワード',
                                "execute": this.search_query,
                            }
                        ]
                    }/*, {
                        "type": "command",
                        "name": "tootsearch",
                        "description": 'tootsearchエンジンを利用して検索します。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "query",
                                "description": '検索キーワード',
                                "execute": this.search_query,
                            }
                        ]
                    }*/
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
                "children": [
                    {
                        "type": "command",
                        "name": "monitor",
                        "optional": "on_monitor",
                        "description": 'ストリーミングを有効にします。',
                        "execute": this.terminal_monitor,
                        "children": [
                            {
                                "type": "command",
                                "name": "notification",
                                "description": '通知タイムラインをモニターします。',
                                "execute": this.terminal_monitor,
                            }, {
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
            }, {/*
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
            }, {*/
                "type": "command",
                "name": "request",
                "description": '他ユーザーに対してリクエストを送信します。',
                "children": [
                    {
                        "type": "command",
                        "name": "follow",
                        "description": 'フォローします。',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "unfollow",
                        "description": 'フォローを解除します。',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "mute",
                        "description": 'ミュートします',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "unmute",
                        "description": 'ミュートを解除します。',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "block",
                        "description": 'ブロックします。',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "unblock",
                        "description": 'ブロック解除します。',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "min": 1,
                                "max": this._user_max,
                                "description": 'ユーザーID',
                                "execute": this.request_relationship,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "remote-follow",
                        "description": 'リモートフォローします。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "acct",
                                "description": 'アカウントID',
                                "execute": this.request_remote_follow,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "delete",
                        "description": 'トゥートを削除します。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "status_id",
                                "description": 'トゥートID',
                                "execute": this.request_delete_status,
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
                                        "children": this._acl_opts
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "add",
                                "optional": "is_add",
                                "description": '既存ACLに通知方法を追加',
                                "children": this._acl_opts
                            }, {
                                "type": "command",
                                "name": "drop",
                                "description": 'フィルターの無効化',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "regular_expression",
                                        "description": '正規表現文字列',
                                        "execute": this.set_acl
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
        if (uri.match(/^https?%3A%2F%2F/)) {
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

        function push_monitor(stream, hashtag) {
            if (stream === 'tag' && typeof hashtag !== 'string') {
                term.error('Hashtag is undefined.')
                return false;
            }

            let _stream = {};
            if (stream === 'home' || stream === 'notification') {
                for (let i = 0; i < ws.stream.length; i++) {
                    if (ws.stream[i].type === 'user') {
                        ws.monitor[stream] = true;
                        return true;
                    }
                }
                _stream.type = 'user';
            }
            else if (stream === 'tag') {
                for (let i = 0; i < ws.stream.length; i++) {
                    if (ws.stream[i].type === 'tag' && ws.stream[i].name === hashtag) {
                        ws.monitor['tag'] = true;
                        return true;
                    }
                }
                _stream.type = 'tag';
                _stream.name = hashtag;
            }
            else {
                for (let i = 0; i < ws.stream.length; i++) {
                    if (ws.stream[i].type === stream) {
                        ws.monitor[stream] = true;
                        return true;
                    }
                }
                _stream.type = stream;
            }

            let _ins = ins.get();
            let url = 'wss://' + _ins.domain
                    + '/api/v1/streaming?access_token='
                    + _ins.access_token;
            if (stream === 'home' || stream === 'notification') {
                url += '&stream=user';
            }
            else if (stream === 'local') {
                url += '&stream=public:local';
            }
            else if (stream === 'public') {
                url += '&stream=public';
            }
            else if (stream === 'tag') {
                url += '&stream=hashtag&tag=' + hashtag;
            }
            else {
                term.error('Monitor stream type error.');
                return false;
            }

            let label =
                (stream === 'home') ? '<i class="fa fa-home" aria-hidden="true"></i> HOME' :
                (stream === 'notification') ? '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> NOTIFICATION' :
                (stream === 'local') ? '<i class="fa fa-users" aria-hidden="true"></i> LOCAL' :
                (stream === 'public') ? '<i class="fa fa-globe" aria-hidden="true"></i> GLOBAL' :
                (stream === 'tag') ? ('<i class="fa fa-tag" aria-hidden="true"></i> HASHTAG: ' + hashtag) : '???';

            ws.monitor[stream] = true;

            let notifies = config_notify();
            let is_noti = false;
            for (let noti in notifies) {
                is_noti = (is_noti || noti);
            }
            let onmessage = (stream === 'home' || stream === 'notification')
                ? function(e) {
                    let data = JSON.parse(e.data);
                    let payload;

                    if (data.event === 'delete') {
                        payload = data.payload;
                        $('[name=id_' + payload + ']').addClass('status_deleted');
                        if (notifies.delete) {
                            term.error('deleted ID:' + payload);
                        }
                    }
                    else if(data.event === 'notification' && ws.monitor.notification === true) {
                        payload = JSON.parse(data.payload);
                        let notification = make_notification(payload, notifies)
                        term.echo(notification, {raw: true});

                        let is_desktop = config.find(['instances', 'terminal', 'notification']);
                        if (typeof is_desktop === 'undefined') {
                            is_desktop = {};
                        }

                        if(beep_buf) {
                            let source = context.createBufferSource();
                            source.buffer = beep_buf;
                            source.connect(context.destination);
                            source.start(0);
                        }


                        let title;
                        let body;
                        if (payload.type === 'favourite' && is_desktop.favourite && notification) {
                            title =　'お気に入り： ';
                            body = payload.status.content;
                        }
                        else if (payload.type === 'reblog' && is_desktop.reblog && notification) {
                            title = 'ブースト： ';
                            body = payload.status.content;
                        }
                        else if (payload.type === 'mention' && is_desktop.mention && notification) {
                            title = 'リプライ： ';
                            body = payload.status.content;
                        }
                        else if (payload.type === 'follow' && is_desktop.following && notification) {
                            title = 'フォロー： ';
                        }

                        if (typeof body === 'string') {
                            body = $(body).text();
                            if (body.length > 100) {
                                body = body.slice(0, 100);
                            }
                        }

                        if (typeof title !== 'undefined') {
                            title += payload.account.display_name + ' @' + payload.account.acct;
                            var n = new Notification(title, {
                                body: body,
                                icon: payload.account.avatar_static,
                                data: payload
                            });
                            n.onclick = function(e) {
                                e.srcElement.close();
                            };
                        }
                    }
                    else if(data.event === 'update' && ws.monitor.home === true) {
                        payload = JSON.parse(data.payload);

                        let status = makeStatus(payload, {tl_name: label});
                        term.echo(status, { raw: true });
                    }
                    reduce_status();
                }
                : function(e) {
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
                        let status = makeStatus(payload, {tl_name: label});
                        term.echo(status, { raw: true });
                    }
                    reduce_status();
                };

            let _ws = new WebSocket(url);

            _ws.onmessage = onmessage;

            _ws.onopen = (e) => {
                term.echo(stream + " Streaming start.");
                //console.log(e);
            };

            _ws.onerror = (e, t, a) => {
                term.error(stream + ' Streaming error. closed.');
                //console.log(e);
            };

            _ws.onclose = (e, t, a) => {
                term.echo(stream + " Streaming closed.");
                //console.log(e);
            };

            _stream.ws = _ws;
            ws.stream.push(_stream);

        }
        if (analyzer.optional.on_monitor === true) {
            let _ins = ins.get();
            let monitor = [];
            let hashtag;
            let startup = ws.startup;
            if (typeof analyzer.line_parsed[2] === 'undefined') {
                let conf_mon = config.find('instances.terminal.monitor');
                if (typeof conf_mon === 'string') {
                    conf_mon = conf_mon
                        ? conf_mon.match(/(home|local|public|notification)/g)
                        : undefined;
                }
                if (typeof conf_mon === 'undefined') {
                    conf_mon = [];
                }
                for (let i = 0; i < conf_mon.length; i++) {
                    ws.monitor[conf_mon[i]] = true;
                }

                for (let m in ws.monitor) {
                    if (ws.monitor[m]) {
                        monitor.push({ type: m });
                    }
                }

                if (!url_params.terminal && conf_mon.length > 0) {
                    startup = conf_mon[0];
                }
            }
            else if (analyzer.line_parsed[2].name === 'tag') {
                monitor.push({
                    type: analyzer.line_parsed[2].name,
                    hashtag: analyzer.paramaters.hashtag
                });
                startup = analyzer.line_parsed[2].name;
                hashtag = analyzer.paramaters.hashtag;
            }
            else {
                monitor.push({
                    type: analyzer.line_parsed[2].name
                });
                startup = analyzer.line_parsed[2].name;
            }
            let notifies = config_notify();

            let is_noti = false;
            for (let noti in notifies) {
                is_noti = (is_noti || noti);
            }

            for (let i = 0; i < monitor.length; i++) {
                push_monitor(monitor[i].type, monitor[i].hashtag);
            }
            if (startup) {
                let type = startup;
                let path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
                let limit = config.find(['instances', 'terminal', 'length']);
                limit = (limit > 0) ? limit : 20;
                params = { limit: limit };
                if (type === 'local') {
                    params.local = true;
                }
                else if (type === 'tag') {
                    path += '/' + hashtag;
                }
                else if (type === 'notification') {
                    path = '/api/v1/notifications';
                }
                term.pause();
                callAPI(path, { data: params })
                .then((data, status, jqxhr) => {
                    let notifies = config_notify();
                    for (let i = data.length - 1; i >= 0; i--) {
                        if (analyzer.optional.pinned && !data[i].pinned) {
                            continue;
                        }
                        if (type === 'notification') {
                            term.echo(make_notification(data[i], notifies), {
                                raw: true,
                                flush: false
                            });
                        }
                        else {
                            term.echo(makeStatus(data[i]), {
                                raw: true,
                                flush: false
                            });
                        }
                    }
                    term.resume();
                    term.flush();
                });
            }
        }
        else if(analyzer.optional.no_monitor === true){
            for (let i = 0; i < ws.stream.length; i++) {
                ws.stream[i].ws.close();
                ws.stream[i] = undefined;
            }
            for (let m in ws.monitor) {
                ws.monitor[m] = false;
            }
            ws.stream = [];
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
        let api_user;
        let api_rel;
        let user = ins.get().user;
        if (typeof analyzer.line_parsed[2] === 'undefined' || analyzer.line_parsed[2].name === 'self') {
            api_user = callAPI('/api/v1/accounts/verify_credentials', {
                type: 'GET',
            });
            api_rel = callAPI('/api/v1/accounts/relationships?id[]=' + user.id, {
                type: 'GET'
            });
        }
        else {
            api_user = callAPI('/api/v1/accounts/' + analyzer.paramaters['userid'], {
                type: 'GET',
            });
            api_rel = callAPI('/api/v1/accounts/relationships?id[]=' + analyzer.paramaters['userid'], {
                type: 'GET',
            });
        }

        $.when(api_user, api_rel)
        .then((data_user, data_rel) => {
            let data = data_user[0];
            let jqxhr = data_user[2];
            let relation = data_rel[0];
            let jqxhr_r = data_rel[2];
            let created = new Date(data.created_at);
            let passing = parseInt((Date.now() - created.getTime()) / 60000);
            let minutes = passing % 60;
            let hours   = (passing = (passing - minutes) / 60) % 24;
            let days    = (passing = (passing - hours) / 24) % 7;
            let weeks   = (passing - days) / 7;
            let rel = '<span>Relationship ';
            if (relation[0].id === user.id) {
                rel += 'self.</span>';
            }
            else {
                rel += "others.<br />"
                    + '<a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                        + (relation[0].following ? 'unfollow">' : 'follow">No ') + 'following</a>, '
                        + (relation[0].followed_by ? '' : 'No ') + 'followed, '
                        + (relation[0].requested ? '' : 'No ') + 'requesting, '
                    + '<a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                        + (relation[0].muting ? 'unmute">' : 'mute">No ') + 'muting</a>, '
                    + '<a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                        + (relation[0].blocking ? 'unblock">' : 'block">No ') + 'blocking</a></span>';
            }
            term.echo(data.display_name + ' ID:' + data.id
                + (data.locked ? ' is locked' : ' is unlocked'), {flush: false});
            term.echo('Username is ' + data.username + ', Fullname is ' + data.acct, {flush: false});
            term.echo('Created at ' + created.toString(), {flush: false});
            term.echo('Uptime is '
                    + weeks + ' weeks, ' + days + ' days, ' + hours + ' hours, '
                    + minutes + ' minutes (' + passing + ' days have passed)', {flush: false});
            term.echo('<span>'
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-uid', data.id)
                        .attr('data-type', 'show_statuses')
                        .text(data.statuses_count  + ' statuses posted, ')
                        .prop('outerHTML') + ', '
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-uid', data.id)
                        .attr('data-type', 'show_following')
                        .text(data.following_count + ' accounts are following')
                        .prop('outerHTML') + ', '
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-uid', data.id)
                        .attr('data-type', 'show_followed')
                        .text(data.followers_count + ' accounts are followed')
                        .prop('outerHTML')
                    + '</span>'
            , {raw: true, flush: false});
            term.echo('1 day toot rate ' + parseInt(data.statuses_count / passing) + ' posts/day', {flush: false});
            term.echo(rel, {raw: true, flush: false});
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
                            .attr('name', 'cmd_link')
                            .attr('data-uid', data[i].account.id)
                            .attr('data-type', 'show_statuses_pinned')
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

            //let response = JSON.parse(jqxhr.responseText);
            term.echo('Getting user data failed.(' + jqxhr + ')');
            term.resume();
        });

    };
    InstanceModeElement.prototype.search_query = function (term, analyzer) {
        term.pause();
        if (analyzer.line_parsed[1].name === 'local') {
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

                if (data.statuses.length > 0) {
                    term.echo('[[b;;]Statuses:]', {flush: false});
                    for (let i = 0; i < data.statuses.length; i++) {
                        let s = makeStatus(data.statuses[i]);
                        term.echo(s, {raw: true, flush: false});
                    }
                    term.flush();
                }
                else {
                    let sep;
                    for (sep = '---------------'; sep.length < (max_len); sep += '-') {};
                    sep += '----------------------------';
                    let lines = [
                        '[[bu;;]Accounts:]',
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
                    lines.push('[[bu;;]Hash tags:]');
                    lines.push('-----------------------------------');
                    for (let i = 0; i < data.hashtags.length; i++) {
                        lines.push('#' + data.hashtags[i]);
                    }
                    lines.push('-----------------------------------');
                    lines.push('  該当件数：' + data.hashtags.length + '件');
                    term.echo(lines.join("\n"));
                }
                term.resume();
            }, (jqxhr, status, error) => {
                term.error('Search request is failed.(' + jqxhr.status + ')');
                console.log(jqxhr);
                term.resume();
            });
        }
        else {
            let path;
            let from = 0;
            let statuses = [];
            let limit = parseInt(term.rows() / 5);
            function echo_statuses(size) {
                if (!(size > 0)) {
                    return;
                }
                size = statuses.length < size ? statuses.length : size;
                for (let i = 0; i < size; i++) {
                    let stats = statuses.shift();
                    term.echo(stats, {raw: raw, flush: false});
                }
                term.flush();
            }
            if (analyzer.line_parsed[1].name === 'tootsearch') {
                path = "https://tootsearch.chotto.moe/api/v1/search?sort=created_at%3Adesc&q="
                    + encodeURIComponent(analyzer.paramaters.query);
            }
            else {
                term.error("Invalid search source.");
                term.resume();
                return false;
            }
            term.echo('[[b;;]Searching powered by tootsearch:]', {flush: false});
            term.push(function(command, moreterm){},{
                name: 'more',
                prompt: '--More-- ',
                onStart: function(moreterm){
                    moreterm.pause();
                    $.ajax({
                        url: path + '&from=' + from,
                        dataType: 'json',
                        timeout: 15000
                    }).then((data, status, jqxhr) => {
                        let hits = data.hits.hits;
                        if (hits.length > 0) {
                            for (let i = 0; i < hits.length; i++) {
                                if (hits[i]._type !== 'toot') {
                                    continue;
                                }
                                hits[i]._source.id = 0;
                                statuses.push(makeStatus(hits[i]._source));
                            }
                            echo_statuses(limit);
                            from = hits.length;
                            if (data.hits.total <= hits.length) {
                                moreterm.pop();
                            }
                        }
                        else {
                            moreterm.echo('no hits.');
                            moreterm.pop();
                        }
                        moreterm.resume();
                    }, (jqxhr, status, error) => {
                        moreterm.error('Search request is failed.(' + jqxhr.status + ')');
                        console.log(jqxhr);
                        moreterm.pop();
                        moreterm.resume();
                    });
                },
                keydown: function(event, moreterm){
                    switch(event.keyCode){
                        case 27: // Esc
                        case 81: // q
                            moreterm.pop();
                            moreterm.set_command('');
                        case 16: // Ctrl only
                        case 17: // Alt only
                        case 18: // Shift only
                            break;
                        case 13: // Enter
                        default: // Other
                            moreterm.pause();
                            let echo_size = (event.keyCode === 13) ? 1 : limit;
                            if (!(statuses.length > 0)) {
                                $.ajax({
                                    url: path + '&from=' + from,
                                    dataType: 'json',
                                    timeout: 15000
                                }).then((data, status, jqxhr) => {
                                    let hits = data.hits.hits;
                                    if (hits.length === 0) {
                                        moreterm.pop();
                                        return;
                                    }
                                    statuses = [];
                                    for (let i = 0; i < hits.length; i++) {
                                        hits[i]._source.id = 0;
                                        let s = makeStatus(hits[i]._source);
                                        if (s) {
                                            statuses.push(s);
                                        }
                                    }
                                    echo_statuses(echo_size);
                                    moreterm.resume();
                                    from += hits.length;
                                    if (statuses.length === 0 && from >= data.hits.total) {
                                        moreterm.pop();
                                    }
                                }, (jqxhr, status, error) => {
                                    console.log(jqxhr);
                                    moreterm.error('Getting data is failed.(' + jqxhr.status + ')');
                                });
                            }
                            else {
                                echo_statuses(echo_size);
                                moreterm.resume();
                                if (statuses.length === 0 && from >= data.hits.total) {
                                    moreterm.pop();
                                }
                            }
                            setTimeout(() => { moreterm.set_command(''); }, 10);
                            break;
                    }
                    return true;
                }
            });
        }
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


        let limit = ( analyzer.optional.limit && analyzer.paramaters.post_limits > 0 )
                ? analyzer.paramaters.post_limits
                : config.find(['instances', 'terminal', 'length']);
        limit = (limit > 0) ? limit : 20;

        if (analyzer.line_parsed[1].name === 'timeline') {
            let type = typeof analyzer.line_parsed[2] === 'undefined' ? 'local' : analyzer.line_parsed[2].name;
            path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
            params = {limit: limit};
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

        if (analyzer.optional.max_id) {
            params.max_id = analyzer.paramaters.status_id;
        }

        if (typeof path === 'undefined') {
            term.error('show status error.');
            return;
        }
        callMore(path, (data) => {
            if (analyzer.optional.pinned && !data.pinned) {
                return false;
            }
            else {
                return makeStatus(data);
            }
        }, {params: params, term: term, limit: limit, footer: '[OK]'});
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
            let fav = (status.favourites_count > 0)
                ? $('<a />')
                    .attr('name', 'cmd_link')
                    .attr('data-type', 'show_faved')
                    .attr('data-sid', status.id)
                : $('<span />');
            fav.text(status.favourites_count + ' account favourited,');
            let reb = (status.reblogs_count > 0)
                ? $('<a />')
                    .attr('name', 'cmd_link')
                    .attr('data-type', 'show_rebbed')
                    .attr('data-sid', status.id)
                : $('<span />')
            reb.text(status.reblogs_count + ' account reblogged.');
            let att = $('<a />')
                .attr('name', 'cmd_link')
                .attr('data-type', 'show_att')
                .attr('data-sid', status.id)
                .text('> check the LTL of the time.');
            term.echo(fav.prop('outerHTML') + ' ' + reb.prop('outerHTML'), {raw: true, flush: false});
            term.echo(att.prop('outerHTML'), {raw: true, flush: false});

            term.echo('URL: ' + status.url, {flush: false});
            if (status.account.id === ins.get().user.id) {
                let del = $('<a />')
                    .attr('name', 'cmd_link')
                    .attr('data-type', 'del_status')
                    .attr('data-sid', status.id)
                    .text('> delete this status.');
                term.echo('<br />' + del.prop('outerHTML'), {raw: true, flush: false});
            }
            if (config.find('instances.status.separator')) {
                term.echo(Array($.terminal.active().cols() - 5).join('-'), {flush: false});
            }

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
        let path;
        let userid;
        let type;
        if (analyzer.line_parsed[1].name === 'user') {
            if (analyzer.line_parsed.length === 2 || analyzer.line_parsed[2].name === 'self'){
                userid = ins.get().user.id;
                type = analyzer.line_parsed[3].name;
            }
            else {
                userid = analyzer.paramaters.userid;
                type = analyzer.line_parsed[4].name;
            }
            path = '/api/v1/accounts/' + userid + '/' + type;
        }
        else if (analyzer.line_parsed[1].name === 'statuses') {
            userid = analyzer.paramaters.status_id;
            path = '/api/v1/statuses/' + userid
                + (analyzer.line_parsed[4].name === 'favourited' ? '/favourited_by'
                : analyzer.line_parsed[4].name === 'reblogged' ? '/reblogged_by' : '');
        }
        else {
            term.error('Invalid Command');
            return true;
        }
        callMore(path, (data) => {
            let line = data.display_name;
            if (line.length > 20) {
                line = line.substr(0, 20) + '...';
            }
            line = ('| ' + line + ' @' + data.acct).addTab(data.id, 9);
            return line;
        }, {
            limit: 40,
            header: ("Accounts:\n"
                + ('| account name').addTab('id', 9)
                + "\n" + Array(35).join('-')),
            term: term,
            raw: false,
            next: (data, jqxhr) => {
                let url = jqxhr.getResponseHeader('link');
                let max_id = url.match(/max_id=(\d+)/);
                return (max_id !== null ? parseInt(max_id[1]) : 0);
            }
        });
        return true;
    };
    InstanceModeElement.prototype.show_notifications = function (term, analyzer) {
        term.pause();
        let data = {};
        let notifies = config_notify();
        let path = '/api/v1/notifications';
        let current_sid;
        let limit = 20;
        let statuses = [];
        if (analyzer.paramaters.post_limits) {
            limit = analyzer.paramaters.post_limits;
        }
        data.limit = limit;
        callMore(path, (data) => {
            return make_notification(data, notifies);
        }, {limit: limit, term: term});
        return true;

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
                + (acls[acl_num].type === 'permit' && acls[acl_num].hasOwnProperty('color')
                    ? (', color ' + acls[acl_num].color) : '')
                + (acls[acl_num].type === 'permit' && acls[acl_num].notify
                    ? ', notification' : '')
                + (acls[acl_num].type === 'permit' && acls[acl_num].hasOwnProperty('voice')
                    ? (', voice "' + acls[acl_num].voice + '"') : ''));
        }
        return true;
    };
    InstanceModeElement.prototype.set_acl = function (term, analyzer) {
        function add_acl(acl) {

            if (analyzer.optional.is_color) {
                acl.color = analyzer.line_parsed[5].name;
            }
            else if (analyzer.optional.is_notify) {
                acl.notify = true;
                Notification.requestPermission();
            }
            else if (analyzer.optional.is_voice) {
                acl.voice = analyzer.paramaters.voice_text;
            }
            else {
                acl.color = 'dark-blue';
            }
        }
        let _ins = ins.get();
        if (!_ins.hasOwnProperty('acl')) {
            _ins.acl = {};
        }
        if (analyzer.line_parsed[0].name === 'no') {
            if (analyzer.paramaters.hasOwnProperty('acl_num')) {
                delete(_ins.acl[analyzer.paramaters.acl_num]);
            }
            else {
                delete(_ins.acl);
                _ins.acl = {};
            }
        }
        else if(analyzer.optional.is_add) {
            if (!_ins.acl[analyzer.paramaters.acl_num]) {
                term.error('access-list has no rule.');
                return false;
            }
            else if (_ins.acl[analyzer.paramaters.acl_num].type !== 'permit') {
                term.error('add option apply to permit lists.')
            }
            let _acl = _ins.acl[analyzer.paramaters.acl_num];
            add_acl(_acl);
        }
        else {
            _ins.acl[analyzer.paramaters.acl_num] = {};
            let _acl = _ins.acl[analyzer.paramaters.acl_num];
            _acl.type = analyzer.line_parsed[2].name;
            _acl.regexp = analyzer.paramaters.regular_expression;
            if (_acl.type === "permit") {
                add_acl(_acl);
            }
        }
        ins.parse_acl();
        ins.save();
        return true;
    };
    InstanceModeElement.prototype.show_terminal = function (term, analyzer) {
        term.echo('Monitoring streams');
        term.echo(tab('Home:', ws.monitor.home ? 'ON' : 'OFF', 15));
        term.echo(tab('Notification:', ws.monitor.notification ? 'ON' : 'OFF', 15));
        term.echo(tab('Local:', ws.monitor.local ? 'ON' : 'OFF', 15));
        term.echo(tab('Public:', ws.monitor.public ? 'ON' : 'OFF', 15));
        term.echo(tab('Tags:', ws.monitor.tag ? 'ON' : 'OFF', 15));
        term.echo('\n', {raw: true});
        term.echo('WebSocket objects');
        for (let i = 0; i < ws.stream.length; i++) {
            let s = ws.stream[i];
            let msg = 'Line ' + (i + 1).toString() + ', type ' + s.type;

            if (s.type === 'tag') {
                msg += ' "' + s.name + '"'
            }
            term.echo('\n', {raw: true});
            term.echo(msg);
            term.echo('Connecting url, ' + s.ws.url);

            term.echo('Ready Stete, ' + (
                s.ws.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
                s.ws.readyState === WebSocket.OPEN ? 'OPEN' :
                s.ws.readyState === WebSocket.CLOSING ? 'CLOSING' :
                s.ws.readyState === WebSocket.CLOSED ? 'CLOSED' :
                ('UNKNOWN(' + s.ws.readyState + ')')
            ));
            term.echo('Protocol type, ' + s.ws.protocol);

            term.echo('Binary type, ' + s.ws.binaryType);
            term.echo('Extensions, ' + s.ws.extensions);
        }
    };
    InstanceModeElement.prototype.request_relationship = function (term, analyzer) {
        if (analyzer.paramaters.user_id === ins.get().user.id) {
            term.error('Request ID is yourself.');
            return false;
        }
        term.pause();
        let path = '/api/v1/accounts/' + analyzer.paramaters.user_id
            + '/' + analyzer.line_parsed[1].name;
        callAPI(path, {
            type: 'POST',
        }).then((data, status, jqxhr) => {
            console.log(data);
            term.echo("Request was accepted.\n"
                + tab('Following', (data.following ? 'Yes' : 'No'), 14) + "\n"
                + tab('Followed', (data.followed_by ? 'Yes' : 'No'), 14) + "\n"
                + tab('Requested', (data.requested ? 'Yes' : 'No'), 14) + "\n"
                + tab('Mute', (data.muting ? 'Yes' : 'No'), 14) + "\n"
                + tab('Block', (data.blocking ? 'Yes' : 'No'), 14)
            );
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.request_remote_follow = function (term, analyzer) {
        let acct = analyzer.paramaters.acct;
        if (!acct.match(/^((?:@?([a-zA-Z0-9_]+)@((?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.)+[A-Za-z]+))|(?:@([a-zA-Z0-9_]+)))$/)) {
            term.error('Invalid Account ID. (username@domain)');
            return false;
        }
        term.pause();
        let path = '/api/v1/follows?uri=' + acct;
        callAPI(path, {
            type: 'POST',
        }).then((data, status, jqxhr) => {
            console.log(data);
            let relation;
            term.echo("Request was accepted.\nFollowing " + data.acct);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_status_actions = function (term, analyzer) {
        term.pause();
        callMore(path, (data) => {

        })
        callAPI(path, {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            for (let i = 0; i < data.length; i++) {
                callMore()
            }
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.request_delete_status = function (term, analyzer) {
        let sid = analyzer.paramaters.status_id;
        let prompt = 'ID ' + sid + ' status will delete! Continue? Y/[N]: ';
        term.push((input) => {
            term.echo('Canceled.');
            term.pop();
        }, {
            prompt: prompt,
            keypress: (event, term) => {
                term.echo(term.get_prompt() + event.key);
                if (event.keyCode === 89 || event.keyCode === 121) {
                    term.pause();
                    term.echo('[OK]');
                    callAPI('/api/v1/statuses/' + sid, {
                        type: 'DELETE',
                    }).then((data, status, jqxhr) => {
                        term.echo('Erase of status: complete');
                        term.resume();
                    }, (jqxhr, status, error) => {
                        term.error('Deleteing status is failed(' + jqxhr.status + ')');
                        console.log(jqxhr);
                        term.resume();
                    });
                }
                else {
                    term.echo('Canceled.');
                }
                term.pop();
            },
            onExit: (term) => {
                setTimeout(() => { term.set_command(''); }, 10);
            }
        });
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

function is_monitoring(type) {
    let is_mon = false;
    if (typeof type !== 'undefined') {
        is_mon = (ws.monitor[type] === true);
    }
    else {
        for (let s in ws.stream) {
            is_mon = (is_mon || ws.stream[s].ws.readyState === WebSocket.OPEN);
        }
    }
    return is_mon;
}

function talk(msg) {
    var s = new SpeechSynthesisUtterance(msg);
    s.rate = 1.3;
    s.lang = 'ja-JP';
    speechSynthesis.speak(s);
}
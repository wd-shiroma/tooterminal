let InstanceModeElement = (function () {
    function InstanceModeElement() {
        this._cmd_mode = "global";
        this._user_max = 9999999;
        this._list_max = 99999;
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
                            }, {
                                "type": "command",
                                "name": "max_date",
                                "optional": "max_date",
                                "description": '指定日時以前のトゥートを表示(SnowFlake準拠)',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "datetime",
                                        "description": '日付時刻',
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
            }, {
                "type": "command",
                "name": "max_date",
                "optional": "max_date",
                "description": '指定日時以前のトゥートを表示(SnowFlake準拠)',
                "children": [
                    {
                        "type": "paramater",
                        "name": "datetime",
                        "description": '日付時刻',
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
        this._request_api = [
            {
                "type": "paramater",
                "name": "path",
                "description": "APIのパスを指定します。",
                "execute": this.request_api,
                "children": [
                    {
                        "type": "command",
                        "name": "json",
                        "optional": "json",
                        "description": 'JSON形式のデータを指定します。',
                        "children": [
                            {
                                "type": "command",
                                "name": "json",
                                "description": 'JSON形式のデータを指定します。',
                                "execute": this.request_api
                            }
                        ]
                    }
                ]
            }
        ];
        this._lists = [
            {
                "type": "command",
                "name": "delete",
                "description": "リストを削除します。",
                "execute": this.list_delete
            }, {
                "type": "command",
                "name": "add_account",
                "description": "リストにアカウントを追加します。",
                "children": [
                    {
                        "type": "command",
                        "name": "id",
                        "description": 'ユーザーIDを指定',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "max": this._user_max,
                                "min": 1,
                                "description": 'ユーザーID',
                                "execute": this.list_account
                            }
                        ]
                    }
                ]
            }, {
                "type": "command",
                "name": "remove_account",
                "description": "リストからアカウントを削除します。",
                "children": [
                    {
                        "type": "command",
                        "name": "id",
                        "description": 'ユーザーIDを指定',
                        "children": [
                            {
                                "type": "number",
                                "name": "user_id",
                                "max": this._user_max,
                                "min": 1,
                                "description": 'ユーザーID',
                                "execute": this.list_account
                            }
                        ]
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
                        "name": "emojis",
                        "description": '絵文字を表示します。',
                        //"execute": this.show_emojis,
                        "children": [
                            /*{
                                "type": "command",
                                "name": "twemoji",
                                "description": '標準の絵文字を表示します。',
                                "execute": this.show_emojis,
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "keyword",
                                        "optional": "keyword",
                                        "description": 'ユーザID',
                                        "execute": this.show_emojis,
                                    }
                                ]
                            },　*/{
                                "type": "command",
                                "name": "custom",
                                "description": 'カスタム絵文字を表示します。',
                                "execute": this.show_emojis_custom,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "picker",
                                        "description": '絵文字パレットを表示します。',
                                        "execute": this.show_emojis_custom,
                                        "children": [
                                            {
                                                "type": "paramater",
                                                "name": "keyword",
                                                "description": '検索ワード',
                                                "execute": this.show_emojis_custom
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "summary",
                                        "description": 'カスタム絵文字の一覧を表示します。',
                                        "execute": this.show_emojis_custom,
                                        "children": [
                                            {
                                                "type": "paramater",
                                                "name": "keyword",
                                                "description": '検索ワード',
                                                "execute": this.show_emojis_custom
                                            }
                                        ]
                                    }, {
                                        "type": "command",
                                        "name": "detail",
                                        "description": 'カスタム絵文字の詳細を表示します。',
                                        "children": [
                                            {
                                                "type": "paramater",
                                                "name": "shortcode",
                                                "description": 'ショートコード',
                                                "execute": this.show_emojis_custom_detail
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
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
                                                "children": this._sh_stats_opt.concat([
                                                    {
                                                        "type": "command",
                                                        "name": "pinned",
                                                        "optional": "pinned",
                                                        "description": '固定トゥートを表示します。',
                                                        "execute": this.show_statuses
                                                    }, {
                                                        "type": "command",
                                                        "name": "media",
                                                        "optional": "media",
                                                        "description": 'メディアトゥートを表示します。',
                                                        "execute": this.show_statuses
                                                    }
                                                ])
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
                                        "children": this._sh_stats_opt.concat([
                                            {
                                                "type": "command",
                                                "name": "pinned",
                                                "optional": "pinned",
                                                "description": '固定トゥートを表示します。',
                                                "execute": this.show_statuses
                                            }, {
                                                "type": "command",
                                                "name": "media",
                                                "optional": "media",
                                                "description": 'メディアトゥートを表示します。',
                                                "execute": this.show_statuses
                                            }
                                        ])
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
                            }, {
                                "type": "command",
                                "name": "name",
                                "description": 'ユーザ名・アカウント名から検索表示',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "account",
                                        "description": 'ユーザ名・アカウント名',
                                        "execute": this.show_user,
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
                        "name": "application",
                        "description": 'クライアント情報を表示します。',
                        "execute": this.show_application,
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
                                "children": this._sh_stats_opt.concat([
                                    {
                                        "type": "command",
                                        "name": "mention",
                                        "optional": "exclude_types",
                                        "description": 'リプライのみ表示',
                                        "execute": this.show_notifications
                                    }, {
                                        "type": "command",
                                        "name": "reblog",
                                        "optional": "exclude_types",
                                        "description": 'ブーストのみ表示',
                                        "execute": this.show_notifications
                                    }, {
                                        "type": "command",
                                        "name": "favourite",
                                        "optional": "exclude_types",
                                        "description": 'お気に入りのみ表示',
                                        "execute": this.show_notifications
                                    }, {
                                        "type": "command",
                                        "name": "follow",
                                        "optional": "exclude_types",
                                        "description": 'フォローのみ表示',
                                        "execute": this.show_notifications
                                    }
                                ])
                            }, {
                                "type": "command",
                                "name": "list",
                                "description": 'リスト',
                                "children": [
                                    {
                                        "type": "number",
                                        "name": "list_id",
                                        "max": this._list_max,
                                        "min": 1,
                                        "description": 'リストID',
                                        "execute": this.show_statuses,
                                        "children": this._sh_stats_opt
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "direct",
                                "description": 'ダイレクトメッセージ',
                                "execute": this.show_statuses,
                                "children": this._sh_stats_opt,
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
                    }, {
                        "type": "command",
                        "name": "lists",
                        "description": 'リストの情報を表示します。',
                        "execute": this.show_lists,
                        "children": [
                            {
                                "type": "number",
                                "name": "list_id",
                                "max": this._list_max,
                                "min": 1,
                                "description": 'リストID',
                                "execute": this.show_list_accounts,
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "accounts",
                                        "description": 'リストID',
                                        "execute": this.show_list_accounts,
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
                    }, {
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
                    }
                ]
            }, {
                "type": "command",
                "name": "login",
                "description": 'インスタンスにログインをし、アクセストークンを更新します',
                "execute": this.login,
            }, {
                "type": "command",
                "name": "list",
                "description": 'リストに関する設定を行います。',
                "children": [
                    {
                        "type": "command",
                        "name": "create",
                        "description": 'リストを新規作成します。',
                        "children": [
                            {
                                "type": "paramater",
                                "name": "list_name",
                                "description": 'リスト名',
                                "execute": this.list_create,
                            }
                        ]
                    }, {
                        "type": "command",
                        "name": "id",
                        "description": '作成済みのリストIDを設定します。',
                        "children": [
                            {
                                "type": "number",
                                "name": "list_id",
                                "max": this._list_max,
                                "min": 1,
                                "description": 'リストID',
                                "children": this._lists
                            }
                        ]
                    }
                ]
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
                            }, {
                                "type": "command",
                                "name": "list",
                                "description": 'リストをモニターします。',
                                "children": [
                                    {
                                        "type": "paramater",
                                        "name": "list_id",
                                        "description": 'リストID',
                                        "execute": this.terminal_monitor,
                                    }
                                ]
                            }, {
                                "type": "command",
                                "name": "direct",
                                "description": 'ダイレクトメッセージをモニターします。',
                                "execute": this.terminal_monitor,
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
                                "execute": this.terminal_monitor,/*
                                "children": [
                                ]*/
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
                                "children": [
                                    {
                                        "type": "command",
                                        "name": "notification",
                                        "optional": "notifications",
                                        "description": '通知もミュートします',
                                        "execute": this.request_relationship,
                                    }
                                ]
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
                    }, {
                        "type": "command",
                        "name": "api",
                        "description": '直接APIを発行します(要開発者モード)',
                        "children": [
                            {
                                "type": "command",
                                "name": "get",
                                "description": 'GETメソッドでリクエストします。',
                                "children": this._request_api
                            }, {
                                "type": "command",
                                "name": "post",
                                "description": 'POSTメソッドでリクエストします。',
                                "children": this._request_api
                            }, {
                                "type": "command",
                                "name": "delete",
                                "description": 'DELETEメソッドでリクエストします。',
                                "children": this._request_api
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
                let account = parse_account(data2);
                term.echo(`<span>Hello! ${account.parsed_display_name} @${account.acct_full}</span>`, {raw: true});
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
        if (analyzer.optional.on_monitor === true) {
            let _ins = ins.get();
            let monitor = [];
            let hashtag;
            let list_id;
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
            else if (analyzer.line_parsed[2].name === 'list') {
                monitor.push({
                    type: analyzer.line_parsed[2].name,
                    list_id: analyzer.paramaters.list_id
                });
                startup = analyzer.line_parsed[2].name;
                list_id = analyzer.paramaters.list_id;
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
                push_monitor(monitor[i].type, monitor[i].hashtag, monitor[i].list_id);
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
                else if (type === 'list') {
                    path += '/' + list_id;
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
                            let s = make_notification(data[i], notifies);
                            term.echo(s.html, {
                                raw: true,
                                flush: false
                            });
                        }
                        else {
                            let s = makeStatus(data[i]);
                            term.echo(s.html, {
                                raw: true,
                                flush: false
                            });
                        }
                    }
                    term.resume();
                    term.flush();
                }, (jqxhr, status, error) => {
                    term.error(`List ${list_id} is Not Found: ${status}`);
                    term.resume();
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
        $('#toot_poll').children('.choices').empty()
            .append(poll_choices_template()).append(poll_choices_template());
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
        function echo_user(user_id) {
            let api_user;
            let api_rel;
            let user = ins.get().user;
            api_user = callAPI('/api/v1/accounts/' + user_id, {
                type: 'GET',
            });
            api_rel = callAPI('/api/v1/accounts/relationships?id[]=' + user_id, {
                type: 'GET',
            });
            api_pinned = callAPI('/api/v1/accounts/' + user_id + '/statuses', {
                data: { pinned: true }
            });
            $.when(api_user, api_rel, api_pinned)
            .then((data_user, data_rel, data_pinned) => {
                let data = parse_account(data_user[0]);
                let jqxhr = data_user[2];
                let relation = data_rel[0];
                let jqxhr_r = data_rel[2];
                let pinned = data_pinned[0];
                let jqxhr_p = data_pinned[2];
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
                    rel += (relation[0].following && relation[0].followed_by ? 'friendly'
                            : relation[0].following ? 'following'
                            : relation[0].followed_by ? 'followed' : 'others')
                        + '.<br /><a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                            + (relation[0].following ? 'unfollow">' : 'follow">No ') + 'following</a>, '
                            + (relation[0].followed_by ? '' : 'No ') + 'followed, '
                            + (relation[0].requested ? '' : 'No ') + 'requesting, '
                        + '<a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                            + (relation[0].muting ? 'unmute">' : 'mute">No ') + 'muting</a>, '
                        + '<a name="cmd_link" data-uid="' + data.id + '" data-type="request" data-req="'
                            + (relation[0].blocking ? 'unblock">' : 'block">No ') + 'blocking</a></span>';
                }
                term.echo(`<span>${data.parsed_display_name} ID:${data.id} is ${data.locked ? 'locked' : 'unlocked'}</span>`, {raw: true, flush: false});
                term.echo(`Username is ${data.username}, Fullname is ${data.acct_full}`, {flush: false});
                term.echo(`Created at ${created.toString()}`, {flush: false});
                term.echo(`Uptime is ${weeks} weeks, ${days} days, ${hours} hours, ${minutes} minutes (${passing} days have passed)`, {flush: false});
                term.echo('<span>'
                        + $('<a />')
                            .attr('name', 'cmd_link')
                            .attr('data-uid', data.id)
                            .attr('data-type', 'show_statuses')
                            .text(data.statuses_count  + ' statuses posted')
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
                term.echo(`<span>Note: ${data.parsed_note}</span>`, {raw: true, flush: false});

                if (data.fields && data.fields.length > 0) {
                    term.echo('[[ub;;]Fields]', {flush: false});
                    for (let i in data.fields) {
                        let f = data.fields[i];
                        term.echo(`<span class="fields">${f.name.column_text(20)} ${f.value}</span>`, {raw: true, flush: false});
                    }
                }
                term.echo('URL: ' + data.url, {raw: false, flush: false});

                if (pinned.length > 0 && pinned[0].pinned) {
                    term.echo('<br />', {raw: true, flush: false})
                    term.echo('[[ub;;]Pinned statuses]', {flush: false});
                    for (let i = 0; i < pinned.length; i++) {
                        if (i > 2) {
                            let more = $('<a />')
                                .attr('target', 'out_of_term')
                                .attr('name', 'cmd_link')
                                .attr('data-uid', pinned[i].account.id)
                                .attr('data-type', 'show_statuses_pinned')
                                .text('... and more pinned status');
                            term.echo(more.prop('outerHTML'), {raw: true, flush: false});
                            break;
                        }
                        else {
                            let s = makeStatus(pinned[i]);
                            term.echo(s.html, {raw: true, flush: false});
                        }
                    }
                }
                term.echo('[OK]', {flush: false});
                term.flush();
                term.resume();
            }, (jqxhr, status, error) => {
                console.log(jqxhr);
                let response = JSON.parse(jqxhr.responseText);
                term.echo('Getting user data failed.(' + jqxhr + ')');
                term.resume();
            });/*
            .then((data, status, jqxhr) => {
                term.flush();
                term.resume();
            }, (jqxhr, status, error) => {
                console.log(jqxhr);

                //let response = JSON.parse(jqxhr.responseText);
                term.echo('Getting user data failed.(' + jqxhr + ')');
                term.resume();
            });*/
        }
        term.pause();
        let uid;
        if (typeof analyzer.line_parsed[2] === 'undefined' || analyzer.line_parsed[2].name === 'self') {
            echo_user(ins.get().user.id);
        }
        else if (analyzer.line_parsed[2].name === 'name'){
            let _api = ins.ck_version('3.0.0') < 0 ? '/api/v1/search' : '/api/v2/search';
            callAPI(_api, {
                type: 'GET',
                data: {
                    q: analyzer.paramaters.account,
                    limit: 1
                }
            }).then((data, status, jqxhr) => {
                if (data.accounts.length > 0) {
                    echo_user(data.accounts[0].id);
                }
                else {
                    term.echo('No Accounts.');
                    term.resume();
                }
            });
        }
        else {
            echo_user(analyzer.paramaters.userid);
        }
    };
    InstanceModeElement.prototype.search_query = function (term, analyzer) {
        term.pause();
        if (analyzer.line_parsed[1].name === 'local') {
            let _api = ins.ck_version('3.0.0') < 0 ? '/api/v1/search' : '/api/v2/search';
            callAPI(_api, {
                type: 'GET',
                data: {
                    q: analyzer.paramaters['query'],
                    resolve: true
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
                        term.echo(s.html, {raw: true, flush: false});
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
            if (window.location.origin !== 'https://wd-shiroma.github.io') {
                term.error('Sorry! tootsearch permit only acceess from "https://wd-shiroma.github.io"');
                term.resume();
                return false;
            }
            function echo_statuses(size) {
                if (!(size > 0)) {
                    return;
                }
                size = statuses.length < size ? statuses.length : size;
                for (let i = 0; i < size; i++) {
                    let stats = statuses.shift();
                    term.echo(stats, {raw: true, flush: false});
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
                        let s_uris = [];
                        if (hits.length > 0) {
                            for (let i = 0; i < hits.length; i++) {
                                if (hits[i]._type !== 'toot') {
                                    continue;
                                }
                                hits[i]._source.id = 0;
                                if (s_uris.indexOf(hits[i]._source.uri) < 0) {
                                    let s = makeStatus(hits[i]._source)
                                    statuses.push(s.html);
                                    s_uris.push(hits[i]._source.uri);
                                }
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
                                    let s_uris = [];
                                    let hits = data.hits.hits;
                                    if (hits.length === 0) {
                                        moreterm.pop();
                                        return;
                                    }
                                    statuses = [];
                                    for (let i = 0; i < hits.length; i++) {
                                        hits[i]._source.id = 0;
                                        if (s_uris.indexOf(hits[i]._source.uri) < 0) {
                                            let s = makeStatus(hits[i]._source);
                                            if (s.html.length) {
                                                statuses.push(s.html);
                                                s_uris.push(hits[i]._source.uri);
                                            }
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
            let account = parse_account(data.contact_account);
            term.echo('======== Instance Information ========', {flush: false});
            term.echo('Instance name: ' + data.title, {flush: false});
            term.echo('Version: ' + data.version, {flush: false});
            term.echo('E-mail: ' + data.email, {flush: false});
            term.echo('URI: ' + data.uri, {flush: false});
            if (data.hasOwnProperty('stats')) {
                term.echo('Connection instances: ' + data.stats.domain_count, {flush: false});
                term.echo('Posted toots: ' + data.stats.status_count, {flush: false});
                term.echo('Registed users: ' + data.stats.user_count, {flush: false});
            }
            term.echo('Streaming uri: ' + data.urls.streaming_api, {flush: false});
            term.echo(`Contact: ${account.parsed_display_name} @${account.acct_full}`, {flush: false, raw: true});
            term.echo('Description: ' + data.description, {flush: false});
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
    InstanceModeElement.prototype.show_application = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/apps/verify_credentials', {
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
        let is_public = false;

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
            else if (type === 'list') {
                path += '/' + analyzer.paramaters.list_id;
            }
            is_public = (type === 'public' || type === 'local' || type === 'tag');
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
                if (analyzer.optional.pinned === true) {
                    params.pinned = true;
                }
                if (analyzer.optional.media === true) {
                    params.only_media = true;
                }

                path = '/api/v1/accounts/' + userid + '/statuses'
            }
            else {
                term.error('no login.');
                term.resume();
                return;
            }
            is_public = true;
        }

        if ((analyzer.optional.max_id || analyzer.optional.max_date) && !is_public) {
            term.error('max_id can be specified in only public timeline.');
            term.resume();
            return;
        }

        if (analyzer.optional.max_id) {
            params.max_id = analyzer.paramaters.status_id;
        }
        else if (analyzer.optional.max_date) {
            try {
                let _date = new Date(analyzer.paramaters.datetime);
                params.max_id = _date.snowflake();
            }
            catch {
                term.error('Invalid datetime format.');
                term.resume();
                return;
            }
        }


        if (typeof path === 'undefined') {
            term.error('show status error.');
            term.resume();
            return;
        }
        callMore(path, (data) => {
            if (analyzer.optional.pinned === true && data.pinned !== true) {
                return false;
            }
            else {
                let s = makeStatus(data);
                return s.visibility ? s.html : '';
            }
        }, {params: params, term: term, limit: limit, footer: '[OK]'});
        return;
    };
    InstanceModeElement.prototype.show_status_id = function (term, analyzer) {
        term.pause();
        let sid = analyzer.paramaters.status_id;
        let is_version = ins.ck_version('3.0.0');
        let _opt = {type: 'GET'};

        if (is_version.compared >= 0) {
            _opt = null;
        }
        Promise.all([
            callAPI('/api/v1/statuses/' + sid, { type: 'GET' }),
            callAPI('/api/v1/statuses/' + sid + '/context', { type: 'GET' }),
            is_version.type === 'mastodon' && is_version.compared >= 0 ? callAPI('/api/v1/statuses/' + sid + '/card', _opt) : null
        ])
        //.then((res_status, res_context, res_card) => {
        .then((response_all) => {
            let status = response_all[0] || {};
            let context = response_all[1] || {};
            let card = response_all[2] || status.card || [];

            let s;
            for (let i = 0; i < context.ancestors.length; i++) {
                s = makeStatus(context.ancestors[i]);
                term.echo(s.html, { raw: true, flush: false });
            }
            s = makeStatus(status);
            term.echo(s.html, { raw: true, flush: false });
            if (card.hasOwnProperty('url')) {
                let card_elem = $('<a />')
                        .attr('href', card.url)
                        .attr('target', 'out_of_term')
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
                term.echo(s.html, { raw: true, flush: false });
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
        let params = {};
        let notifies = config_notify();
        let path = '/api/v1/notifications';
        let current_sid;
        let limit = 20;
        let statuses = [];
        if (analyzer.paramaters.post_limits) {
            limit = analyzer.paramaters.post_limits;
        }
        if (analyzer.optional.exclude_types) {
            params.exclude_types = ['follow', 'reblog', 'mention', 'favourite', 'poll'].filter((e, i, r) => {
                return (analyzer.line_parsed[3].name !== e);
            })
        }
        params.limit = limit;
        callMore(path, (data) => {
            let notification = make_notification(data, notifies);
            return notification.html;
        }, {limit: limit, term: term, params: params});
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
        term.echo(tab('Lists:', ws.monitor.list ? 'ON' : 'OFF', 15));
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
        let opts;
        if (analyzer.line_parsed[1].name.slice(-4) === 'mute') {
            opts = {
                notifications: analyzer.optional.hasOwnProperty('notifications')
                    ? analyzer.optional.notifications : false
            };
        }
        term.pause();
        let path = '/api/v1/accounts/' + analyzer.paramaters.user_id
            + '/' + analyzer.line_parsed[1].name;
        callAPI(path, {
            type: 'POST',
            data: opts
        }).then((data, status, jqxhr) => {
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
    InstanceModeElement.prototype.show_emojis_custom = function (term, analyzer) {
        let _ins = ins.get();
        let vers = ins.ck_version('2.0.0');
        let type = (typeof analyzer.line_parsed[3] === 'undefined' ? 'picker' : analyzer.line_parsed[3].name);
        let re = analyzer.paramaters.hasOwnProperty('keyword') ? new RegExp(analyzer.paramaters.keyword) : null;
        if (analyzer.optional.custom === true && (vers.type !== 'mastodon' || vers.compared < 0)) {
            term.error('This instance version has no support for Custom Emojis.(< Mastodon 2.0.0)');
            return false;
        }
        term.pause();
        callAPI('/api/v1/custom_emojis', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            data = data.sort((a, b) => {
                return (a.shortcode > b.shortcode ? 1 : -1);
            })
            let imgs = [];
            let tag;
            for (let i = 0; i < data.length; i++) {
                if (config.find(['emojis', 'visible_in_picker']) !== true && data[i].visible_in_picker === false) {
                    continue;
                }
                else if (re && !data[i].shortcode.match(re)) {
                    continue;
                }
                tag = ':' + data[i].shortcode + ':';

                imgs.push($('<div />')
                    .addClass('emoji_' + type)
                    .attr('data-tag', tag)
                    .append($('<img />')
                        .attr('alt', tag)
                        .attr('title', tag)
                        .attr('src', data[i].url))
                    .append($('<span />')
                        .text(data[i].shortcode))
                    .prop('outerHTML'));
            }
            if (type === 'summary') {
                more(term, imgs, {
                    echo_opt: {raw: true}
                });
            }
            else {
                term.echo('<span>' + imgs.join('') + '</span>', {raw: true});
                term.resume();
            }
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_emojis_custom_detail = function (term, analyzer) {
        let _ins = ins.get();
        let vers = ins.ck_version('2.0.0');
        let shortcode = analyzer.paramaters.shortcode;
        if (analyzer.optional.custom === true && (vers.type !== 'mastodon' || vers.compared < 0)) {
            term.error('This instance version has no support for Custom Emojis.(< Mastodon 2.0.0)');
            return false;
        }
        term.pause();
        callAPI('/api/v1/custom_emojis', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            data = data.sort((a, b) => {
                return (a.shortcode > b.shortcode ? 1 : -1);
            });
            let emoji = data.find((e, i, r) => { return e.shortcode === shortcode; });
            if (typeof emoji === 'undefined') {
                term.error('No emoji\'s shortcode.');
                term.resume();
                return;
            }

            let img = new Image();
            img.onload = (e) => {
                term.echo($(e.path[0]).css('max-height', '4em').prop('outerHTML'), {raw: true, flush: false});
                term.echo('shortcode is ' + emoji.shortcode, {flush: false});
                term.echo('size is width: ' + e.path[0].width + ', height: ' + e.path[0].height, {flush: false});
                term.echo('static image url: ' + emoji.static_url, {flush: false})
                term.echo('image url: ' + emoji.url, {flush: false});
                term.echo('[OK]');
                term.flush();
                term.resume();
            };
            img.onerror = (e) => {
                term.error('Custom emoji couldn\'t get.');
                term.resume();
                console.log(e);
            };
            img.src = emoji.url;
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.request_api = function (term, analyzer) {
        if (config.find(['debug', 'development']) !== true) {
            term.error('you are no development mode...');
            return false;
        }
        term.pause();

        let _api = analyzer.paramaters.path;
        let _method = analyzer.line_parsed[2].name;
        let _data = analyzer.optional.json ? analyzer.paramaters.json : '';

        callAPI(_api, {
            type: _method,
            data: _data
        }).then((data, status, jqxhr) => {
            let json_str = JSON.stringify(data, null, '    ');
            term.echo('request ok! (' + jqxhr.status + ')');
            term.echo(json_str);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_lists = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/lists', {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            if (data.length === 0) {
                term.echo('no lists...');
                term.resume();
                return;
            }
            let _commands;
            let lines = [ 'id    | title', '----------------------------------'];
            for (let i = 0; i < data.length; i++) {
                /*_commands
                    = $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-type', 'show_list_timeline')
                        .attr('data-id', data[i].id)
                        .text('TLN')
                        .prop('outerHTML') + ' '
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-type', 'terminal_monitor_list')
                        .attr('data-id', data[i].id)
                        .text('MON')
                        .prop('outerHTML') + ' '
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-type', 'show_list_accounts')
                        .attr('data-id', data[i].id)
                        .text('ACC')
                        .prop('outerHTML') + ' '
                    + $('<a />')
                        .attr('name', 'cmd_link')
                        .attr('data-type', 'show_list_delete')
                        .attr('data-id', data[i].id)
                        .text('DEL')
                        .prop('outerHTML');*/
                lines.push(('| ' + data[i].title).addTab(data[i].id, 6));
            }
            //more(term, lines, { echo_opt: {raw: true} });
            more(term, lines);
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_list_accounts = function (term, analyzer) {
        term.pause();
        let api = '/api/v1/lists/' + analyzer.paramaters.list_id + '/accounts';
        callMore(api, function(data) {
            return ("| " + data.acct).addTab('| ' + data.display_name, 30).addTab(data.id, 7);
        }, {
            raw: false,
            header: "id     | display_name" + Array(17).join(' ') + "| acct\n" + Array(48).join('-')
        });
    };
    InstanceModeElement.prototype.list_create = function (term, analyzer) {
        term.pause();
        callAPI('/api/v1/lists', {
            type: 'POST',
            data: { title: analyzer.paramaters.list_name }
        }).then((data, status, jqxhr) => {
            term.echo('Created new list \'' + data.title + "'\nList ID is: " + data.id);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.list_delete = function (term, analyzer) {
        term.pause();
        let list_id = analyzer.paramaters.list_id;
        callAPI('/api/v1/lists/' + list_id, {
            type: 'DELETE',
        }).then((data, status, jqxhr) => {
            term.echo('Deleted list ID is: ' + list_id);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.list_account = function (term, analyzer) {
        term.pause();
        let _type = (analyzer.line_parsed[3].name === 'remove_account') ? 'DELETE' : 'POST';
        callAPI('/api/v1/lists/' + analyzer.paramaters.list_id  + '/accounts', {
            type: _type,
            data: { account_ids: [ analyzer.paramaters.user_id ] }
        }).then((data, status, jqxhr) => {
            let _msg = (_type === 'DELETE' ? 'Removed' : 'Appended')
                     + ' account, ID is: ' + analyzer.paramaters.user_id;
            term.echo(_msg);
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting data is failed.(' + jqxhr.status + ')');
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
            poll: noti_src.indexOf('pol') >= 0,
        };
    }
    else if (typeof noti_src === 'object') {
        notifies = {
            delete: (noti_src !== false && noti_src.delete === true),
            favourite: (noti_src !== false && noti_src.favourite !== false),
            reblog: (noti_src !== false && noti_src.reblog !== false),
            mention: (noti_src !== false && noti_src.mention !== false),
            following: (noti_src !== false && noti_src.following !== false),
            poll: (noti_src !== false && noti_src.following !== false)
        };
    }
    else {
        notifies = {
            delete: false,
            favourite: true,
            reblog: true,
            mention: true,
            following: true,
            poll: true
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

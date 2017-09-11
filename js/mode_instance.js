var ws = [];
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
                "description": 'クライアントにログインします。',
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
        var url =
            'https://'         + instances[instance_name].domain
            + '/oauth/authorize?response_type=code'
            + '&client_id='    + instances[instance_name].client_id
            + '&redirect_uri=' + encodeURIComponent(instances[instance_name].application.uris)
            + '&scope='        + (instances[instance_name].application.scopes.read   ? 'read '  : '')
                               + (instances[instance_name].application.scopes.write  ? 'write ' : '')
                               + (instances[instance_name].application.scopes.follow ? 'follow' : '');
        location.href = url;
        return true;
    };
    InstanceModeElement.prototype.terminal_monitor = function (term, analyzer) {
        if (
            (analyzer.optional.on_monitor === true)
            && (ws.length === 0 || ws[0].readyStatus >= WebSocket.CLOSING)
        ) {
            if (typeof analyzer.line_parsed[2] === 'undefined') {
                monitor = getConfig(instances[instance_name], 'monitor', def_conf.instances)
            }
            else if (analyzer.line_parsed[2].name === 'tag') {
                monitor = analyzer.paramaters.hashtag;
            }
            else {
                monitor = analyzer.line_parsed[2].name;
            }
            var api = 'wss://' + instances[instance_name].domain
                                    + '/api/v1/streaming?access_token='
                                    + instances[instance_name].access_token
                                    + '&stream=user';
            if (monitor === 'home') {
                var ws_t = new WebSocket(api);

                ws_t.onmessage = (e) => {
                    var data = JSON.parse(e.data);
                    var payload;

                    var is_del = (data.event === 'delete') &&
                                 (getConfig(config, 'instances.terminal.logging.delete', def_conf) === true);

                    if (is_del) {
                        payload = data.payload;
                        term.error('deleted ID:' + payload);
                        $('[name=id_' + payload + ']').addClass('status_deleted');
                    }
                    else if(data.event === 'notification') {
                        payload = JSON.parse(data.payload);
                        term.echo(make_notification(payload), {raw: true});
                    }
                    else if(data.event === 'update') {
                        payload = JSON.parse(data.payload);
                        var status = makeStatus(payload);
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
                var ws_t = new WebSocket(api);

                ws_t.onmessage = (e) => {
                    var data = JSON.parse(e.data);
                    var payload;

                    if(data.event === 'notification') {
                        payload = JSON.parse(data.payload);
                        term.echo(make_notification(payload), {raw: true});
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

                api = 'wss://'
                        + instances[instance_name].domain
                        + '/api/v1/streaming?access_token='
                        + instances[instance_name].access_token
                        + ((monitor === 'local')  ? '&stream=public:local'
                         : (monitor === 'public') ? '&stream=public'
                         : ('&stream=hashtag&tag=' + monitor));

                ws_t = new WebSocket(api);

                ws_t.onmessage = (e) => {
                    var data = JSON.parse(e.data);
                    var payload;

                    var is_del = (data.event === 'delete') &&
                                 (getConfig(config, 'instances.terminal.logging.delete', def_conf) === true);

                    if (is_del) {
                        payload = data.payload;
                        term.error('deleted ID:' + payload);
                        $('[name=id_' + payload + ']').addClass('status_deleted');
                    }
                    else if(data.event === 'update') {
                        payload = JSON.parse(data.payload);
                        var status = makeStatus(payload);
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
            for (var i = 0; i < ws.length; i++) {
                ws[i].close();
                ws[i] = undefined;
            }
            ws = [];
        }
    };
    InstanceModeElement.prototype.toot = function (term, analyzer) {
        var visibility;
        if (typeof analyzer.line_parsed[1] !== 'undefined') {
            visibility = analyzer.line_parsed[1].name;
        }
        else {
            visibility = getConfig(config, 'instances.visibility', def_conf);
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
        instances[instance_name].monitor = (analyzer.line_parsed[1].name === 'tag')
                    ? analyzer.paramaters.hashtag
                    : analyzer.line_parsed[1].name;
        localStorage.setItem('instances', JSON.stringify(instances));
    };
    InstanceModeElement.prototype.show_user = function (term, analyzer) {
        term.pause();
        var api;
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
            var response = JSON.parse(jqxhr.responseText);
            term.echo('Getting user data failed.(' + jqxhr + ')');
            term.resume();
        })
        .then((data, status, jqxhr) => {
            if (data.length > 0 && data[0].pinned) {
                term.echo('<br />', {raw: true, flush: false})
                term.echo('[[ub;;]Pinned statuses]', {flush: false});
                for (var i = 0; i < data.length; i++) {
                    if (i > 2) {
                        var more = $('<a />')
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
            var response = JSON.parse(jqxhr.responseText);
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
            var max_len = 15;
            for (var i = 0; i < data.accounts.length; i++) {
                if (max_len < data.accounts[i].acct.length) {
                    max_len = data.accounts[i].acct.length;
                }
            }
            max_len += 7;

            var sep;
            for (sep = '---------------'; sep.length < (max_len); sep += '-') {};
            sep += '----------------------------';
            var lines = [
                'Accounts:',
                ('| display name').addTab('| account name', max_len).addTab('id', 9),
                sep
            ];
            for (var i = 0; i < data.accounts.length; i++) {
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
            for (var i = 0; i < data.hashtags.length; i++) {
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

        var limit = (
            typeof analyzer.paramaters.post_limits !== 'undefined'
            && analyzer.paramaters.post_limits > 0
            && analyzer.paramaters.post_limits <= 40
        ) ? analyzer.paramaters.post_limits : 20;


        if (analyzer.line_parsed[1].name === 'timeline') {
            var type = typeof analyzer.line_parsed[2] === 'undefined' ? 'local' : analyzer.line_parsed[2].name;
            var path = '/api/v1/timelines/' + (type === 'local' ? 'public' : type);
            var data = { limit: limit };
            if (type === 'local') {
                data.local = true;
            }
            else if (type === 'tag') {
                path += '/' + analyzer.paramaters.tag_name;
            }
            api = callAPI(path, {
                type: 'GET',
                data: data
            });
        }
        else if (analyzer.line_parsed[1].name === 'user'){
            var userid = (analyzer.line_parsed.length === 2 || analyzer.line_parsed[2].name === 'self')
                       ? instances[instance_name].user.id
                       : analyzer.line_parsed[2].name === 'id' ? analyzer.paramaters.userid
                       : -1;
            if (userid > 0) {
                var params = {
                    limit: limit,
                }
                if (analyzer.optional.hasOwnProperty('pinned')) {
                    params.pinned = true;
                }
                api = callAPI('/api/v1/accounts/' + userid + '/statuses', {
                    type: 'GET',
                    data: params
                });
            }
            else {
                term.error('no login.');
                return;
            }
        }
        else {
            api = callAPI('/api/v1/statuses', {
                type: 'GET',
                data: { limit: limit }
            });
        }
        api.then((data, status, jqxhr) => {
            //var json_str = JSON.stringify(data, null, '    ');
            //term.echo(json_str);
            for (var i = data.length-1; i >= 0; i--) {
                if (analyzer.optional.pinned && !data[i].pinned) {
                    continue;
                }
                var s = makeStatus(data[i]);
                term.echo(s, { raw: true, flush: false });
            }
            term.flush();
            term.resume();
        }, (jqxhr, status, error) => {
            term.error('Getting timeline posts is failed.(' + jqxhr.status + ')');
            console.log(jqxhr);
            term.resume();
        });
    };
    InstanceModeElement.prototype.show_status_id = function (term, analyzer) {
        term.pause();
        var sid = analyzer.paramaters.status_id;
        var cur_status;
        callAPI('/api/v1/statuses/' + sid, {
            type: 'GET',
        }).then((data, status, jqxhr) => {
            cur_status = makeStatus(data)
                       + data.favourites_count + ' account favourited, '
                       + data.reblogs_count + ' account reblogged. <br />';

            return callAPI('/api/v1/statuses/' + sid + '/context', {
                type: 'GET',
            })
        }).then((data, status, jqxhr) => {
            var s;
            for (var i = 0; i < data.ancestors.length; i++) {
                s = makeStatus(data.ancestors[i]);
                term.echo(s, { raw: true, flush: false });
            }
            term.echo(cur_status, { raw: true, flush: false });
            for (var i = 0; i < data.descendants.length; i++) {
                s = makeStatus(data.descendants[i]);
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
        var api;
        var userid;
        var type;
        if (analyzer.line_parsed.length === 2 || analyzer.line_parsed[2].name === 'self'){
            userid = instances[instance_name].user.id;
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
            var max_len = 15;
            for (var i = 0; i < data.length; i++) {
                if (max_len < data[i].acct.length) {
                    max_len = data[i].acct.length;
                }
            }
            max_len += 7;

            var sep;
            for (sep = '---------------'; sep.length < (max_len); sep += '-') {};
            sep += '----------------------------';
            var lines = [
                'Accounts:',
                ('| display name').addTab('| account name', max_len).addTab('id', 9),
                sep
            ];
            for (var i = 0; i < data.length; i++) {
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
        var data = {};
        if (analyzer.paramaters.post_limits) {
            data.limit = analyzer.paramaters.post_limits;
        }
        callAPI('/api/v1/notifications', {
            type: 'GET',
            data: data
        }).then((data, status, jqxhr) => {
            for (var i = data.length-1; i >= 0; i--) {
                term.echo(make_notification(data[i]), {raw: true});
            }
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
            var json_str = JSON.stringify(data, null, '    ');
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

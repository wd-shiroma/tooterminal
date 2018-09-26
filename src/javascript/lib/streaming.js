var ws = {
    stream: [],
    startup: 'local',
    monitor: {
        home: false,
        local: false,
        public: false,
        tag: false,
        notification: false,
        list: false
    },
};

function stream_errmsg(code) {
    return (
        code === 1005 ? 'No Status Recvd' :
        code === 1006 ? 'Abnormal Closure' :
        'Undefined error'
    );
}

function push_monitor(stream, hashtag, list_id) {
    let term = $.terminal.active();
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
    else if (stream === 'list') {
        for (let i = 0; i < ws.stream.length; i++) {
            if (ws.stream[i].type === 'list' && ws.stream[i].list_id === list_id) {
                ws.monitor['list'] = true;
                return true;
            }
        }
        _stream.type = 'list';
        _stream.list_id = list_id;
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
    else if (stream === 'list') {
        url += '&stream=list&list=' + list_id;
    }
    else {
        term.error('Monitor stream type error.');
        return false;
    }

    let label =
        (stream === 'home' || stream === 'notification') ? '<i class="fa fa-home" aria-hidden="true"></i> USER' :
        (stream === 'local') ? '<i class="fa fa-users" aria-hidden="true"></i> LOCAL' :
        (stream === 'public') ? '<i class="fa fa-globe" aria-hidden="true"></i> GLOBAL' :
        (stream === 'tag') ? ('<i class="fa fa-tag" aria-hidden="true"></i> HASHTAG: ' + hashtag) :
        (stream === 'list') ? ('<i class="fa fa-list" aria-hidden="true"></i> LIST: ' + list_id) : '???';

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
                let n = make_notification(payload, notifies)
                term.echo(n.html, {raw: true});

                let is_desktop = config.find(['instances', 'terminal', 'notification']);
                if (typeof is_desktop === 'undefined') {
                    is_desktop = {};
                }

                if(beep_buf && config.find(['instances', 'terminal', 'boop']) === true) {
                    let source = context.createBufferSource();
                    source.buffer = beep_buf;
                    source.connect(context.destination);
                    source.start(0);
                }


                let title;
                let body;
                if (payload.type === 'favourite' && is_desktop.favourite && n.html) {
                    title =　'お気に入り： ';
                    body = payload.status.content;
                }
                else if (payload.type === 'reblog' && is_desktop.reblog && n.html) {
                    title = 'ブースト： ';
                    body = payload.status.content;
                }
                else if (payload.type === 'mention' && is_desktop.mention && n.html) {
                    title = 'リプライ： ';
                    body = payload.status.content;
                }
                else if (payload.type === 'follow' && is_desktop.following && n.html) {
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
                    let n = new Notification(title, {
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
                if (status.visibility) {
                    term.echo(status.html, { raw: true });

                    if (status.notification.voice) {
                        var s = new SpeechSynthesisUtterance(status.notification.voice);
                        s.rate = 1.3;
                        s.lang = 'ja-JP';
                        speechSynthesis.speak(s);
                    }
                    if (status.notification.desktop) {
                        let n = new Notification(status.notification.desktop.title, {
                            body: status.notification.desktop.body,
                            icon: status.notification.desktop.icon,
                            data: status.payload
                        });
                        n.onclick = function(e) {
                            e.srcElement.close();
                        };
                    }
                }
            }
            reduce_output();
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
                if (status.visibility) {
                    term.echo(status.html, { raw: true });

                    if (status.notification.voice) {
                        var s = new SpeechSynthesisUtterance(status.notification.voice);
                        s.rate = 1.3;
                        s.lang = 'ja-JP';
                        speechSynthesis.speak(s);
                    }
                    if (status.notification.desktop) {
                        let n = new Notification(status.notification.desktop.title, {
                            body: status.notification.desktop.body,
                            icon: status.notification.desktop.icon,
                            data: status.payload
                        });
                        n.onclick = function(e) {
                            e.srcElement.close();
                        };
                    }
                }
            }
            reduce_output();
        };

    let onopen = (e) => {
        term.echo(stream + " Streaming start.");
    };

    let onclose = (e, t, a) => {
        term.echo(stream + " Streaming closed.");
        if (e.code === 1006) {
            term.error('Abnormal error. reconnecting...');
            setTimeout(connect_ws, 10000);
        }
    };

    let onerror = (e, t, a) => {
        term.error(stream + ' Streaming error. closed.');
        term_error('streaming error', e);
        if (e.code === 1006) {
            term.error('Abnormal error. reconnecting...');
            setTimeout(connect_ws, 10000);
        }
    };

    let connect_ws = function() {
        let _index = ws.stream.findIndex(e => e.ws.url === url);

        if (_index >= 0) ws.stream.splice(_index, 1);

        let _ws = new WebSocket(url);
        _ws.onmessage = onmessage;
        _ws.onopen = onopen;
        _ws.onerror = onerror;
        _ws.onclose = onclose;

        _stream.ws = _ws;
        ws.stream.push(_stream);
    }

    connect_ws();
}
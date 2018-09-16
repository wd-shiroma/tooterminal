let defconf = {
    application: {
        name: 'Tooterminal',
        website: 'https://blog.drdr.work/',
        uris: 'urn:ietf:wg:oauth:2.0:oob',
        scopes: {
            read:   true,
            write:  true,
            follow: true
        }
    },
    terminal: {
        length: 0
    },
    instances: {
        terminal: {
            logging: {
                favourite: true,
                reblog: true,
                mention: true,
                following: true
            },
            monitor: [
                'local',
                'notification'
            ]
        },
        status: {},
    }
};


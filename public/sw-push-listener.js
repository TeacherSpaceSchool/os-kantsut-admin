let notificationUrl = 'https://os-kantsut.xyz';
//notification registered feature for getting update automatically from server api
self.addEventListener('push', function (event) {
    let _data = event.data ?
        event.data.json()
        :
        {title: 'os-kantsut.xyz', message: 'Не забудьте сделать свой заказ', tag: 'os-kantsut.xyz', url: 'https://os-kantsut.xyz', icon: 'https://os-kantsut.xyz/static/192x192.png'};
    event.waitUntil(
        self.registration.showNotification(_data.title, {
            badge: 'https://os-kantsut.xyz/static/192x192.png',
            body: _data.message,
            icon: _data.icon,
            tag: _data.tag,
            silent: false,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: _data
        })
    );
});

//notification url redirect event click
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    fetch('https://os-kantsut.xyz:3000/push/clicknotification', {
        method: 'post',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `notification=${event.notification.data._id}`
    })

    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function (clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data?event.notification.data.url:notificationUrl);
                }
            })
    );


});
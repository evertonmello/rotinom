console.log("Service Worker Loaded...!!!");

self.addEventListener("push", e => {
  console.log(e)
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.notification.title, data.notification);
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('https://mottumonitorhm.azurewebsites.net/#/home/servicos');
        notification.close();
    }
})
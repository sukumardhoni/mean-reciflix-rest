'use strict';
console.log("IN SW.js");

/*Notification.onclick = function (event) {
  console.log("NOTIFICATION : ", event)
}*/

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  var data = event.data.json();
  console.log(data);
  console.log(event.data.text());
  var d = event.data.text();

  var title = data.title;
  var options = {
    body: data.message,
    icon: data.icon,
    url: data.url,
    data: {
      url: data.url
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  // Close notification.
  console.log("$$$$$$$$$$$ : ", event)
  event.notification.close();

  // Example: Open window after 3 seconds.
  // (doing so is a terrible user experience by the way, because
  //  the user is left wondering what happens for 3 seconds.)

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );

  /*  var promise = new Promise(function (resolve) {
      setTimeout(resolve, 3000);
    }).then(function () {
      // return the promise returned by openWindow, just in case.
      // Opening any origin only works in Chrome 43+.
      return clients.openWindow('http://www.reciflix.com/#!/category');
    });

    // Now wait for the promise to keep the permission alive.
    event.waitUntil(promise);*/
});

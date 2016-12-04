/**
 * Created by Victor on 03/12/2016.
 */

var app = angular.module('taxi_home_driver.services');

app.service('PusherService', function ($rootScope) {
  Pusher.logToConsole = true;

  var pusher = new Pusher(PUSHER_KEY, {
    cluster: 'eu',
    encrypted: true
  });
  //var pusher = new Pusher(PUSHER_KEY);
  var channel = pusher.subscribe('bookings');
  return {
    onMessage: function (callback) {
      channel.bind('async_notification', function (data) {
        callback(data);
        /*$rootScope.$apply(function () {
          callback(data);
        });*/
      });
    }
  };
});

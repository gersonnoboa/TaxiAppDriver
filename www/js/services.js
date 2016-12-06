/**
 * Created by Victor on 06/12/2016.
 */

'use strict';

angular.module('taxi_home_driver.services', ['ngResource'])

  .service('UsersService', function ($resource) {

    return $resource(ROOT_URI+'/users', {}, {
      login: {method:'POST', url: ROOT_URI+'/users/login'},
      logout: {method:'POST', url: ROOT_URI+'/users/logout'},
      setStatus: {method: 'POST', url: ROOT_URI+'/users/status'},
      update: {method: 'PUT', url: ROOT_URI+'/users/'}
    });
  })

  .service('PusherService', function ($rootScope) {
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
        });
      }
    };
  })

  .service('InvoicesService', function () {
    var invoicesList = [
      {title: "Invoice for September 2016", date: "2016-10-01", id: 1},
      {title: "Invoice for October 2016", date: "2016-11-01", id: 2},
      {title: "Invoice for November 2016", date: "2016-12-01", id: 3}
    ];
    this.getInvoices = function () {
      return invoicesList;
    };

    this.getInvoice = function (id) {
      for (var i in invoicesList) {
        if (invoicesList[i].id == id) {
          return invoicesList[i];
        }
      }
    };
  })

  .service('BookingService', function ($http) {
    return {
      acceptBooking: function(data) {
        return $http.post(ROOT_URI+'/bookings/accept', data);
      },

      rejectBooking: function(data) {
        return $http.post(ROOT_URI+'/bookings/reject', data);
      }
    };
  });

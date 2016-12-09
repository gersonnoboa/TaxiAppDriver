/**
 * Created by Victor on 06/12/2016.
 */

'use strict';

angular.module('taxi_home_driver.services', ['ngResource','ngCookies'])

  .service('Auth', function ($cookieStore) {
    var _user = {};

    return {
      user : _user,
      token : "",
      setUser : function(aUser){
        this.user = aUser;
        this.token = aUser.attributes.token;
        //$cookieStore.put('current.user', user);
      },
      remove: function () {
        this.user = {};
        this.token = "";
        //$cookieStore.remove('current.user');
      },
      fetch: function () {
        return this.user;
        //$cookieStore.get('current.user');
      },
      isLoggedIn : function() {
        if (!this.user.id) {
          this.fetch();
        }
        return (!!this.user.id);
      }
    }
  })

  .service('UsersService', function ($resource) {

    return $resource(ROOT_URI+'/users', {}, {
      login: {method:'POST', url: ROOT_URI+'/users/login'},
      logout: {method:'POST', url: ROOT_URI+'/users/logout'},
      setStatus: {method: 'POST', url: ROOT_URI+'/users/status'},
      update: {method: 'PUT', url: ROOT_URI+'/users/'}
    });
  })

  .service('PusherService', function (Auth) {
    Pusher.logToConsole = true;

    var pusher = new Pusher(PUSHER_KEY, {
      cluster: 'eu',
      encrypted: true
    });
    //var pusher = new Pusher(PUSHER_KEY);
    var channel = pusher.subscribe('ride');
    return {
      onMessage: function (callback) {
        channel.bind('driver_'+Auth.user.id, function (data) {
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
      accept: function(data) {
        return $http.post(ROOT_URI+'/bookings/accept', data);
      },

      reject: function(data) {
        return $http.post(ROOT_URI+'/bookings/reject', data);
      },

      startRide: function(data) {
        return $http.post(ROOT_URI+'/bookings/start_ride', data);
      },

      endRide: function(data) {
        return $http.post(ROOT_URI+'/bookings/end_ride', data);
      }
    };
  });

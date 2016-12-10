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
        this.token = this.user.attributes.token;
        $cookieStore.put('current.user', this.user);
      },
      remove: function () {
        this.user = {};
        this.token = "";
        $cookieStore.remove('current.user');
      },
      fetch: function () {
        //return this.user;
        try {
          this.user = $cookieStore.get('current.user');
          this.token = this.user.attributes.token;
        } catch (e) {
          this.user = {};
          this.token = "";
        }
      },
      isLoggedIn : function() {
        try {
          if (!this.user.id) {
            this.fetch();
          }
          return (!!this.user.id);
        } catch (e) {
          return false;
        }
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
        var chan = 'driver_'+Auth.user.id;
        //console.log('subscribed_channel: '+chan,Auth.user);
        channel.bind(chan, function (data) {
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
  })
  // Thanks to this gist: https://gist.github.com/rajatrocks/4434301a2db198947a60
  // This is an 'Toast' to abstract notification for both desktop and mobile
  // A toast notification appears for mobile while a popup appears for desktop
  .service('ToastService', function($rootScope, $timeout, $ionicPopup, $ionicLoading/*, $cordovaToast*/) {
    return {
      show: function (message, duration, title, position) {
        message = message || "There was a problem...";
        duration = duration || 'short';
        position = position || 'top';

        if (!!window.cordova) {
          // Use the Cordova Toast plugin
          //$cordovaToast.show(message, duration, position);
          window.plugins.toast.show(message, duration, position);
        }
        else {
          var delay = duration == 'short' ? 2000 : 5000;

          var myPopup = $ionicPopup.alert({
            title: title, template: message
          });

          $timeout(function() {
            myPopup.close();
          }, delay);
        }
      }
    };
  })


;

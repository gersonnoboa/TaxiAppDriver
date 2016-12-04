/**
 * Created by Victor on 03/12/2016.
 */


'use strict';

var app = angular.module('taxi_home_driver.services');
app.service('BookingService', function ($http) {
  return {
    acceptBooking: function(data) {
      return $http.post(ROOT_URI+'/bookings/accept', data);
    },

    rejectBooking: function(data) {
      return $http.post(ROOT_URI+'/bookings/reject', data);
    }
  };
});

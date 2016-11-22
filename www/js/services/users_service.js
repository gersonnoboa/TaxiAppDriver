/**
 * Created by Victor on 22/11/2016.
 */

'use strict';

var app = angular.module('taxi_home_driver');

app.service('UsersService', function ($resource) {
  return $resource('http://localhost:3000/api/users', {});
});

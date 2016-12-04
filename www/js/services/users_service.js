/**
 * Created by Victor on 22/11/2016.
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
});

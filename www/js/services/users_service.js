/**
 * Created by Victor on 22/11/2016.
 */

'use strict';

angular.module('taxi_home_driver.services', ['ngResource'])

.service('UsersService', function ($resource) {

  return $resource(ROOT_URI+'/users', {});
});

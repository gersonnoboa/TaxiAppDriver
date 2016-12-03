/**
 * Created by Victor on 03/12/2016.
 */


'use strict';

describe('Request action test suite', function() {
  var appCtrl, scope, pusherService;

  beforeEach(module('taxi_home_driver'));

  beforeEach(inject(function ($controller, $rootScope, PusherService) {
    scope = $rootScope.$new();
    pusherService = PusherService;
    appCtrl = $controller('AppCtrl', {$scope: scope});
  }));

  it('should have needed data defined', function() {
    expect(scope.new_request_msg).toBeDefined();
    expect(scope.acceptRequest).toBeDefined();
    expect(scope.rejectRequest).toBeDefined();
  });

  it('should show new request data on push', function() {
    var channel = Pusher.instances[0].channel('bookings');
    channel.emit('async_notification', {message: 'You have received a new request', action: 'new_request', data: {id: 2}});
    expect(scope.new_request_msg).toBe('You have received a new request');
    expect(scope.new_request_data).toEqual(jasmine.objectContaining({
      id: 2
    }));
  });

  it('should have no request message on request cancel push', function() {
    var channel = Pusher.instances[0].channel('bookings');
    channel.emit('async_notification', {action: 'cancel_request'});
    expect(scope.new_request_msg).toBe('You have received a new request');
  });
});

/**
 * Created by Victor on 22/11/2016.
 */


'use strict';

describe('Registration Test Suite', function () {


  beforeEach(module('taxi_home_driver'));

  var RegisterCtrl, scope, $httpBackend = {};

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope
    });
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should bind to the field data', function () {
    expect(scope.registerData).toBeDefined();
    expect(scope.doRegister).toBeDefined();

  });

  xit('should submit a request to the backend service', function () {
    $httpBackend
      .expectPOST('http://localhost:3000/api/users')
      .respond(201);
    scope.registerData = {
      first_name: 'Victor', last_name: 'Aluko',
      dob: '2016-06-06', car_color: 'red', car_type: 'mercedes',
      plate_number: 'qqqqqq', email_address: 'victor@local.com',
      password: 'qwerty', password_confirmation: 'qwerty'
    };
    scope.doRegister();
    $httpBackend.flush();
    expect(scope.syncNotification).toEqual('Booking is being processed');
  });
});

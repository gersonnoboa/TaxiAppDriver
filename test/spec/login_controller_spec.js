/**
 * Created by Victor on 29/11/2016.
 */


'use strict';

describe('Login Test Suite', function () {
  var loginCtrl, scope, $httpBackend = {};

  beforeEach(module('taxi_home_driver'));

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    loginCtrl = $controller('loginCtrl', {$scope: scope});
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  xit('should have needed data defined', function() {
      expect(scope.loginData).toBeDefined();
      expect(scope.doLogin).toBeDefined();
  });

  xit('should post to backend service', function () {
    $httpBackend
      .expectPOST('http://localhost:3000/api/users/login')
      .respond(201);
    scope.doLogin();
    $httpBackend.flush();
    expect()
  });

  xit('should fail for incomplete data', function() {
    $httpBackend
      .expectPOST('http://localhost:3000/api/users/login')
      .respond(201, {error_message: 'Invalid username/password'});

    scope.loginData = {email_address: 'victor@local.com', password: ''};
    scope.doLogin();
    expect(scope.loginStatus).toBe('Invalid username or password');
    $httpBackend.flush();
  });

  xit('should successfully login for correct details', function() {
    $httpBackend
      .expectPOST('http://localhost:3000/api/users/login')
      .respond(201, {token: '1234567890'});

    scope.loginData = {email_address: 'victor@local.com', password: '123456'};
    scope.doLogin();
    expect(scope.user_token).toBe('1234567890');
    $httpBackend.flush();
  });
});

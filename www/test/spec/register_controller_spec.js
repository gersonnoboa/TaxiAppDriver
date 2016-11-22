/**
 * Created by Victor on 22/11/2016.
 */


'use strict';

describe('Registration Test Suite', function () {


  beforeEach(module('taksi_driver'));

  var RegisterCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope
    });
  }));

  it('should bind to the field data', function () {
    expect(scope.registerData).toBeDefined();
    expect(scope.doRegister).toBeDefined();

  });

  xit('should define all fields of registration', function () {
    expect(scope.registerData.first_name).toBeDefined();
  });
});

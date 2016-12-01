angular.module('taxi_home_driver.controllers', ['taxi_home_driver.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/new_request.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    //$scope.modal.show();
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.logout = function() {
    $location.path('/login');
  };

})

.controller('RegisterCtrl', function ($scope, $timeout, $location, UsersService) {
  // Simulate registration with this controller

  $scope.registerData = {};
  $scope.status_msg = "";

  $scope.doRegister = function () {

    $timeout(function() {
      $location.path('/login');
    }, 1000);
    // Registration would be done here
    /*UsersService.save($scope.registerData, function (data) {
      // Check the response
      if (data != "error") {
        // successful registration
        $location.path('/login');
        $scope.status_msg = "";
      } else {
        // Error message here
        $scope.status_msg = "Registration failed";
      }
    });*/
  }
})

.controller('LoginCtrl', function ($scope, $timeout, $location) {
  $scope.loginData = {};
  $scope.loginStatus = '';
  $scope.user_token = '';
  $scope.login_msg = "";

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $location.path('/app/dashboard');
    }, 1000);
    /*UsersService.save($scope.loginData, function (data) {
      // Check the response
      if (data != "error") {
        // successful registration
        $location.path('/app/dashboard');
        $scope.login_msg = "";
      } else {
        // Error message here
        $scope.login_msg = "Incorrect username/password";
      }
    });*/
  };

  // Open the login modal
  $scope.showRegister = function() {
    $location.path('/register');
  };
})

.controller('InvoicesCtrl', function($scope, InvoicesService) {
  $scope.invoices = InvoicesService.getInvoices();
})

.controller('InvoiceCtrl', function($scope, $stateParams, InvoicesService) {
  var currentId = $stateParams.id;
  $scope.invoice = InvoicesService.getInvoice(currentId);
});

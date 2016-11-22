angular.module('taksi_driver.controllers', [])

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

.controller('RegisterCtrl', function ($scope, $timeout, $location) {
  // Simulate registration with this controller

  $scope.registerData = {};

  $scope.doRegister = function () {
    console.log('Simulating Register');

    // Registration would be done here
    $timeout(function() {
      $location.path('/login');
    }, 1000);
  }
})

.controller('LoginCtrl', function ($scope, $timeout, $location) {
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $location.path('/app/dashboard');
    }, 1000);
  };

  // Open the login modal
  $scope.showRegister = function() {
    $location.path('/register');
  };
})

.controller('InvoicesCtrl', function($scope, InvoicesService) {
  $scope.invoices = InvoicesService.getInvoices();
  console.log("Invoices: ", $scope.invoices);
})

.controller('InvoiceCtrl', function($scope, $stateParams, InvoicesService) {
  var currentId = $stateParams.id;
  $scope.invoice = InvoicesService.getInvoice(currentId);
});

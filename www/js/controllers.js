angular.module('taxi_home_driver.controllers', ['taxi_home_driver.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, PusherService, BookingService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.new_request_msg = "";
  $scope.new_request_data = {};
  $scope.current_request = {};
  $scope.display_msg = "";

  PusherService.onMessage(function(response) {
    //$scope.asyncNotification = response.message;
    if (!!response.action) {
      if (response.action == 'new_request') {
        $scope.new_request_msg = response.message;
        $scope.new_request_data = response.data;
        $scope.modal.show();
      } else if (response.action == 'cancel_request') {
        $scope.new_request_msg = '';
        $scope.new_request_data = {};
        $scope.modal.hide();
      }
    }

  });

  // Create the modal that we will use later
  $ionicModal.fromTemplateUrl('templates/new_request.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeModal = function() {
    //$scope.modal.show();
    $scope.modal.hide();
  };

  $scope.showNewRequest = function() {
    //$scope.new_request_msg = '';
    var channel = Pusher.instances[0].channel('bookings');
    channel.emit('async_notification', {message: 'Ride From Kabaumaja to Raatuse', action: 'new_request', data: {id: 2}});
    /*setTimeout(function () {
      channel.emit('async_notification', {message: 'Ride From Kabaumaja to Raatuse', action: 'cancel_request', data: {id: 2}});
    }, 20000);*/
  };

  // Open the login modal
  $scope.logout = function() {
    $location.path('/login');
  };

  $scope.acceptRequest = function() {
    //console.log('I will now accept');
    // show loader
    BookingService.acceptBooking({request_id: $scope.new_request_data.id, user_token: USER_TOKEN})
      .success(function(response) {
        //console.log('Accept response', response);
        if (response.status == 'success') {
          $scope.current_request = $scope.new_request_data;
          $scope.current_request.status = response.data.status
          $scope.new_request_data = {};
          $scope.modal.hide();
          $scope.display_msg = "";
        } else {
          // Sad face path
          $scope.display_msg = "Request could not be accepted at this time";
          console.log('Request accept failed');
        }
      })
      .error(function() {
        // error here
        $scope.display_msg = "Request could not be accepted at this time";
        console.log('Request not accepted');
      });
  };

  $scope.rejectRequest = function() {
    console.log('I will now reject');
    BookingService.rejectBooking({request_id: $scope.new_request_data.id, user_token: USER_TOKEN})
      .success(function(response) {
        //console.log('Accept response', response);
        $scope.current_request = {};
        $scope.new_request_data = {};
        $scope.modal.hide();
        $scope.display_msg = "";
        alert("request rejected");
      })
      .error(function() {
        // error here
        $scope.display_msg = "Request could not be rejected at this time";
        console.log('Request not accepted');
      });
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

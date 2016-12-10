angular.module('taxi_home_driver.controllers', ['taxi_home_driver.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, PusherService, BookingService, UsersService, Auth) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.new_request_msg = "";
  $scope.new_request_data = {};
  $scope.current_request = {};
  $scope.display_msg = "";
  $scope.statusData = {status: 'inactive'};
  $scope.status_msg = "";
  $scope.profileData = {};

  $scope.startPusher = function() {
    if (!pusher_started) {
      PusherService.onMessage(function(response) {
        //$scope.asyncNotification = response.message;
        if (!!response.action) {
          if (response.action == 'new_request') {
            $scope.new_request_msg = "You have a new pickup request";
            $scope.new_request_data = response.data;
            $scope.modal.show();
          } else if (response.action == 'cancel_request') {
            $scope.new_request_msg = '';
            $scope.new_request_data = {};
            $scope.modal.hide();
          }
        }
      });
      pusher_started = true;
    }
  };


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
    var channel = Pusher.instances[0].channel('ride');
    channel.emit('driver_6', {action: 'new_request', data: {id: 2, start_location: 'Raatuse 22', destination: 'J.Liivi 2'}});
    /*setTimeout(function () {
      channel.emit('async_notification', {message: 'Ride From Kabaumaja to Raatuse', action: 'cancel_request', data: {id: 2}});
    }, 20000);*/
  };

  // Open the login modal
  $scope.logout = function() {
    //$location.path('/login');
    UsersService.logout({user: {token: Auth.token}}, function (data) {
      // Check the response
      if (!data.error) {
        // successful registration
        Auth.remove();
        $scope.login_msg = "";
        pusher_started = false;
        //$location.path('/login');
        $state.go('login');
      } else {
        // Error message here
        console.log('response data:', data);
        $ionicPopup.alert({
          title: 'Logout Error', template: 'Unable to logout at this time'
        });
      }
    });
  };

  $scope.acceptRequest = function() {
    // show loader
    BookingService.accept({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
      .success(function(response) {
        //console.log('Accept response', response);
        if (response.status == 'success') {
          $scope.current_request = $scope.new_request_data;
          $scope.current_request.status = response.data.status;
          $scope.new_request_data = {};
          $scope.modal.hide();
          $scope.display_msg = "";
          $scope.statusData.status = 'busy';
          // Carry out post actions here
        } else {
          // Sad face path
          $ionicPopup.alert({
            title: 'Booking Update Failed', template: 'Booking could not be accepted at this time'
          });
        }
      })
      .error(function() {
        // error here
        $scope.display_msg = "Request could not be accepted at this time";
        $ionicPopup.alert({
          title: 'Booking Update Successful', template: 'Booking request has been rejected'
        });
      });
  };

  $scope.rejectRequest = function() {
    //console.log('I will now reject');
    BookingService.reject({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
      .success(function(response) {
        //console.log('Accept response', response);
        $scope.current_request = {};
        $scope.new_request_data = {};
        $scope.modal.hide();
        $scope.display_msg = "";
        $ionicPopup.alert({
          title: 'Booking Update Successful', template: 'Booking request has been rejected'
        });
      })
      .error(function() {
        // error here
        $ionicPopup.alert({
          title: 'Booking Update Failed', template: 'Request could not be rejected at this time'
        });
      });
  };

  $scope.changeStatus = function() {
    UsersService.setStatus({token: Auth.token, status: $scope.statusData.status},
      function(response) {
        //console.log('Status change data', response);
        // on success
        if (response.status == 'success') {
          $ionicPopup.alert({
            title: 'Status Update Successful', template: 'status successfully set'
          });
          // Triggers to test workflow of active status
        } else {
          // Sad face path
          $ionicPopup.alert({
            title: 'Status Update Failed', template: 'Setting new status failed'
          });
        }
      }, function() {
        // on error
        $scope.statusData.status = "";
        $ionicPopup.alert({
          title: 'Status Update Failed', template: 'Status could not be set at this time'
        });
    });
    setTimeout(function () {
      $scope.status_msg = "";
    }, 5000);
  };

  $scope.updateProfile = function() {
    UsersService.update({token: Auth.token, user: $scope.profileData},
      function(response) {
        if (response.status == 'success') {
          //$scope.profile_msg = '';
          activeUser = $scope.profileData;
          $ionicPopup.alert({
            title: 'Update Successful', template: 'Profile successfully updated'
          });
        } else {
          $ionicPopup.alert({
            title: 'Update Failed', template: 'Profile update failed. Please review all fields'
          });
        }
      }, function () {
        //console.log('Response data:',data);
        $ionicPopup.alert({
          title: 'Update Failed', template: 'Profile could not be updated at this time. Please try again'
        });
      }
    )
  };

  $scope.startPusher();

})

.controller('RegisterCtrl', function ($scope, $timeout, $location, $ionicPopup, $state, UsersService) {
  // Simulate registration with this controller

  $scope.registerData = {};
  $scope.status_msg = "";

  // Open the login modal
  $scope.showLogin = function() {
    //$location.path('/register');
    $state.go('login');
  };

  $scope.doRegister = function () {

    /*$timeout(function() {
      $location.path('/login');
    }, 1000);*/
    // Registration would be done here
    UsersService.save($scope.registerData, function (data) {
      // Check the response
      if (!data.error) {
        // successful registration
        //$location.path('/login');
        $state.go('login');
      } else {
        // Error message here
        //console.log('Response data:',data);
        ToastService.show('Registration failed', 'short', 'Registration Error');
      }
    }, function () {
      //console.log('Response data:',data);
      ToastService.show('Error connecting to server to complete registration', 'short', 'Connection Error');
    });
  }
})

.controller('LoginCtrl', function ($scope, $timeout, $location, $state, $ionicPopup, UsersService, Auth, ToastService) {
  $scope.loginData = {};
  $scope.login_msg = "";

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    /*$timeout(function() {
      $location.path('/app/dashboard');
    }, 1000);*/
    UsersService.login({user: $scope.loginData}, function (data) {
      // Check the response
      if (!data.error) {
        console.log('response data:',data);
        // successful login
        Auth.setUser(data.data);
        //$location.path('/app/dashboard');
        $state.go('app.dashboard');
        $scope.login_msg = "";
      } else {
        // Error message here
        //console.log('response data:',data);
        ToastService.show('Incorrect username/password', 'short', 'Login Error');
      }
    }, function (data) {
      console.log('Response data:',data);
      if (data.status > 1) {
        // Server response
        var msg = !!data.data.error ? data.data.error : 'Error while trying to login';
        ToastService.show(msg, 'long', 'Login Error');
      } else {
        // Connection error
        ToastService.show('Error connecting to server to login', 'long', 'Connection Error');
      }

    });
  };

  // Show the login view
  $scope.showRegister = function() {
    //$location.path('/register');
    $state.go('register');
  };
})

.controller('InvoicesCtrl', function($scope, InvoicesService) {
  $scope.invoices = InvoicesService.getInvoices();
})

.controller('InvoiceCtrl', function($scope, $stateParams, InvoicesService) {
  var currentId = $stateParams.id;
  $scope.invoice = InvoicesService.getInvoice(currentId);
});

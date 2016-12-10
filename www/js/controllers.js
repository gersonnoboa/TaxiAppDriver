angular.module('taxi_home_driver.controllers', ['taxi_home_driver.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $location, $ionicPopup, PusherService, BookingService, UsersService, Auth, ToastService) {

  /*$scope.$on('$locationChangeStart', function(event, toUrl, fromUrl) {
    console.log('inside location change: ',toUrl);
  });*/

  $scope.$on('$stateChangeStart', function (event, urlObj) {
    if (NO_AUTH_URIS.indexOf(urlObj.url) < 0 && !Auth.isLoggedIn()) {
      //console.log('DENY access');
      $location.path('/login');
    }
  });

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
    if (!PUSHER_STATED) {
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
      PUSHER_STATED = true;
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
    channel.emit('driver_6', {action: 'new_request', data: {id: 6, start_location: 'Raatuse 22', destination: 'J.Liivi 2'}});
    /*setTimeout(function () {
      channel.emit('async_notification', {message: 'Ride From Kabaumaja to Raatuse', action: 'cancel_request', data: {id: 2}});
    }, 20000);*/
  };

  // Open the login modal
  $scope.logout = function() {
    console.log('Current user',Auth);
    UsersService.logout({user: {token: Auth.token}}, function (data) {
      // Check the response
      if (!data.error) {
        // successful registration
        Auth.remove();
        PUSHER_STATED = false;
        $state.go('login');
      } else {
        // Error message here
        //console.log('response data:', data);
        // I doubt you wont be able to logout at this point
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
          ToastService.show('Booking request has been accepted', 'long', 'Booking Accepted');
          // Carry out post actions here
        } else {
          // Sad face path
          $ionicPopup.alert({
            title: 'Booking Update Failed', template: 'Booking could not be accepted at this time'
          });
        }
      })
      .error(function(err) {
        if (err.status > 1) {
          var msg = !!err.data.error ? err.data.error : 'Request could not be accepted at this time';
          ToastService.show(msg, 'long', 'Booking Update Failed');
        } else {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
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
        ToastService.show('Booking request has been rejected', 'long', 'Booking Rejected');
      })
      .error(function(err) {
        if (err.status > 1) {
          var msg = !!err.data.error ? err.data.error : 'Request could not be rejected at this time';
          ToastService.show(msg, 'long', 'Booking Update Failed');
        } else {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
      });
  };

  $scope.changeStatus = function() {
    UsersService.setStatus({token: Auth.token, status: $scope.statusData.status},
      function(response) {
        //console.log('Status change data', response);
        // on success
        if (response.status == 'success') {
          ToastService.show('New status successfully set', 'long', 'Update Successful');
          // Triggers to test workflow of active status
        } else {
          // Sad face path
          $ionicPopup.alert({
            title: 'Status Update Failed', template: 'Setting new status failed'
          });
        }
      }, function(data) {
        if (data.status > 1) {
          var msg = !!data.data.error ? data.data.error : 'Status could not be set at this time';
          ToastService.show(msg, 'long', 'Status Update Failed');
        } else {
          ToastService.show('Error connecting to server to set status', 'long', 'Connection Error');
        }
    });
  };

  $scope.updateProfile = function() {
    UsersService.update({token: Auth.token, user: $scope.profileData},
      function(response) {
        if (response.status == 'success') {
          //$scope.profile_msg = '';
          activeUser = $scope.profileData;
          ToastService.show('Profile successfully updated', 'long', 'Update Successful');
        } else {
          $ionicPopup.alert({
            title: 'Update Failed', template: 'Profile update failed. Please review all fields'
          });
        }
      }, function (data) {
        //console.log('Response data:',data);
        if (data.status > 1) {
          var msg = !!data.data.error ? data.data.error : 'Profile could not be updated at this time';
          ToastService.show(msg, 'long', 'Profile Update Error');
        } else {
          ToastService.show('Error connecting to server to update profile', 'long', 'Connection Error');
        }
      }
    )
  };

  Auth.fetch();
  $scope.startPusher();

})

.controller('RegisterCtrl', function ($scope, $timeout, $location, $ionicPopup, $state, UsersService, ToastService) {
  // Simulate registration with this controller

  $scope.registerData = {};
  $scope.status_msg = "";

  // Open the login modal
  $scope.showLogin = function() {
    $state.go('login');
  };

  $scope.doRegister = function () {

    // Registration would be done here
    UsersService.save($scope.registerData, function (data) {
      // Check the response
      if (!data.error) {
        // successful registration
        $state.go('login');
      } else {
        // Error message here
        ToastService.show(data.error, 'long', 'Registration Error');
      }
    }, function (data) {
      if (data.status > 1) {
        var msg = !!data.data.error ? data.data.error : 'Registration failed. Kindly review all required fields';
        ToastService.show(msg, 'long', 'Registration Error');
      } else {
        ToastService.show('Error connecting to server to complete registration', 'long', 'Connection Error');
      }
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
    UsersService.login({user: $scope.loginData}, function (data) {
      // Check the response
      if (!data.error) {
        //console.log('response data:',data);
        // successful login
        Auth.setUser(data.data);
        $scope.loginData = {};
        $scope.login_msg = "";

        $state.go('app.dashboard');
      } else {
        // Error message here
        //console.log('response data:',data);
        ToastService.show('Incorrect username/password', 'short', 'Login Error');
      }
    }, function (data) {
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

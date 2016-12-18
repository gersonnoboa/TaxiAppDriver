angular.module('taxi_home_driver.controllers', ['taxi_home_driver.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $location, $ionicPopup, PusherService, BookingService, UsersService, Auth, ToastService, Framework) {

  /*$scope.$on('$locationChangeStart', function(event, toUrl, fromUrl) {
    console.log('inside location change: ',toUrl);
  });*/

  $scope.updateLocation = function () {
    Framework.navigator().then(function (navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;

        UsersService.setLocation({user: {token: Auth.token}, driver: {current_location_lat: lat, current_location_long: long}},
          function (data) {
          // Check the response
          if (!data.error) {
            // Successfully set location
            console.log('Location successfully set:', data);
          } else {
            // Error message here
            console.log('response data:', data);
            // I doubt you wont be able to logout at this point
          }
          if (LOCATION_TIMEOUT > 0) {
            setTimeout(function () {$scope.updateLocation();}, LOCATION_TIMEOUT);
          }
        }, function (err) {
            console.log('unable to set location:',err);
          });
      });
    }, function(err) {
      console.log('position data could not be read: ',err);
    });
  };

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
  $scope.request_history = {};
  $scope.display_msg = "";
  $scope.statusData = {status: 'inactive'};
  $scope.status_msg = "";
  $scope.profileData = {};

  $scope.startPusher = function() {
    if (!PUSHER_STATED) {
      console.log('Pusher starting');
      PusherService.onMessage(function(response) {
        console.log(response);
        return;
        //$scope.asyncNotification = response.message;
        if (!!response.action) {
          if (response.action == 'new_booking') {
            $scope.new_request_msg = "You have a new pickup request";
            $scope.new_request_data = response.booking;
            $scope.new_request_data.ride_status = 'new';
            BookingService.addToList($scope.new_request_data);
            $scope.modal.show();
          } else if (response.action == 'cancel_request') {
            $scope.new_request_msg = '';
            $scope.new_request_data = {};
            $scope.modal.hide();
          }
        }
      });
      console.log('Pusher started');
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
    var channel = Pusher.instances[0].channel('driver_6');
    channel.emit('ride',
      {action: 'new_booking', booking: {id: 6, start_location: 'Raatuse 22', destination: 'J.Liivi 2',
        customer_first_name: 'Victor', customer_last_name: 'Aluko', customer_phone_number: '555555'}
      }

    );
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

    $scope.current_request = $scope.new_request_data;
    $scope.statusData.status = 'busy';
    $scope.current_request.ride_status = 'accepted';
    $scope.new_request_data = {};
    $scope.modal.hide();
    BookingService.addToList($scope.current_request);
    //ToastService.show('Booking request has been accepted', 'long', 'Booking Accepted');
    /*BookingService.accept({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
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
        try {
          var msg = !!err.error ? err.error : err.data.error;
          ToastService.show(msg, 'long', 'Booking Update Failed');
        } catch (e) {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
      });*/
  };

  $scope.rejectRequest = function() {
    //console.log('I will now reject');

    $scope.new_request_data.ride_status = 'rejected';
    BookingService.addToList($scope.new_request_data);
    $scope.new_request_data = {};
    $scope.current_request = {};
    $scope.modal.hide();
    //ToastService.show('Booking request has been rejected', 'long', 'Booking Rejected');
    /*BookingService.reject({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
      .success(function(response) {
        //console.log('Accept response', response);
        $scope.current_request = {};
        $scope.new_request_data = {};
        $scope.modal.hide();
        $scope.display_msg = "";
        ToastService.show('Booking request has been rejected', 'long', 'Booking Rejected');
      })
      .error(function(err) {
        try {
          var msg = !!err.error ? err.error : err.data.error;
          ToastService.show(msg, 'long', 'Booking Update Failed');
        } catch (e) {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
      });*/
  };

  $scope.changeStatus = function() {
    UsersService.setStatus({user: {token: Auth.token}, driver: {status: $scope.statusData.status}},
      function(response) {
        //console.log('Status change data', response);
        // on success
        if (response.status == 'success') {
          ToastService.show('New status successfully set', 'long', 'Update Successful');
          if ($scope.statusData.status == 'active') {
            LOCATION_TIMEOUT = DEFAULT_TIMEOUT;
            $scope.updateLocation();
          } else {
            LOCATION_TIMEOUT = 0;
          }
          // Triggers to test workflow of active status
        } else {
          var msg = !!response.error ? response.error :  'Setting new status failed';
          ToastService.show(msg, 'long', 'Status Update Failed');
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
    UsersService.update($scope.profileData,
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

  $scope.startTrip = function () {

    $scope.current_request.ride_status = 'started';
    ToastService.show('Ride has now started', 'long', 'Start Ride');

    /*BookingService.startRide({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
      .success(function(response) {
        //console.log('Accept response', response);
        $scope.current_request.ride_status = 'started';
        ToastService.show('Ride has now started', 'long', 'Start Ride');
      })
      .error(function(err) {
        try {
          var msg = !!err.error ? err.error : err.data.error;
          ToastService.show(msg, 'long', 'Start Ride Failed');
        } catch (e) {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
      });*/
  };

  $scope.endTrip = function () {

    $scope.current_request.ride_status = 'ended';
    ToastService.show('Trip has now ended. An invoice will be generated for you', 'long', 'End Ride');
    /*BookingService.endRide({booking: {id: $scope.new_request_data.id}, user: {token: Auth.token}})
      .success(function(response) {
        //console.log('Accept response', response);
        $scope.current_request.ride_status = 'started';
        ToastService.show('Ride has now ended', 'long', 'End Ride');
      })
      .error(function(err) {
        try {
          var msg = !!err.error ? err.error : err.data.error;
          ToastService.show(msg, 'long', 'End Ride Failed');
        } catch (e) {
          ToastService.show('Error connecting to server to update booking', 'long', 'Connection Error');
        }
      });*/
  };

  Auth.fetch();
  $scope.profileData = Auth.user;
  $scope.startPusher();
  if (LOCATION_TIMEOUT > 0) {
    setTimeout(function () {$scope.updateLocation();}, LOCATION_TIMEOUT);
  }

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
    $scope.registerData.user_type = 'driver';

    // Registration would be done here
    UsersService.save({user: $scope.registerData}, function (data) {
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
        var msg = !!data.data.error ? data.data.error : 'Error while trying to login: '+JSON.stringify(data);
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
})

.controller('BookingCtrl', function($scope, $stateParams, BookingService) {
  var currentBooking = BookingService.findInList($stateParams.id);
  if (!currentBooking) {
    // Handle error here
  } else {
    $scope.booking = currentBooking;
  }
});

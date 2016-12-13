// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('taxi_home_driver', ['ionic', 'taxi_home_driver.controllers', 'taxi_home_driver.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html'
      }
    }
  })

  .state('app.invoices', {
    url: '/invoices',
    views: {
      'menuContent': {
        templateUrl: 'templates/invoices.html',
        controller: 'InvoicesCtrl'
      }
    }
  })

  .state('app.invoice', {
    url: '/invoice/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/invoice.html',
        controller: 'InvoiceCtrl'
      }
    }
  })
  .state('app.booking', {
    url: '/booking/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/booking.html',
        controller: 'BookingCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html'
        //,controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.status', {
    url: '/status',
    views: {
      'menuContent': {
        templateUrl: 'templates/status.html'
        //,controller: 'StatusCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

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

    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl:'templates/menu.html',
      controller: 'AppCtrl',
      onEnter: function($state, Auth){
          if(!Auth.isLoggedIn()){
             $state.go('login');
          }
      }
    })

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AppCtrl'
    })
  
  .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'AppCtrl'
    })

  .state('app.result', {
    url: '/result/:resultId',
    views: {
      'menuContent': {
        templateUrl: 'templates/result.html',
        controller: 'resultCtrl'
      }
    }
  })

  .state('app.histories', {
    url: '/histories/',
    views: {
      'menuContent': {
        templateUrl: 'templates/histories.html',
        controller: 'historiesCtrl'
      }
    }
    })
  
  .state('app.history', {
    url: '/history/:historyId',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
      }
    }
    })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/start/:kriteriaId',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html',
        controller: 'startCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})
.run(function ($ionicPlatform, $ionicPlatform, $cordovaGeolocation, geoLocation) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $cordovaGeolocation
                .getCurrentPosition()
                .then(function (position) {
                    geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude)
                }, function (err) {
                    geoLocation.setGeolocation(37.38, -122.09)
                });

        });

});

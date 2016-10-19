angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $http, LoginService, RegisterService, $ionicPopup, $state, Auth, geoLocation) {

  $scope.loginData = {}; 

  $scope.profile = Auth.getUser();

  $scope.logout = function() {

    Auth.logout();
    $state.go("login");

  };

  $scope.go = function ( path ) {
    
    $state.go( path );

  };

  /* validation (rekane) */
  $scope.isFormDisabled = function(){

      return this.form.$invalid;

  }

  /* Perform the login action when the user submits the login form */
  $scope.doLogin = function() {

        LoginService.loginUser($scope.loginData.email, $scope.loginData.password,$scope, $http).success(function(data) {

            /* Login Data from server */

            $scope.profile = Auth.getUser();
            $scope.config = Auth.getConfig();

            var alertPopup = $ionicPopup.alert({
                title: 'Login Success!',
                template: 'Thank You '+$scope.profile.user_fullname+' for logging in!'
            });

            $state.go("app.dashboard");

        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials ! error : '+data
            });
        });
     
  };
   /* Perform the login action when the user submits the login form */
  $scope.doRegister = function() {

        RegisterService.registerUser($scope.loginData.username,$scope.loginData.email, $scope.loginData.password, $scope, $http).success(function(data) {

            /* Data from server */

            var alertPopup = $ionicPopup.alert({
                title: 'Register Success!',
                template: 'Thank You '+$scope.loginData.username+' for register! You can now log in'
            });

            $state.go("login");

        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Register failed!',
                template: 'Please check your data ! <br> error : '+data
            });
        });
     
  };

})
 
.controller('dashboardCtrl', function($scope, historyService, Auth) {

  $scope.config = Auth.getConfig();
  console.log($scope.config);

  var itemsPromise =  historyService.getHistories($scope.profile.user_id);

  itemsPromise.then(function(response){

    $scope.items = response;

    console.log($scope.items);

  },function(error){

    console.log(error);

  })

})

.controller('historiesCtrl', function($scope, historyService, Auth) {

  var itemsPromise =  historyService.getHistories($scope.profile.user_id);

  itemsPromise.then(function(response){

    $scope.items = response;

  },function(error){

    console.log(error);

  })

})

.controller('historyCtrl', function($scope, $stateParams, historyService, Auth) {

  var itemsPromise =  historyService.getSingleHistories($stateParams.historyId);

  itemsPromise.then(function(response){

    $scope.items = response;

  },function(error){

    console.log(error);

  })

})

.controller('startCtrl', function($scope, $stateParams, aiService) {

  var itemsPromise =  aiService.getQuest($stateParams.kriteriaId);

  itemsPromise.then(function(response){

    $scope.pertanyaan = response.pertanyaan;
    $scope.jawaban = response.jawaban;

  },function(error){

    console.log(error);

  })

}).controller('resultCtrl', function($scope, $stateParams, aiService, geoLocation) {
  

  var itemsPromise =  aiService.getSolusi($stateParams.resultId,$scope.profile.user_id);

  itemsPromise.then(function(response){

    $scope.solusi = response.solusi;
    $scope.fasilitas = response.fasilitas;
    $scope.photos = response.photos;

    //detail jarak
    var dis = geoLocation.getDistance( geoLocation.getGeolocation().lat+','+geoLocation.getGeolocation().lng,$scope.solusi.rm_address );

    dis.then(function(response){

      $scope.distance = response.data.rows[0].elements[0];
      
      console.log($scope.distance);

    },function(error){

      console.log(error);

    })

    //promise geo
    var loc = geoLocation.getAddressLatLong($scope.solusi.rm_address);

    loc.then(function(response){

      var data = response.data.results[0].geometry.location;

      var latLng = new google.maps.LatLng(data.lat, data.lng);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
     
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
       
        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });      
       
        var infoWindow = new google.maps.InfoWindow({
            content: $scope.solusi.rm_name
        });
       
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
       
      });

    },function(error){

      console.log(error);

    })

  },function(error){

    console.log(error);

  })

});
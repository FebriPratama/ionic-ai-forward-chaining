angular.module('starter.services', ['ngCookies'])

.constant('ApiEndpoint', {

  url: 'http://kripto.febripratama.me/api'

})

.service('LoginService', function($q, ApiEndpoint, Auth) {
    return {
        loginUser: function(email, pw, $scope, $http) {

            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(ApiEndpoint.url + '/login', {email : email, password : pw}).error(function(data, status, headers, config) {
              
                // handle error things
                deferred.reject('Wrong credentials.');

              }).then(function (res){

               if (typeof res.data[0].status != 'undefined') {

                  if(res.data[0].status == '1'){

                    Auth.setUser(res.data[0].data);
                    Auth.setConfig(res.data[0].config);                  

                    deferred.resolve('Welcome ' + name + '!');

                  }else if(res.data[0].status == '0'){

                    deferred.reject('Wrong credentials.');

                  }                  

               } else {

                  deferred.reject('Wrong credentials.');

               }

            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }
    }
})

.service('RegisterService', function($q, ApiEndpoint, Auth) {
    return {
        registerUser: function(name, email, pw, $scope, $http) {

            var deferred = $q.defer();
            var promise = deferred.promise;
            //var link = 'http://localhost:1337/kripto.febripratama.me/api/login';
            
            //deferred.resolve('Welcome ' + name + '!');
            
            $http.post(ApiEndpoint.url + '/user', {name : name, email : email, pswd : pw}).error(function(data, status, headers, config) {
              
                // handle error things
                deferred.reject(data);

              }).then(function (res){
              
                console.log(res);

               if (typeof res.data[0].status != 'undefined') {            

                  deferred.resolve('Welcome ' + name + '! You can now log in');

               } else {

                    data = '';
                    i = 1;
                    angular.forEach(res.data, function(value, key){

                         console.log(key + ': ' + value);

                         data = data + '<br>' + i + '. '+ value;

                         i++;

                    });

                  deferred.reject(data);

               }

            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }
    }
})

.factory('historyService', function($q, $http, ApiEndpoint) {

  return {

      getHistories: function (id) {

        var deffered = $q.defer();

        $http.get(ApiEndpoint.url + '/h/' + id).then(function(response){

          deffered.resolve(response.data.aaData);

        });

        return deffered.promise;

      },
      getSingleHistories: function (id) {

        var deffered = $q.defer();

        $http.get(ApiEndpoint.url + '/h/' + id +'/view').then(function(response){

          deffered.resolve(response.data.aaData);

        });

        return deffered.promise;

      }

  }
})

.factory('aiService', function($q, $http, ApiEndpoint) {

  return {

      getQuest: function (id) {

        var deffered = $q.defer();

        $http.get(ApiEndpoint.url + '/ai/get?id='+id).then(function(response){

          deffered.resolve(response.data);

        });

        return deffered.promise;

      },
      getSolusi: function (id,user) {

        var deffered = $q.defer();

        $http.get(ApiEndpoint.url + '/ai/solusi?id='+id+'&user='+user).then(function(response){

          deffered.resolve(response.data);

        });

        return deffered.promise;

      }
  }
})

.factory('Auth', function ($localStorage) {

   var user = $localStorage.getObject('starter.user');
   var config = $localStorage.getObject('starter.config');

   var setUser = function (user) {
      $localStorage.setObject('starter.user', user);
   }

   var setConfig = function (config) {
      $localStorage.setObject('starter.config', config);
   }

   return {
      setUser: setUser,
      setConfig: setConfig,
      isLoggedIn: function () {
         return $localStorage.getObject('starter.user') ? true : false;
      },
      getUser: function () {
         return $localStorage.getObject('starter.user');
      },
      getConfig: function () {
         return $localStorage.getObject('starter.config');
      },
      logout: function () {
         window.localStorage.removeItem('starter.user');                  
         user = null;
      }
   }
})

.factory('$localStorage', ['$window', function ($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('geoLocation', function ($q, $http, $localStorage) {
    return {
        setGeolocation: function (latitude, longitude) {
            var _position = {
                latitude: latitude,
                longitude: longitude
            }
            $localStorage.setObject('geoLocation', _position)
        },
        getGeolocation: function () {
            return glocation = {
                lat: $localStorage.getObject('geoLocation').latitude,
                lng: $localStorage.getObject('geoLocation').longitude
            }
        },
        getAddressLatLong: function (address) {

            var deffered = $q.defer();

            $http.post('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false&key=AIzaSyDyvEh8lY0DiZNXui2-MlCcf4M65i7NT3M').then(function(response){
              
              deffered.resolve(response);

            });

            return deffered.promise;
        },
        getDistance: function (from,to) {

            var deffered = $q.defer();

            $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+from+'&destinations='+to+'&mode=driving&key=AIzaSyDyvEh8lY0DiZNXui2-MlCcf4M65i7NT3M').then(function(response){
              
              deffered.resolve(response);

            });

            return deffered.promise;
        }
    }
});
(function () {

  'use strict';

  var app = angular.module('inboxApp', [
    'ngRoute',
    'inboxFilters',
    'inboxControllers',
    'inboxServices',
    'pascalprecht.translate'
  ]);

  app.config(['$routeProvider', '$translateProvider',
    function($routeProvider, $translateProvider) {
     
      $routeProvider
        .when('/messages/:doc?', {
          templateUrl: '/partials/messages.html',
          controller: 'MessageCtrl'
        })
        .when('/forms/:doc?', {
          templateUrl: '/partials/messages.html',
          controller: 'FormCtrl'
        })
        .when('/reports', {
          templateUrl: '/partials/reports.html',
          controller: 'ReportCtrl'
        })
        .otherwise({
          redirectTo: '/messages'
        });

      $translateProvider.useLoader('SettingsLoader', {});
      
    }
  ]);

  app.factory('SettingsLoader', ['$q', 'Settings', function ($q, Settings) {
    return function (options) {

      options.key = options.key || 'en';

      var deferred = $q.defer();

      Settings.query(function(res) {
        if (res.settings && res.settings.translations) {
          var data = {};
          res.settings.translations.forEach(function(translation) {
            var key = translation.key;
            var value = translation.default || translation.key;
            translation.translations.forEach(function(val) {
              if (val.locale === options.key) {
                value = val.content;
              }
            });
            data[key] = value;
          });
          deferred.resolve(data);
        } else {
          deferred.reject(options.key);
        }
      });
      
      return deferred.promise;
    };
  }]);
  
}());


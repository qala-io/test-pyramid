(function () {
  'use strict';
  angular.module('app', ['app.pyramid'])
    .config(function ($locationProvider) {
              $locationProvider.html5Mode({enabled: true, requireBase: false})
            });
})();
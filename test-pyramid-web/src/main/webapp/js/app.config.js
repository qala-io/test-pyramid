angular.module('pyramid')
  .value('canvasSize', {height: 300, width: 600})
  .config(function ($locationProvider) {
            $locationProvider.html5Mode({enabled: true, requireBase: false})
          });
"use strict";

var app = angular.module("GymApp", ["ngRoute", "dndLists", "chart.js"])
.constant("FirebaseURL", "https://gymapp-a7071.firebaseio.com/");

let isAuth = (AuthFactory) => new Promise( (resolve, reject) => {
  if (AuthFactory.isAuthenticated()) {
    resolve();
  } else {
    reject();
  }
});

app.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/login.html',
      controller: 'loginCtrl'

    }).
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginCtrl'

    }).
    when('/routines', {
      templateUrl: 'partials/routinesView.html',
      controller: 'routinesCtrl',

    }).
    when('/routines/create', {
      templateUrl: 'partials/routineCreate.html',
      controller: 'routineCreateCtrl',

    }).

    when('/routines/edit', {
      templateUrl: 'partials/routineEdit.html',
      controller: 'routineEditCtrl',

    }).
    when('/routines/deploy', {
      templateUrl: 'partials/routineDeploy.html',
      controller: 'routineDeployCtrl',

    }).
    when('/routines/completed', {
      templateUrl: 'partials/routinesCompleted.html',
      controller: 'routinesCompletedCtrl',

    }).

    otherwise('/');
});

app.run( ($location, FBCreds) => {
  let creds = FBCreds;
  let authConfig = {
    apiKey: creds.key,
    authDomain: creds.authDomain
  };
  firebase.initializeApp(authConfig);
});
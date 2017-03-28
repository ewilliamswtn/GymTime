"use strict";

var app = angular.module("GymApp", ["ngRoute", "dndLists", "chart.js"])
.constant("FirebaseURL", "https://gymapp-a7071.firebaseio.com/");

let isAuth = (authFactory) => new Promise( (resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    console.log("User is NOT authenticated, resolve route promise");
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
      resolve: {isAuth}

    }).
    when('/routines/create', {
      templateUrl: 'partials/routineCreate.html',
      controller: 'routineCreateCtrl',
      resolve: {isAuth}

    }).

    when('/routines/edit', {
      templateUrl: 'partials/routineEdit.html',
      controller: 'routineEditCtrl',
      resolve: {isAuth}

    }).
    when('/routines/deploy', {
      templateUrl: 'partials/routineDeploy.html',
      controller: 'routineDeployCtrl',
      resolve: {isAuth}

    }).
    when('/routines/completed', {
      templateUrl: 'partials/routinesCompleted.html',
      controller: 'routinesCompletedCtrl',
      resolve: {isAuth}

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
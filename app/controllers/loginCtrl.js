"use strict";

app.controller("loginCtrl", function ($scope, $window, authFactory) {
  $scope.account = {
    email: "",
    password: ""
  };

  $scope.register = () => {
    console.log("you clicked register");
    authFactory.createUser({
      email: $scope.account.email,
      password: $scope.account.password
    })
    .then( (userData) => {
      console.log("newUser", userData);
      $scope.login();
    }, (error) => {
      console.log(`Error creating user: ${error}`);
    });
  };

  $scope.login = () => {
    console.log("you clicked login");
    authFactory.loginUser($scope.account)
    .then( (data) => {
      if (data) {
        $window.location.href = "#/routines";
      } else {
        $window.location.href = "#/login";
      }

    }, (error) => {
      console.log("error");
    });
  };



});
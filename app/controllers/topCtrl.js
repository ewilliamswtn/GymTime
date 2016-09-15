"use strict";

app.controller("topCtrl", function  ($scope, $location, $window, authFactory, userFactory) {
  $scope.isLoggedIn = false;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.isLoggedIn = true;
      console.log("Current user logged in?", user.uid);
      userFactory.storeUser(user.uid);
    } else {
      $scope.isLoggedIn = false;
      $window.location.href = "#/login";
    }
    $scope.$apply();
  });

  $scope.logout = function() {
    authFactory.logoutUser()
    .then(function(data) {
      console.log("logged out", data);
    });
  };
});
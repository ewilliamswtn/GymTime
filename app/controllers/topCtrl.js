"use strict";

app.controller("topCtrl", function  ($scope, $location, $window, authFactory, userFactory) {
//topCtrl is the topmost app controller
//all other controllers are siblings of each other; all children of topCtrl
//because of this structuring, topCtrl is used to handoff information between its child controllers






  //a variable to holder a selected routine id -> pass between sibling ctrls
  let selectedRoutine;

  //on change of authorization state, determine if a user is logged in.  if so: carry on.  if not: do not pass go, etc etc
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


  $scope.routinesNav = function () {
    $("li").removeClass("active");
    $(".navLinkRoutine").addClass("active");
    $window.location.href = "#/routines";
  };

  $scope.newRoutinesNav = function () {
    $("li").removeClass("active");
    $(".navLinkNewRoutine").addClass("active");
    $window.location.href = "#/routines/create";
  };

  $scope.logsNav = function () {
    $("li").removeClass("active");
    $(".navLinkLogs").addClass("active");
    $window.location.href = "#/routines/completed";
  };

  $scope.logoutNav = function () {
    $("li").removeClass("active");

    $window.location.href = "#/login";
  };




  //manually log out user
  $scope.logout = function() {
    authFactory.logoutUser()
    .then(function(data) {
      console.log("logged out", data);
    });
  };
});
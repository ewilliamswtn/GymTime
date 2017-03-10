"use strict";

app.controller("routinesCtrl", function ($scope, $window, authFactory, routineFactory) {

  //get all routines from firebase***
  //only use routines allocated to the currently logged in user***
  //assign the user's routines to the $scope.routines array
  //these are then displayed on the DOM via the ng-repeat directive in routinesView.html
  routineFactory.getRoutines().then( function (routinesArray) {
    $scope.routines = routinesArray;
  });


  //simply removes the routine from firebase -> reloads the DOM
  $scope.deleteRoutine = function (routineid) {
    routineFactory.deleteRoutine(routineid).then ( function () {
      routineFactory.getRoutines().then( function (routinesArray) {
        $scope.routines = routinesArray;
      });
    });
  }


  //****** navigates to page ******
  $scope.createNewRoutine = function () {
    $window.location.href = "#/routines/create";
    $(".navA").removeClass("active");
    $(".navLinkNewRoutine").addClass("active");
  };

  $scope.viewCompletedRoutines = function () {
    $window.location.href = "#/routines/completed";
  };
  //****** end [simple nav]'s *******


  //****** sets a selected routine in topCtrl in order to hand off this routine's id to a sibling controller -> ******
    //then navigates to page
  $scope.deployRoutine = function (routineid) {
    $scope.$parent.selectedRoutine = routineid;
    $window.location.href = "#/routines/deploy";
  }

  $scope.editRoutine = function (routineid) {
    $scope.$parent.selectedRoutine = routineid;
    $window.location.href = "#/routines/edit";
  }
  //****** end [handoff -> nav]'s ******

}); //end controller
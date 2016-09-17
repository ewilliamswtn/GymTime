"use strict";

app.controller("routineDeployCtrl", function ($scope, $window, authFactory, userFactory, routineFactory, exerciseFactory) {

  //array of exercise keys array, made by splitting the string of exercise keys located in $scope.routine.exercises
  $scope.exerciseKeyArray = [];

  //array of exercise objects, populated by using $scope.exerciseKeyArray to make firebase calls for each exercise key
  $scope.exerciseObjArray = [];

  //get data for the selected routine via firebase
  routineFactory.getRoutine($scope.$parent.selectedRoutine)  //selected routine is a key, used to get a full object from firebase
  .then( function (data) {
    //$scope.routine will hold the returned 'routine' object
    $scope.routine = data;
    //spilt the routine.exercises string into an array of exercise keys
    $scope.exerciseKeyArray = $scope.routine.exercises.split(",");

    //loop over exercise keys array...
    $.each($scope.exerciseKeyArray, function (index, value) {
      //use the current key to return the exercise object associated with that key
      exerciseFactory.getExercise(value).then (function (data) {
        data.id = $scope.exerciseKeyArray[index];

        //store the exercise objects in yet another array
        $scope.exerciseObjArray.push(data);
      }); //end .then following getExercise(s) call
    }); //end looper over exerciseArray
  }); //end .then following getRoutine call

});
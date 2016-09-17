"use strict";

app.controller("routineDeployCtrl", function ($scope, $window, authFactory, userFactory, routineFactory, exerciseFactory) {
$scope.$watch('ready', function() {
  if($scope.ready == true) {
    //now the data-id attribute works
  }
});
  //array of exercise keys array, made by splitting the string of exercise keys located in $scope.routine.exercises
  $scope.exerciseKeyArray = [];

  //array of exercise objects, populated by using $scope.exerciseKeyArray to make firebase calls for each exercise key
  $scope.exerciseObjArray = [];

  $scope.doneExerciseKeyArray = [];

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

  $scope.allDone = function  () {
    $(".doneCB").prop("checked", true);
  }

  $scope.finish = function () {
    $.each($('input:checked'), function (index, value) {
      $scope.doneExerciseKeyArray.push(value.id);
    });

    $.each($scope.exerciseObjArray, function (index, value) {
      console.log(index, value);
    })

    let d = new Date();
    let day = d.getDate() + 1;
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let date = day + " / " +  month + " / " + year;
    console.log(date);


  }


});
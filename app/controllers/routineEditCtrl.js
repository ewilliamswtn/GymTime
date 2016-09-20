"use strict";

app.controller("routineEditCtrl", function ($scope, $window, authFactory, userFactory, routineFactory, exerciseFactory) {

//array of exercise keys array, made by splitting the string of exercise keys located in $scope.routine.exercises
$scope.exerciseKeyArray = [];

//array of exercise objects, populated by using $scope.exerciseKeyArray to make firebase calls for each exercise key
$scope.exerciseObjArray = [];

//array to hold exercises to be deleted from firebase, and from being associated with the parent routine
$scope.exercisesToDelete = [];

//array to hold exercises to be added to firebase, and to be associated with the parent routine
$scope.exercisesToAdd = [];

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

        //sort array based on index number
        $scope.exerciseObjArray.sort(function (a, b) {
          return a.index - b.index;
        });
      }); //end .then following getExercise(s) call
    }); //end looper over exerciseArray
  }); //end .then following getRoutine call


  //this should only remove the exercise from the scope, NOT
  //immediately delete it from firebase
  //after removing from scope, this should add the exerciseid to an array
  //of exercises to remove from the string list to be appended to the routine
  $scope.deleteExercise = function (exerciseid) {

    //add selected exercise to array of exercises marked for deletion
    $scope.exercisesToDelete.push(exerciseid);

    //***** check redundancy here *****

    //remove selected exercise from key array
    var index = $scope.exerciseKeyArray.indexOf(exerciseid); //works
    if (index > -1) {
      $scope.exerciseKeyArray.splice(index, 1);
    }

    //stringify modified exercise key array
    //set routine.exercises equal to modified exercise key string
    $scope.routine.exercises =  $scope.exerciseKeyArray.toString(); //works

    //empty arrays
    $scope.exerciseKeyArray = [];
    $scope.exerciseObjArray = [];

    //****** end redundancy check ******

    //***** repeated from line 18 to line 31. DRY up? *****
    //split the routine.exercises string into an array of exercise keys
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
      //***** end update page *****
  }; //end $scope.deleteExercise function

  //add exercise
  $scope.addExercise = function () {
    $scope.exercisesToAdd.push({name: "",
    sets: "",
    reps: "",
    weight: ""});
  };

  //save routine function
  $scope.saveRoutine = function () {

    //remove deleted exercises from firebase
    $.each($scope.exercisesToDelete,function (index, value) { //works, exercise successfully deletes
      exerciseFactory.deleteExercise(value);
    });
    //patch edited exercises in firebase
    $.each($scope.exerciseObjArray, function (index, value) { //works, already present items that are edited get patched
      exerciseFactory.editExercise(value, value.id);
    });

    //if there are no exercises to add to the routine -> patch routine -> navigate home
    if ($scope.exercisesToAdd.length === 0) {
      routineFactory.editRoutine($scope.routine, $scope.$parent.selectedRoutine).then( function () { //works, routine name is patched, exercise str = ??
        $window.location.href = "#/routines";
      });
    //if there are exercises to be added -> add them to firebase -> only afer ALL are added -> patch routine -> navigate home
    } else {
      //add new exercises to firebase, add their ids to the id array
      $.each($scope.exercisesToAdd, function (index, value) { //works, exercises successfully add to firebase and return objs/keys
        exerciseFactory.addExercise(value).then( function (data) {
          $scope.exerciseKeyArray.push(data.name);
          $scope.routine.exercises =  $scope.exerciseKeyArray.toString();
          //return?
        }).then( function () {
          console.log($scope.exercisesToAdd.length);
          if (index === ($scope.exercisesToAdd.length - 1)) {
            // save routine to firebase
            routineFactory.editRoutine($scope.routine, $scope.$parent.selectedRoutine).then( function () { //works, routine name is patched, exercise str = ??
              $window.location.href = "#/routines";
            });
          }
        })
      });
    }
  };

  //if a user decides the changes are unwanted, (s)he can simply navigate back to the routines list with no changes being saved
  $scope.cancel = function () {
    $window.location.href = "#/routines";
  };
}); //end app controller

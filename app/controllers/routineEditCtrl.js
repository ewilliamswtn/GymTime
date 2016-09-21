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

  $scope.exercisesToAddDOM = [];

  $scope.exerciseObjArrayOriginal = [];


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
        // append each exercise's id to itself, as property 'id'
        data.id = $scope.exerciseKeyArray[index];

        //store the exercise objects in yet another array
        $scope.exerciseObjArray.push(data);
        $scope.exerciseObjArrayOriginal.push(data);

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
  $scope.deleteExercise = function (exercise) {

    // add to array of exercises to be deleted from fbase
    $scope.exercisesToDelete.push(exercise.id);

    // remove from DOM
    let location = $scope.exerciseObjArray.indexOf(exercise);
    if (location > -1) {
      $scope.exerciseObjArray.splice(location, 1);
    }

    // remove from exercise key array
    let location2 = $scope.exerciseKeyArray.indexOf(exercise.id);
    if (location2 > -1) {
      $scope.exerciseKeyArray.splice(location2, 1);
    }

    // update index for all
    $.each($scope.exerciseObjArray, function (index, value) {
      value.index = index;
    });
  }; //end $scope.deleteExercise function

  //add exercise
  $scope.addExercise = function () {
    $scope.exercisesToAddDOM.push({name: "",
    sets: "",
    reps: "",
    weight: "",
    index: $scope.exerciseObjArray.length});
  };

  $scope.confirmAdd = function () {
    $scope.exerciseObjArray.push($scope.exercisesToAddDOM[0]);
    $scope.exercisesToAdd.push($scope.exercisesToAddDOM[0]);
    $scope.exercisesToAddDOM = [];
  };

  //save routine function
  $scope.saveRoutine = function () {

    // ***** DELETE ******
    $.each($scope.exercisesToDelete,function (index, value) {

      // delete from firebase
      exerciseFactory.deleteExercise(value);
    }); // ***** END DELETE ******

    // ***** EDIT *****
    $.each($scope.exerciseObjArray, function (index, value) {
      let location = $scope.exerciseObjArrayOriginal.indexOf(value);
      if (location > -1) {
        exerciseFactory.editExercise(value, value.id);
      }
    }); // ***** END EDIT *****

    // ***** ADD *****

    if ($scope.exercisesToAdd.length === 0) {
      $scope.routine.exercises =  $scope.exerciseKeyArray.toString();
      routineFactory.editRoutine($scope.routine, $scope.$parent.selectedRoutine).then( function () {
        $window.location.href = "#/routines";
      });
    } else {
      $.each($scope.exerciseObjArray, function (index, value) {
        let location = $scope.exerciseObjArrayOriginal.indexOf(value);
        if (location < 0) {
          exerciseFactory.addExercise(value).then( function (data) {
            $scope.exerciseKeyArray.push(data.name);
            if (index === ($scope.exerciseObjArray.length - 1)) {
              $scope.routine.exercises =  $scope.exerciseKeyArray.toString();
              routineFactory.editRoutine($scope.routine, $scope.$parent.selectedRoutine).then( function () {
                $window.location.href = "#/routines";
              });
            }
          });
        }
      });
    } // ***** END ADD *****
  }; // end save function

  //if a user decides the changes are unwanted, (s)he can simply navigate back to the routines list with no changes being saved
  $scope.cancel = function () {
    $window.location.href = "#/routines";
  };
}); //end app controller

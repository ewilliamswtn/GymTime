"use strict";

app.controller("routineCreateCtrl", function ($scope, userFactory, routineFactory, exerciseFactory, $location) {
  //routine object
  $scope.newRoutine = {
    exercises: "",
    title: "",
    uid: userFactory.getUser()
  };

  //exercise object
  $scope.newExercise = {
    name: "",
    sets: "",
    reps: "",
    weight: ""
  };

  //array to hold all exercises added to the routine
  $scope.exercises = [];

  //array to hold the keys of the exercises added to firebase, to associate them with the routine
  $scope.exerciseKeys = [];

  //this toggles on and off buttons in the DOM. ***in the default state:
  //ON: 'add new exercise' -> appends input boxes to the DOM, allows the user to give values to the new exercise
  //OFF: 'add to routine' -> saves the value from the input boxes to $scope.exercises[num]
  //*note:* activating either button will toggle this value
  $scope.exercisedSaved = true;


  //see line 17
  $scope.addNewExercise = function () {

    //toggles 'add new exercise' button off, toggles 'new exercise inputs' on, toggles 'save exercise' button on
    $scope.exercisedSaved = false;

    //clear these values
    $scope.newExercise = {
      name: "",
      sets: "",
      reps: "",
      weight: ""
    };
  };

  //see line 18
  $scope.saveNewExercise = function () {
    //adds 'newExercise' to the '$scope.exercises' array
    $scope.exercises.push($scope.newExercise);

    //toggles 'add new exercise' button on, toggles 'new exercise inputs' off, toggles 'save exercise' button off
    $scope.exercisedSaved = true;
  };

  //saves the routine to firebase, returns the user to the 'routines view'
  $scope.saveNewRoutine = function () {
    //save exercises
    $.each($scope.exercises, function ( key, value) {
      //loop throught all exercises added, add them to firebase individually
      exerciseFactory.addExercise(value)
      .then (function (data) {
        //add they key of each exercise added to the key array
        $scope.exerciseKeys.push(data.name);

        //only fire on the last iteration through
        if ($scope.exerciseKeys.length  === $scope.exercises.length) {
           //set newRoutine.exercises equal to the complete array of exercises, stringified
           $scope.newRoutine.exercises = $scope.exerciseKeys.toString();

           //save routine
            routineFactory.addRoutine($scope.newRoutine)
            //navigate back to routines page
            .then(function () {
              $location.url("/routines");
            });
        } //end if statement
      }); //end .then
    }); //end save exercises loop
  }; //end saveNewRoutine function
}); //end app controller
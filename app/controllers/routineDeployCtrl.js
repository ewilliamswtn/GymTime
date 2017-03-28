"use strict";

app.controller("routineDeployCtrl", function ($scope, $window, authFactory, userFactory, routineFactory, exerciseFactory, completedFactory) {
  $scope.$watch('ready', function() {
    if($scope.ready == true) {
      //now the data-id attribute works
    }
  });

  //***** these arrays are for getting -> populating the DOM, not for storing *****
  //array of exercise keys array, made by splitting the string of exercise keys located in $scope.routine.exercises
  $scope.exerciseKeyArray = [];

  //array of exercise objects, populated by using $scope.exerciseKeyArray to make firebase calls for each exercise key
  $scope.exerciseObjArray = [];
  //***** end dom population arrays ******


  //this array is used in storing completed exercise objects to firebase
  $scope.doneExerciseObjArray = [];


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
        // console.log(value, index);
      }); //end .then following getExercise(s) call
    }); //end looper over exerciseArray
  }); //end .then following getRoutine call



  //mark all exercise checkboxes as done  ***** WE DONT EVER NEED TO UNMARK ALL BC #GETSWOLE ******
  $scope.allDone = function  () {
    $(".doneCB").prop("checked", true);
  }

  //when the user has decided the routine is fully completed, this will store the data for the exercises that were completed in this routine
  $scope.finish = function () {

    // if user doesn't mark anything done, it is assumed (s)he didnt want to save anything -> navigate back to routines page
    if ($('input:checked').length === 0) {
      $window.location.href = "#/routines";
    } else {

      // iterate through all the exercises marked as done on the DOM
      $.each($('input:checked'), function (index, value) {
        //for the exercises marked as done, this variable will hold the id key for the current iteration
        let currentCheckedID = value.id;

        //iterate through all the exercises in this routine
        $.each($scope.exerciseObjArray, function (index, value) {

          //whenever these ids match, we know we have found an exercise that was completed
          if (currentCheckedID === value.id) {

            //push full completed exercise object to an array
            $scope.doneExerciseObjArray.push(value);
          }
        });
      });

      // ***** get the date *****
      // ** actual date **
      let d = new Date();
      // ** end actual date **

      // ** date faker for dummy data **
      // let d = new Date("2015-10-12T20:24:50.883Z");
      // ** end date faker **
      // ****** end date code block ******

      // append the date to each exercise, then push to firebase
      $.each($scope.doneExerciseObjArray, function (index, value) {

        //full date, hopefully can be used for sorting
        value.date = d;

        //append user id, as these exercises will no longer be (necessarily) tied to a routine
          //instead, we will just a big pile of exercises, sorted first by user
          //then each user can see all the exercises (s)he did, sorted chronologically
        value.uid = userFactory.getUser();

        //push completed exercise obj to firebase
        completedFactory.addExercise(value);

        //navigate back to user home
        $window.location.href = "#/routines";
      });
    }
  }
});


  // ***** old | unused | code i was considering using ******

  // ** was on after date code block **
  // // // *** String Interpolation of useable string data *** // // //
  // let dString = `${d.getUTCDate()} ${d.getUTCMonth()} ${d.getUTCFullYear()}`
  // // // USE THIS // // //

  //date as string, used for viewing by humans
  // value.dateStr = d.toDateString();


"use strict";

app.controller("routinesCompletedCtrl", function ($scope, $window, authFactory, completedFactory) {

  // array to hold unique dates
  $scope.datesArray = [];

  // array to hold unique exercise names
  $scope.uniqueExercisesArray = [];

  // array to hold the exercise objects of the type that the user has selected
  $scope.selectedExArray = [];

  // array to hold the value to graph
  $scope.selectedExWeightArray = [];

  // array to hold dates for labeling x-axis
  $scope.selectedExDatesArray = [];

  // get all user's completed exercises
  completedFactory.getExercises().then( function (exercisesArray) {

    // save data returned from firebase to a variable on the scope
    $scope.exercises = exercisesArray;

    //iterate through each item -> reformat the date obj (that firebase has turned into a worthless string) back into a useable date obj
    $.each($scope.exercises, function (index, value) {

      // use each exercise's date string to set a date object
      let d = new Date(value.date);

      // now overwrite the worthless date string with a functional date obj
        // this propery is used for sorting a specific exercise vs time
      value.date = d;

      // this property is used for grouping exercises done on the same day with one another
      value.dateStr = `${d.getUTCDate()} ${d.getUTCMonth() +1 } ${d.getUTCFullYear()}`;

      // this property is used for human viewing
      value.userDateStr = d.toDateString();
    });


    $.each($scope.exercises, function (index, value) {

      if ($.inArray(value.name, $scope.uniqueExercisesArray) === -1) {
        $scope.uniqueExercisesArray.push(value.name);
      };
    });

    // user has selected a saved exercise
    $scope.displayEx = function () {
      // empty arrarys
      $scope.selectedExArray = [];
      $scope.selectedExWeightArray = [];
      $scope.selectedExDatesArray = [];

      // iterate through all saved exercises
      $.each($scope.exercises, function (index, value) {
        // if the name property of the current exercise obj is the same as the selected exercise ->
        if (value.name === $scope.exSelect) {
          // push the exercise obj to the array of selected exercises
          $scope.selectedExArray.push(value);
        }
      });
      // for now, we will assume the user wanted to see progression in weight.
        // take value of the weight property on each selected exercise, push that value to an array
      $.each($scope.selectedExArray, function (index, value) {
        $scope.selectedExWeightArray.push(value.weight);
        $scope.selectedExDatesArray.push(value.dateStr);
      });

      $scope.labels = $scope.selectedExDatesArray;
      $scope.series = [];
      $scope.data = $scope.selectedExWeightArray;
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.datasetOverride = [{ yAxisID: 'weight' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'weight',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };
    };











    //**** date sorter ****
    // sort array based on date
    // exercisesArray.sort(function (a, b) {
    //   return a.date - b.date;
    // });

    // add dString & Date to object
    // // sort by Date
    // // show dString or OR also sort for non repeating dates

    // leave day, month, year as seperate variables on the objects
    // // and THEN SORT BY THAT
    // // CAUSE IT
    // // 'S EASY


  //   $.each($scope.exercises, function (index, value) {

  //   if ($.inArray(value.dateStr, $scope.datesArray) === -1) {
  //       $scope.datesArray.push(value.dateStr);
  //     };
  //   });
  // });

  // $scope.displayDate = function (arg) {
  //   console.log(arg);
  // }



  });
}); //end controller
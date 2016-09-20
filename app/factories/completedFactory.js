"use strict";

app.factory("completedFactory", ($q, $http, FirebaseURL, userFactory) => {

  let getExercises = () => {
    let exercises = [];
    return $q((resolve, reject) => {
      $http.get(`${FirebaseURL}/completed.json`)
      .success((exercisesObj) => {
        if (exercisesObj) {
          Object.keys(exercisesObj).forEach((key) => {
            exercisesObj[key].id = key;
            exercises.push(exercisesObj[key]);
          });
        }
        // exercises.sort(function (a, b) {
        //   return a.index - b.index;
        // });
        resolve(exercises);
      })
      .error((error) => {
        reject (error);
      });
    });
  };

   //get a specific exercise
  let getExercise = (exerciseId) => {
    return $q((resolve, reject) => {
      $http.get(`${FirebaseURL}/completed/${exerciseId}.json`)
      .success((ObjFromFirebase) => {
        resolve(ObjFromFirebase);
      });
    });
  };

  let addExercise = (newExercise) => {
    return $q( (resolve, reject) => {
      $http.post(`${FirebaseURL}/completed.json`, angular.toJson(newExercise))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

let editExercise = (exerciseObj, exerciseId) => {
    return $q( (resolve, reject) => {
      $http.patch(`${FirebaseURL}/completed/${exerciseId}.json`, angular.toJson(exerciseObj))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

  let deleteExercise = (exerciseId) => {
    return $q((resolve, reject) => {
      $http.delete(`${FirebaseURL}/completed/${exerciseId}.json`)
      .success((ObjFromFirebase) => {
        resolve(ObjFromFirebase);
      });
    });
  };


return {getExercises, getExercise, addExercise, editExercise, deleteExercise};
});

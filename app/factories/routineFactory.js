"use strict";

app.factory("routineFactory", ($q, $http, FirebaseURL, userFactory) => {

  //get all routines
  let getRoutines = () => {
    let routines = [];
    return $q((resolve, reject) => {
      $http.get(`${FirebaseURL}/routines.json`)
      .success((routinesObj) => {
        if (routinesObj) {
          Object.keys(routinesObj).forEach((key) => {
            routinesObj[key].id = key;

            if (userFactory.getUser() == routinesObj[key].uid) {
             routines.push(routinesObj[key]);
            }

          });
        }
        resolve(routines);
      })
      .error((error) => {
        reject (error);
      });
    });
  };

  //get a specific routine
  let getRoutine = (routineId) => {
    return $q((resolve, reject) => {
      $http.get(`${FirebaseURL}/routines/${routineId}.json`)
      .success((ObjFromFirebase) => {
        resolve(ObjFromFirebase);
      });
    });
  };

  //post a routine
  let addRoutine = (newRoutine) => {
    return $q( (resolve, reject) => {
      $http.post(`${FirebaseURL}/routines.json`, angular.toJson(newRoutine))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

  //edit a routine
  let editRoutine = (routineObj, routineId) => {
    return $q( (resolve, reject) => {
      $http.patch(`${FirebaseURL}/routines/${routineId}.json`, angular.toJson(routineObj))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

  //delete a routine
  let deleteRoutine = (routineId) => {
    return $q((resolve, reject) => {
      $http.delete(`${FirebaseURL}/routines/${routineId}.json`)
      .success((ObjFromFirebase) => {
        resolve(ObjFromFirebase);
      });
    });
  };


return {getRoutines, getRoutine, addRoutine, editRoutine, deleteRoutine};
});

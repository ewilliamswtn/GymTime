"use strict";

app.factory("routineFactory", ($q, $http, FirebaseURL, userFactory) => {

  let getRoutines = () => {
    let routines = [];
    return $q((resolve, reject) => {
      $http.get(`${FirebaseURL}/routines.json`)
      .success((routinesObj) => {
        if (routinesObj) {
          Object.keys(routinesObj).forEach((key) => {
            routinesObj[key].id = key;
            routines.push(routinesObj[key]);
          });
        }
        resolve(routines);
      })
      .error((error) => {
        reject (error);
      });
    });
  };

  let addRoutine = (newRoutine) => {
    return $q( (resolve, reject) => {
      $http.post(`${FirebaseURL}/routines.json`, JSON.stringify(newRoutine))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

let editRoutine = (routineObj, routineId) => {
    return $q( (resolve, reject) => {
      $http.patch(`${FirebaseURL}/routines/${routineId}.json`, JSON.stringify(routineObj))
        .success( (ObjFromFirebase) => {
          resolve(ObjFromFirebase);
        })
        .error( (error) => {
          reject(error);
        });
    });
  };

  let deleteRoutine = (routineId) => {
    return $q((resolve, reject) => {
      $http.delete(`${FirebaseURL}/routines/${routineId}.json`)
      .success((ObjFromFirebase) => {
        resolve(ObjFromFirebase);
      });
    });
  };


return {getRoutines, addRoutine, editRoutine, deleteRoutine};
});

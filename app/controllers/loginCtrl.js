"use strict";

app.controller("loginCtrl", function ($scope, $window, authFactory) {

  //object to hold user information, gets input from ng-model in the DOM
  $scope.account = {
    email: "",
    password: ""
  };

  //click register button -> creates a new user -> logs in
  $scope.register = () => {
    authFactory.createUser({
      email: $scope.account.email,
      password: $scope.account.password
    })
    .then( (userData) => {
      console.log("newUser", userData);
      $scope.login();
    }, (error) => {
      console.log(`Error creating user: ${error}`);
    }); //end error handling
  }; //end register function

  //click login button -> checks to see if user data exists. if so -> logs in, naviagates to 'routines page'
  $scope.login = () => {
    console.log("you clicked login");
    authFactory.loginUser($scope.account)
    .then( (data) => {
      if (data) {
        $window.location.href = "#/routines";
      } else {
        $window.location.href = "#/login";
      }

    }, (error) => {
      console.log("error");
    }); //end error handling
  }; //end login function
}); //end controller
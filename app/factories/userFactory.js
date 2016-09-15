"use strict";

app.factory("userFactory", function() {
  let currentUser;


  let storeUser = function (userArg) {
    currentUser = userArg;

  };

  let getUser = function () {
    return currentUser;
  };

  return  {storeUser, getUser};

});
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log("device is ready");

        var login = checkLogin();
        if (login) {
          myNavigator.pushPage('account.html', {animation: "fade"});
        } else {
          setTimeout(function () {
            myNavigator.pushPage('login.html', {animation: "fade"});

          }, 3000)
        }
        console.log("start.html");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize(); 

var module = ons.bootstrap('app', ['onsen']);
module.controller('AppController', function($scope) {
  console.log("Angular ready!!!");
  ons.ready(function() {
    console.log("onsen ready!!!");
  });
  $scope.logIn = function (username, password) {
    console.log("button pressed!");
    validateLogin (username, password);
  }
  $scope.logOut = function () {
    console.log("logout pressed!");
    localStorage.removeItem("logintoken");
    myNavigator.pushPage('login.html', {animation: "fade"});
  } 
  $scope.register = function (username, email, password) {
    console.log("register pressed!");
    registration(username, email, password);
  }
});

function validateLogin(username, password) {
    if (username == "giannis" && password == "giannis") {
        console.log("Login completed");
        modal.show();
        setTimeout(function () {
          modal.hide();
          saveLocalStorage();
          myNavigator.pushPage('account.html', {animation: "fade"});
        }, 2000)
    } else {
        console.log("Login failed!");
        ons.notification.alert({
          message: 'Check your username or password.',
          // or messageHTML: '<div>Message in HTML</div>',
          title: 'Login Failed',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        });
    } 
}

function saveLocalStorage() {
  console.log("typeofStorage " + typeof(Storage));
  if(typeof(Storage) !== "undefined") {
      localStorage.setItem("logintoken", true);
  } else {

  }
}

function registration(username, email, password) {
    var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (username && email && password) {
      if (email_validation.test(email)){
        console.log("register ok");
        document.getElementById("email").style.display = "none";
        ons.notification.alert({
          message: 'Registration completed!',
          title: 'message',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        });
      } else {
        document.getElementById("email").style.display = "inline";
      }
    } else {
      if (email_validation.test(email)){
        document.getElementById("email").style.display = "none";
      } else {
        document.getElementById("email").style.display = "inline";
      }
      ons.notification.alert({
          message: 'Check your username, email or password.',
          title: 'Registration Failed',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        });
    }
}

function checkLogin() {
  if(localStorage.getItem("logintoken") === null) {
      return false;
  } else if (localStorage.getItem("logintoken")) {
      return true;
  }
}


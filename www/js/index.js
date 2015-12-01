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
        document.addEventListener("backbutton", onBackKeyDown, false);

        function onBackKeyDown() {
        // Handle the back button
            if (myNavigator.getCurrentPage().options.pagevalue == "loginPage") {
              navigator.app.exitApp();
            }
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log("device is ready");

        document.addEventListener("showkeyboard", function(){ alert("Keyboard is ON");}, false);

        var login = checkLogin();
        if (login) {
          //myNavigator.pushPage('account.html', {animation: "fade"});
          myNavigator.pushPage('tabs.html', {params: { tab: 0 }});
        } else {
          setTimeout(function () {
            myNavigator.pushPage('login.html', {animation: "fade", pagevalue: "loginPage"});

          }, 3000)
        }
        console.log("start.html");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
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
    if (checkConnection()) {
      modal.show();
      validateLogin (username, password);
    } else {
      ons.notification.alert({
        message: 'Check your connection in order to procced with Login.',
        title: 'Connection error',
        buttonLabel: 'OK',
        animation: 'default',
        callback: function() {
        }
      });
    }
  }
  $scope.logOut = function () {
    console.log("logout pressed!");
    localStorage.removeItem("logintoken");
    myNavigator.pushPage('login.html', {animation: "fade", pagevalue: "loginPage"});
  } 
  $scope.register = function (username, email, password) {
    console.log("register pressed!");
    if (checkConnection()) {
      modal.show();
      registration(username, email, password);
    }  else {
      ons.notification.alert({
        message: 'Check your connection in order to procced with Register.',
        title: 'Connection error',
        buttonLabel: 'OK',
        animation: 'default',
        callback: function() {
        }
      });
    }
  }
  $scope.callMissions = function () {
    //myNavigator.pushPage('missions.html', {animation: "fade"});
    getMissions();
  } 
});

/* Κώδικας απαραίτητος προκειμένου να παίζω σωστά ο navigator μαζί με το menu */
module.controller('TabsController', function() {
  setImmediate(function() {
    var tabIndex = myNavigator.getCurrentPage().options.params.tab;
    app.tabbar.setActiveTab(tabIndex);
  });
});

function validateLogin(username, password) {
  if (isEmpty(username) && isEmpty(password)) {
    modal.hide();
    ons.notification.alert({
      message: 'Enter your email address and password.',
      title: 'Login Failed',
      buttonLabel: 'OK',
      animation: 'default',
      callback: function() {
      }
    });
  } else if (isEmpty(username)) {
    modal.hide();
    ons.notification.alert({
      message: 'Please check your email address.',
      title: 'Login Failed',
      buttonLabel: 'OK',
      animation: 'default',
      callback: function() {
      }
    });
  } else if (isEmpty(password)) {
    modal.hide();
    ons.notification.alert({
      message: 'Please check your password.',
      title: 'Login Failed',
      buttonLabel: 'OK',
      animation: 'default',
      callback: function() {
      }
    });
  } else {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/authenticate?email=" + username + "&password=" + password +"", true);
    xhttp.send();

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        modal.hide();
        var response = JSON.parse(xhttp.responseText)
        if (response.status == "success") {
          saveLocalStorage(response.message.token);
          //myNavigator.pushPage('account.html', {animation: "fade"});
          myNavigator.pushPage('tabs.html', {params: { tab: 0 }});
        } else {
          ons.notification.alert({
            message: "" + response.message.description,
            title: 'Login Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function() {
            }
          });
        }
      } else if (xhttp.readyState == 4 && xhttp.status == 400) {
        modal.hide();
        ons.notification.alert({
          message: "" + response.message.description,
          title: 'Unauthorized action',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        }); 
      } else if (xhttp.readyState == 4 && xhttp.status == 404) {
        modal.hide();
        ons.notification.alert({
          message: "" + response.message.description,
          title: 'User not found',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        }); 
      }
    }

  }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function saveLocalStorage(logintoken) {
  if(typeof(Storage) !== "undefined") {
      localStorage.setItem("logintoken", logintoken);
  } else {

  }
}

function registration(username, email, password) {
    var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (username && email && password) {
      if (email_validation.test(email)){
        console.log("register ok");
        document.getElementById("email").style.display = "none";
        sendRegisterRequest(username, email, password);
      } else {
        modal.hide();
        document.getElementById("email").style.display = "inline";
      }
    } else {
      modal.hide();
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

function sendRegisterRequest(username, email, password) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/users/register?name=" + username + "&email=" + email + "&password=" + password +"", true);
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      modal.hide();
      var response = JSON.parse(xhttp.responseText)
      if (response.status == "success") {
        modal.show();
        setTimeout(function () {
          modal.hide();
          saveLocalStorage(response.message.token);
          //myNavigator.pushPage('account.html', {animation: "fade"});
          myNavigator.pushPage('tabs.html', {params: { tab: 0 }});
        }, 2000)
      } else {
        ons.notification.alert({
          message: "" + response.message.description,
          title: 'register Failed',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        });
      }
    } else if (xhttp.readyState == 4 && xhttp.status == 400) {
      modal.hide();
      var response = JSON.parse(xhttp.responseText)
      ons.notification.alert({
        message: "" + response.message.description,
        title: 'Bad Request',
        buttonLabel: 'OK',
        animation: 'default',
        callback: function() {
        }
      }); 
    } else if (xhttp.readyState == 4 && xhttp.status == 409) {
      modal.hide();
      var response = JSON.parse(xhttp.responseText)
      ons.notification.alert({
        message: "" + response.message.description,
        title: 'Email already exists',
        buttonLabel: 'OK',
        animation: 'default',
        callback: function() {
        }
      }); 
    }
  }
}

function checkLogin() {
  if(localStorage.getItem("logintoken") === null) {
      return false;
  } else {
      return true;
  }
}

function checkConnection() {
    var networkState = navigator.connection.type;

    //var states = {};
    //states[Connection.UNKNOWN]  = 'Unknown connection';
    //states[Connection.ETHERNET] = 'Ethernet connection';
    //states[Connection.WIFI]     = 'WiFi connection';
    //states[Connection.CELL_2G]  = 'Cell 2G connection';
    //states[Connection.CELL_3G]  = 'Cell 3G connection';
    //states[Connection.CELL_4G]  = 'Cell 4G connection';
    //states[Connection.CELL]     = 'Cell generic connection';
    //states[Connection.NONE]     = 'No network connection';

    //alert('Connection type: ' + states[networkState]);

    if (networkState == "none") {
      return false;
    } else {
      return true;
    }
}

function getMissions() {
  var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/missions", true);
    xhttp.send();

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var response = JSON.parse(xhttp.responseText)
        if (response.status == "success") {
          //Εδώ δοκίμασα να παράγω το grid και να το κολλήσω στην html.
            var newdiv = document.createElement("div");
          /*newdiv.innerHTML = "<ons-row> <ons-col id='grid-column' width='46%'><img src='http://cityrus.projects.development1.scify.org/www/city-r-us-web/public/img/mission.png' alt='scify' height='100' width='100' align='middle'> <p id='mission_description'>Mission1 Description</p> <p id='contributions'>12 contributors</p> </ons-col> <ons-col id='grid-column' width='46%'><img src='http://cityrus.projects.development1.scify.org/www/city-r-us-web/public/img/mission.png' alt='scify' height='100' width='100' align='middle'> <p id='mission_description'>Mission2 Description</p> <p id='contributions'>12 contributors</p> </ons-col> </ons-row>";
          document.getElementById("gridview").appendChild(newdiv);
*/

          //Εδώ κάνω μια επανάληψη τον πίνακα των αποστολών για να πάρω περιγραφές και τα σχετικά.
          for (var i = 0; i < response.message.missions.length; i++) {

console.log('aaa')
              newdiv.innerHTML = "<ons-row> " +
              "<ons-col  width='46%'>" +
              "<img src='http://cityrus.projects.development1.scify.org/www/city-r-us-web/public/img/mission.png' alt='scify' height='100' width='100' align='middle'> " +
              "<p class='mission_description'>Mission1 Description</p> " +
              "<p class='contributions'>12 contributors</p> " +
              "</ons-col> " +
              "<ons-col  width='46%'>" +
              "<img src='http://cityrus.projects.development1.scify.org/www/city-r-us-web/public/img/mission.png' alt='scify' height='100' width='100' align='middle'> " +
              "<p class='mission_description'>Mission2 Description</p>" +
              " <p class='contributions'>12 contributors</p> " +
              "</ons-col> " +
              "</ons-row>";



          }


            document.getElementById("gridview").appendChild(newdiv);



        } else {
          ons.notification.alert({
            message: "" + response.message.description,
            title: 'Login Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function() {
            }
          });
        }
      } else if (xhttp.readyState == 4 && xhttp.status == 400) {
        modal.hide();
        ons.notification.alert({
          message: "" + response.message.description,
          title: 'Unauthorized action',
          buttonLabel: 'OK',
          animation: 'default',
          callback: function() {
          }
        }); 
      }
    }
}



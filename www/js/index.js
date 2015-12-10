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

var module = ons.bootstrap('app', ['onsen', 'pascalprecht.translate']);

module.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        "MISSIONS": "Missions",
        "INVITE": "Invite",
        "ACCOUNT": "Account",
        "TAG LOCATION": "Tag Location"
    });
    $translateProvider.translations('el', {
        "MISSIONS": "Αποστολές",
        "INVITE": "Προσκάλεσε",
        "ACCOUNT": "Λογαριασμός",
        "TAG LOCATION": "Σήμανση Σημείου"
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
    $translateProvider.useSanitizeValueStrategy("escape");
});

module.run(function ($translate) {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
        if (myNavigator.getCurrentPage().options.pagevalue === "loginPage") {
            navigator.app.exitApp();
        }
    }

    function onDeviceReady() {
        console.log("Device is ready");
        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function (language) {
                $translate.use((language.value).split("-")[0]);
            }, null);
        }

        document.addEventListener("showkeyboard", function () {
            alert("Keyboard is ON");
        }, false);

        var login = checkLogin();
        if (login) {
            myNavigator.replacePage('tabs.html', {params: {tab: 0}});
        } else {
            setTimeout(function () {
                myNavigator.replacePage('login.html', {animation: "fade", pagevalue: "loginPage"});
            }, 3000)
        }
        console.log("start.html");
    }
});

module.controller('AppController', function ($scope, $http) {
    var missions;
    console.log("Angular ready!!!");
    ons.ready(function () {
        console.log("onsen ready!!!");
    });

    $scope.logIn = function (username, password) {
        console.log("button pressed!");
        if (checkConnection()) {
            modal.show();
            validateLogin(username, password);
        } else {
            ons.notification.alert({
                message: 'Check your connection in order to procced with Login.',
                title: 'Connection error',
                buttonLabel: 'OK',
                animation: 'default',
                callback: function () {
                }
            });
        }
    };
    $scope.logOut = function () {
        console.log("logout pressed!");
        localStorage.removeItem("logintoken");
        myNavigator.pushPage('login.html', {animation: "fade", pagevalue: "loginPage"});
    };
    $scope.register = function (username, email, password) {
        console.log("register pressed!");
        if (checkConnection()) {
            modal.show();
            registration(username, email, password);
        } else {
            ons.notification.alert({
                message: 'Check your connection in order to procced with Register.',
                title: 'Connection error',
                buttonLabel: 'OK',
                animation: 'default',
                callback: function () {
                }
            });
        }
    };
    $scope.callMissions = function () {
        $http({
            method: 'GET',
            url: 'http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/missions'
        }).success(function (data) {
            missions = data.message.missions;
            $scope.missions = data.message.missions;
        }).error(function(error){
            alert("error");
            console.log(error);
        });
    };
    $scope.showMission = function (index) {
        console.log(missions[index]);
        $scope.mission = missions[index];
        myNavigator.pushPage('mission.html');
    }

    $scope.showUser = function () {
        $http({
            method: 'GET',
            url: 'http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/missions'
        }).success(function(data){
            missions = data.message.missions;
            $scope.missions  = data.message.missions;

        }).error(function(){
            alert("error");
        });
    };
    $scope.startMission = function (missionType) {
        switch (missionType) {
            case "1":
                myNavigator.pushPage('point_tagging_mission.html');
                break;
            case "2":
                break;
            default:
                break;
        }
    };
});

module.controller('MissionsController', function ($scope) {
    $scope.callMissions();
});

module.controller('TabsController', function ($scope, $translate) {
    $scope.tabs = [];
    $translate("MISSIONS").then(function (label) {
        $scope.tabs.push({"label": label, "icon": "img/icons/white/svg/flag2.svg", "page": "missions.html"});
    });
    $translate("INVITE").then(function (label) {
        $scope.tabs.push({"label": label, "icon": "img/icons/white/svg/plus.svg", "page": "invite.html"});
    });
    $translate("ACCOUNT").then(function (label) {
        $scope.tabs.push({"label": label, "icon": "img/icons/white/svg/user.svg", "page": "account.html"});
    });
});

module.controller('PointTaggingMissionController', function ($scope, $translate) {
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(function (position) {
        $scope.position = position;
        var map = new Map();
        map.initialize($scope.position.coords.latitude, $scope.position.coords.longitude);
    }, null, options);
});

function validateLogin(username, password) {
    if (isEmpty(username) && isEmpty(password)) {
        modal.hide();
        ons.notification.alert({
            message: 'Enter your email address and password.',
            title: 'Login Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    } else if (isEmpty(username)) {
        modal.hide();
        ons.notification.alert({
            message: 'Please check your email address.',
            title: 'Login Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    } else if (isEmpty(password)) {
        modal.hide();
        ons.notification.alert({
            message: 'Please check your password.',
            title: 'Login Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/authenticate?email=" + username + "&password=" + password + "", true);
        xhttp.send();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                modal.hide();
                var response = JSON.parse(xhttp.responseText)
                if (response.status == "success") {
                    saveLocalStorage(response.message.token);
                    //myNavigator.pushPage('account.html', {animation: "fade"});
                    myNavigator.pushPage('tabs.html', {params: {tab: 0}});
                } else {
                    ons.notification.alert({
                        message: "" + response.message.description,
                        title: 'Login Failed',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
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
                    callback: function () {
                    }
                });
            } else if (xhttp.readyState == 4 && xhttp.status == 404) {
                modal.hide();
                ons.notification.alert({
                    message: "" + response.message.description,
                    title: 'User not found',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
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
    if (typeof Storage !== "undefined") {
        localStorage.setItem("logintoken", logintoken);
    }
}

function registration(username, email, password) {
    var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (username && email && password) {
        if (email_validation.test(email)) {
            console.log("register ok");
            document.getElementById("email").style.display = "none";
            sendRegisterRequest(username, email, password);
        } else {
            modal.hide();
            document.getElementById("email").style.display = "block";
        }
    } else {
        modal.hide();
        if (email_validation.test(email)) {
            document.getElementById("email").style.display = "none";
        } else {
            document.getElementById("email").style.display = "inline";
        }
        ons.notification.alert({
            message: 'Check your username, email or password.',
            title: 'Registration Failed',
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    }
}

function sendRegisterRequest(username, email, password) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1/users/register?name=" + username + "&email=" + email + "&password=" + password + "", true);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            modal.hide();
            var response = JSON.parse(xhttp.responseText)
            if (response.status == "success") {
                modal.show();
                setTimeout(function () {
                    modal.hide();
                    saveLocalStorage(response.message.token);
                    //myNavigator.pushPage('account.html', {animation: "fade"});
                    myNavigator.pushPage('tabs.html', {params: {tab: 0}});
                }, 2000)
            } else {
                ons.notification.alert({
                    message: "" + response.message.description,
                    title: 'register Failed',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
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
                callback: function () {
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
                callback: function () {
                }
            });
        }
    }
}

function checkLogin() {
    if (localStorage.getItem("logintoken") === null) {
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

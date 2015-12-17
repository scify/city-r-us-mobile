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
var apiUrl = 'http://cityrus.projects.development1.scify.org/www/city-r-us-service/public/api/v1';


module.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        "MISSIONS": "Missions",
        "INVITE": "Invite",
        "ACCOUNT": "Account",
        "TAG LOCATION": "Tag Location",
        "CONFIRM": "Send",
        "SUBMIT_POINT_TEXT": "Click to send the point you recorded and contribute to this mission.",
        "SUBMIT_ROUTE_TEXT": "Click to send the route you recorded and contribute to this mission.",
        "SENDING": "Sending",
        "SUCCESS": "Thank you for contributing! You received {{value}} points.",
        "FAIL": "Something went wrong, please try again",
        "RECORDING": "Recording route...",
        "START": "Start"
    });
    $translateProvider.translations('el', {
        "MISSIONS": "Αποστολές",
        "INVITE": "Προσκάλεσε",
        "ACCOUNT": "Λογαριασμός",
        "TAG LOCATION": "Σήμανση Σημείου",
        "CONFIRM": "Αποστολή",
        "SUBMIT_POINT_TEXT": "Καταχώρησε το σημείο που κατέγραψες για να συνησφέρεις στην αποστολή.",
        "SUBMIT_ROUTE_TEXT": "Καταχώρησε τη διαδρομή την οποία κατέγραψες για να συνησφέρεις στην αποστολή.",
        "SENDING": "Αποστολή δεδομένων",
        "SUCCESS": "Ευχαριστούμε για την συμμετοχή! Κερδίθηκαν {{value}} βαθμοί.",
        "FAIL": "Αποτυχία σύνδεσης, παρακαλλώ προσπαθήστε ξανά",
        "RECORDING": "Καταγραφή διαδρομής...",
        "START": "Έναρξη"
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
            }, 3000);
        }
    }
});

module.controller('AppController', function ($scope, $http) {
    var missions;

    $scope.geoConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 10,
        debug: true,
        locationTimeout: 10,
        stopOnTerminate: true
    };

    $scope.logIn = function (username, password) {
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
        localStorage.removeItem("logintoken");
        myNavigator.pushPage('login.html', {animation: "fade", pagevalue: "loginPage"});
    };
    $scope.register = function (username, email, password) {
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
            url: apiUrl + '/missions'
        }).success(function (data) {
            missions = data.message.missions;

            //formatting date
            angular.forEach(missions, function (value, key) {
                value.created = Date.parse(value.created_at);
            });

            $scope.missions = data.message.missions;
        }).error(function (error) {
            alert("error");
            console.log(error);
        });
    };
    $scope.showMission = function (index) {
        $scope.mission = missions[index];
        myNavigator.pushPage('mission.html');
    };

    $scope.startMission = function (missionType) {
        switch (missionType) {
            case "1":
                myNavigator.pushPage('point_tagging_mission.html');
                break;
            case "2":
                myNavigator.pushPage('route_tagging_mission.html');
                break;
            default:
                break;
        }
    };

    $scope.Invite = function (email) {
        var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (checkConnection()) {
            if (email) {
                if (email_validation.test(email)) {
                    document.getElementById("email").style.display = "none";
                    document.getElementById("p").style.display = "none";
                    ons.notification.alert({
                        message: 'Η λειτουργία αυτή δεν έχει υλοποιηθεί ακόμα.',
                        title: 'Invite',
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
                }
                else {
                    document.getElementById("email").style.display = "inline";
                    document.getElementById("p").style.display = "inline";
                }
            }
            else {
                ons.notification.alert({
                    message: 'Check your email.',
                    title: 'Invitation Failed',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
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
});

module.controller('MissionsController', function ($scope) {
    if (typeof $scope.missions === "undefined") {
        $scope.callMissions();
    }
});

module.controller('TabsController', function ($scope, $translate) {
    $scope.tabs = [];
    $translate("MISSIONS").then(function (label) {
        $scope.tabs.push({"label": label, "icon": "img/icons/white/svg/flag2.svg", "page": "missions.html", "active": true});
    });
    $translate("INVITE").then(function (label) {
        $scope.tabs.push({"label": label, "icon": "img/icons/white/svg/plus.svg", "page": "invite.html"});
    });
    $translate("ACCOUNT").then(function (label) {
        $scope.tabs.push({
            "label": label,
            "icon": "img/icons/white/svg/user.svg",
            "page": "account.html"
        });
    });
});

module.controller('AccountController', function ($scope, $http) {
    if (typeof $scope.user === "undefined") {
        $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
        $http({
            method: 'GET',
            url: apiUrl + '/users/byJWT'
        }).success(function (data) {
            $scope.user = data.message.user;
        }).error(function (error) {
            console.log(error);
        });
    }
});

module.controller('PointTaggingMissionController', function ($scope, $http, $translate, $filter) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(function (position) {
        $scope.position = position;
        $scope.map = new Map();
        $scope.map.initialize($scope.position.coords.latitude, $scope.position.coords.longitude);
    }, null, options);

    $scope.tagLocation = function () {
        confirmation.show();
    };

    $scope.sendLocation = function () {
        loading.show();
        var marker = $scope.map.getMarkers()[0].marker;
        var now = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");
        var deviceUUID = "test";

        $http.post(
                apiUrl + '/observations/store',
                {
                    "device_uuid": deviceUUID,
                    "mission_id": $scope.mission.id,
                    "latitude": marker.position.lat(),
                    "longitude": marker.position.lng(),
                    "observation_date": now,
                    "measurements": [{
                            "latitude": marker.position.lat(),
                            "longitude": marker.position.lng(),
                            "observation_date": now
                        }]
                }, null)
                .then(
                        function (data) {
                            loading.hide();
                            $scope.translationData = {
                                value: data.data.message.points
                            };
                            success.show();
                            setTimeout(function () {
                                success.hide();
                            }, 2000);
                        },
                        function (error) {
                            loading.hide();
                            fail.show();
                            setTimeout(function () {
                                fail.hide();
                            }, 2000);
                        }
                );
    };
});

module.controller('RouteTaggingMissionController', function ($scope, $http, $translate, $filter) {
    $translate("RECORDING").then(function (label) {
        $scope.currentMessage = label;
    });
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(function (position) {
        $scope.position = position;
        $scope.map = new Map();
        $scope.map.initialize($scope.position.coords.latitude, $scope.position.coords.longitude);
        backgroundGeoLocation.configure($scope.map.addMarkerToMap, function (error) {
            console.log(error);
        }, $scope.geoConfig);
        backgroundGeoLocation.start();
    }, null, options);

    $scope.tagRoute = function () {
        backgroundGeoLocation.stop();
        confirmation.show();
    };

    $scope.sendRoute = function () {
        loading.show();
        var markers = $scope.map.getMarkers();
        var deviceUUID = "test";
        var data = {
            "device_uuid": deviceUUID,
            "mission_id": $scope.mission.id,
            "measurements": []
        };
        markers.forEach(function (entry) {
            data.measurements.push({
                latitude: entry.marker.position.lat(),
                longitude: entry.marker.position.lng(),
                observation_date: $filter('date')(new Date(entry.time), "yyyy-MM-dd hh:mm:ss")
            });
        });
        data.latitude = data.measurements[data.measurements.length - 1].latitude;
        data.longitude = data.measurements[data.measurements.length - 1].longitude;
        data.observation_date = data.measurements[data.measurements.length - 1].observation_date;
        $http.post(apiUrl + '/observations/store', data, null)
                .then(
                        function (data) {
                            loading.hide();
                            $scope.translationData = {
                                value: data.data.message.points
                            };
                            success.show();
                            setTimeout(function () {
                                success.hide();
                            }, 2000);
                        },
                        function (error) {
                            loading.hide();
                            fail.show();
                            setTimeout(function () {
                                fail.hide();
                            }, 2000);
                        }
                );
    };
});

module.controller('inviteController', function ($scope, $translate) {
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
        xhttp.open("POST", apiUrl + "/authenticate?email=" + username + "&password=" + password + "", true);
        xhttp.send();

        xhttp.onreadystatechange = function () {
            var response = JSON.parse(xhttp.responseText)
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                modal.hide();
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
    xhttp.open("POST", apiUrl + "/users/register?name=" + username
    + "&email=" + email
    + "&password=" + password
    + "&deviceUUID=" + device.uuid
    + "&model=" + device.model
    + "&manufacturer=" + device.platform, true);
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

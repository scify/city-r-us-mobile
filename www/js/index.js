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
var apiUrl = 'http://city-r-us.scify.org/service/public/api/v1';


module.config(function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'translations/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('el-GR');
    $translateProvider.fallbackLanguage('el-GR');
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
        window.analytics.startTrackerWithId('UA-31632742-15');
        var login = checkLogin();
        if (login) {
            myNavigator.replacePage('tabs.html', {params: {tab: 0}});
        } else {
            setTimeout(function () {
                window.analytics.trackView('login');
                window.analytics.trackEvent('Page', 'View', 'Login');
                myNavigator.replacePage('login.html', {animation: "fade", pagevalue: "loginPage"});
            }, 1000);
        }
    }
});

module.controller('AppController', function ($scope, $http, $window, $filter, $translate) {
    var mission = JSON.parse(window.localStorage.getItem('recording_mission'));
    if (mission !== null) {
        window.localStorage.removeItem('recording_mission');
        backgroundGeoLocation.stop();
    }

    var missions;
    $scope.min_height = $window.innerHeight + 'px !important';

    $scope.logIn = function (username, password) {
        if (checkConnection($filter, true)) {
            modal.show();
            validateLogin(username, password, $filter);
        }
    };

    $scope.register = function (username, email, password, terms) {
        if (checkConnection($filter, true)) {
            console.log(terms)
            if (terms === 'undefined' || !terms) {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('PLEASE_ACCEPT_TERMS'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            } else {
                modal.show();
                registration(username, email, password, $filter);
            }
        }
    };

    $scope.resetPassword = function (email) {
        if (!isEmpty(email)) {
            $http({
                method: 'POST',
                url: apiUrl + '/users/resetPassword',
                params: {'email': email}
            }).success(function (data) {
                if (data.status == 'success')
                    ons.notification.alert({
                        title: $filter('translate')('EMAIL_SENT'),
                        message: $filter('translate')('TMP_PWD'),
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
                else
                    ons.notification.alert({
                        title: $filter('translate')('ERROR'),
                        message: $filter('translate')('CREDENTIALS_NOT_VALID'),
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
            }).error(function (error) {
                console.log(error);
            });
        }
        else {
            ons.notification.alert({
                title: $filter('translate')('ERROR'),
                message: $filter('translate')('FILL_EMAIL'),
                buttonLabel: 'OK',
                animation: 'default',
                callback: function () {
                }
            });
        }
    };

    $scope.callMissions = function () {
        if (checkConnection($filter, true)) {
            loading.show();
            $http({
                method: 'GET',
                url: apiUrl + '/missions'
            }).success(function (data) {
                loading.hide();
                missions = data.message.missions;

                angular.forEach(missions, function (value, key) {
                    value.created = Date.parse(value.created_at);
                });
                $scope.missions = data.message.missions;
            }).error(function (error) {
                loading.hide();
                alert("error");
                console.log(error);
            });
        }
    };

    $scope.suggestMission = function () {
        myNavigator.pushPage('suggest.html');
    };

    $scope.showMission = function (index) {
        window.analytics.trackView('mission');
        window.analytics.trackEvent('Page', 'View', 'Mission');
        window.analytics.trackEvent('Mission', 'Opened', '', missions[index].id);
        $scope.mission = missions[index];
        myNavigator.pushPage('mission.html');
    };

    $scope.startMission = function (missionType) {
        switch (missionType) {
            case "1":
                window.analytics.trackEvent('Mission', 'Started', 'Point', $scope.mission.id);
                myNavigator.pushPage('point_tagging_mission.html');
                break;
            case "2":
                window.analytics.trackEvent('Mission', 'Started', 'Route', $scope.mission.id);
                myNavigator.pushPage('route_tagging_mission.html');
                break;
            default:
                break;
        }
    };
});

module.controller('MissionsController', function ($scope) {
    if (typeof $scope.missions === "undefined") {
        $scope.callMissions();
    }
    window.analytics.trackView('missions');
    window.analytics.trackEvent('Page', 'View', 'Missions');
});

module.controller('TabsController', function ($scope, $translate) {

    $scope.tabs = [];

    $translate("MISSIONS").then(function (label) {
        $scope.tabs.push({
            "label": label,
            "icon": "img/icons/white/svg/flag2.svg",
            "page": "missions.html",
            "active": true
        });
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

module.controller('RegisterController', function ($scope) {
    window.analytics.trackView('register');
    window.analytics.trackEvent('Page', 'View', 'Register');
});

module.controller('AccountController', function ($scope, $http, $translate, $filter) {
    window.analytics.trackView('account');
    window.analytics.trackEvent('Page', 'View', 'Account');

    if (checkConnection($filter, false)) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
        $http({
            method: 'GET',
            url: apiUrl + '/users/byJWT'
        }).success(function (data) {
            user = data.message.user;
            $scope.user = data.message.user;
            localStorage.setItem('user', JSON.stringify(data.message.user));
        }).error(function (error) {
            console.log(error);
        });
    }
    else {
        if (localStorage.getItem('user') != null && localStorage.getItem('user') != '')
            $scope.user = JSON.parse(localStorage.getItem('user'));
    }

    $scope.logout = function () {
        localStorage.removeItem("logintoken");
        myNavigator.replacePage('login.html', {animation: "fade", pagevalue: "loginPage"});
    };

    $scope.changePassword = function (password) {
        if (checkConnection($filter, true)) {
            if ($scope.password && $scope.passwordConfirmation && ($scope.password).trim().length > 0) {
                if ($scope.password.length > 5) {

                    if ($scope.password == $scope.passwordConfirmation) {
                        loading.show();

                        $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
                        $http({
                            method: 'POST',
                            url: apiUrl + '/users/changePassword',
                            data: {
                                password: password
                            }
                        }).success(function (data) {
                            loading.hide();

                            ons.notification.alert({
                                title: $filter('translate')(''),
                                message: $filter('translate')('PASSWORD_CHANGED'),
                                buttonLabel: 'OK',
                                animation: 'default',
                                callback: function () {
                                }
                            });
                        }).error(function (error) {
                            loading.hide();
                            console.log(error);
                        });
                    }

                    else {
                        ons.notification.alert({
                            title: $filter('translate')('ERROR'),
                            message: $filter('translate')('PASSWORDS_NOT_THE_SAME'),
                            buttonLabel: 'OK',
                            animation: 'default',
                            callback: function () {
                            }
                        });
                    }
                }
                else {
                    ons.notification.alert({
                        title: $filter('translate')('ERROR'),
                        message: $filter('translate')('PASSWORD_NOT_OK'),
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
                }
            }
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('FILL_PASSWORD'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };
}
)
        ;


module.controller('PointTaggingMissionController', function ($scope, $http, $translate, $filter) {
    window.analytics.trackView('point_tagging_mission');
    window.analytics.trackEvent('Page', 'View', 'Point Tagging Mission');
    if (checkConnection($filter, true)) {

        loading.show();
        $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
        var options = {enableHighAccuracy: true, timeout: 8000};
        var map = new Map();
        var position;

        navigator.geolocation.getCurrentPosition(function (pos) {
            loading.hide();
            position = pos;
            map.initialize(position.coords.latitude, position.coords.longitude);
            map.addMarkerToMap(position.coords.latitude, position.coords.longitude);
        }, function () {
            loading.hide();
            gpsError.show();
            setTimeout(function () {
                gpsError.hide();
                myNavigator.popPage();
            }, 2000);
        }, options);
    }

    $scope.tagLocation = function () {
        if (checkConnection($filter, true)) {
            if (map.getMarkers().length > 0)
                confirmation.show();
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('NO_LOCATION'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };

    $scope.sendLocation = function () {
        window.analytics.trackEvent('Mission', 'Completed', 'Point', $scope.mission.id);
        if (checkConnection($filter, true)) {
            if (map.getMarkers().length > 0) {
                loading.show();
                var marker = map.getMarkers()[0];
                var now = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");
                var deviceUUID = "";

                if (device.uuid != null)
                    deviceUUID = device.uuid;
                else
                    deviceUUID = "test";

                $http.post(
                        apiUrl + '/observations/store',
                        {
                            "device_uuid": deviceUUID,
                            "mission_id": $scope.mission.id,
                            "latitude": marker.getPosition().lat(),
                            "longitude": marker.getPosition().lng(),
                            "observation_date": now,
                            "measurements": [{
                                    "latitude": marker.getPosition().lat(),
                                    "longitude": marker.getPosition().lng(),
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
                                        myNavigator.resetToPage('tabs.html', {animation: 'fade'});
                                    }, 2000);
                                },
                                function (error) {
                                    loading.hide();
                                    fail.show();
                                    setTimeout(function () {
                                        fail.hide();
                                        myNavigator.resetToPage('tabs.html', {animation: 'fade'});
                                    }, 2000);
                                }
                        );
            }
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('NO_LOCATION'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };

});


module.controller('RouteTaggingMissionController', function ($scope, $http, $translate, $filter) {
    window.analytics.trackView('route_tagging_mission');
    window.analytics.trackEvent('Page', 'View', 'Route Tagging Vision');

    $scope.first = true;

    $scope.geoConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 1,
        debug: false,
        distanceFilter: 1,
        stopOnTerminate: true,
        locationTimeout: 2,
        locationService: backgroundGeoLocation.service.ANDROID_FUSED_LOCATION,
        activityType: 'Other',
        interval: 2000,
        fastestInterval: 1000,
        ativitiesInterval: 60000
    };

    $scope.cancelRoute = function () {
        window.analytics.trackEvent('Mission', 'Canceled', 'Route', $scope.mission.id);
        document.removeEventListener("backbutton", $scope.backButtonPressed);
        window.localStorage.removeItem('recording_mission');
        myNavigator.off('prepop');
        backgroundGeoLocation.stop();
        backPrevention.hide();
        myNavigator.popPage();
    };

    $scope.continueRoute = function () {
        backPrevention.hide();
    };

    if (checkConnection($filter, true)) {

        loading.show();
        var map = new Map();

        //track the user location
        backgroundGeoLocation.configure(function (location) {
            console.log(location);

            if (location.accuracy > 30) {
                return;
            }

            if ($scope.first) {
                console.log('first');
                $scope.first = false;
                loading.hide();

                myNavigator.on('prepop', function (event) {
                    event.cancel();
                    backPrevention.show();
                });

                $scope.backButtonPressed = function () {
                    backPrevention.show();
                };

                document.addEventListener("backbutton", $scope.backButtonPressed, false);

                map.initialize(location.latitude, location.longitude);
            }

            map.addRouteMarkerToMap(location.latitude, location.longitude, $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss"));

            var markers = map.getMarkers().length;

            //if there are more than one markers, draw a line that connects the last two markers
            if (markers > 1) {
                var path = [
                    {
                        lat: map.getMarkers()[markers - 2].getPosition().lat(),
                        lng: map.getMarkers()[markers - 2].getPosition().lng()
                    },
                    {
                        lat: map.getMarkers()[markers - 1].getPosition().lat(),
                        lng: map.getMarkers()[markers - 1].getPosition().lng()
                    }
                ];
                map.drawLine(path);
            }
        }, function (error) {
            console.log(error);
            window.localStorage.removeItem('recording_mission');
            loading.hide();
            gpsError.show();
            setTimeout(function () {
                gpsError.hide();
                myNavigator.popPage();
            }, 2000);
        }, $scope.geoConfig);

        window.localStorage.setItem('recording_mission', JSON.stringify($scope.mission));
        backgroundGeoLocation.start();
    } else {
        myNavigator.popPage();
    }

    $scope.tagRoute = function () {
        if (checkConnection($filter, true)) {
            if (map.getMarkers().length > 1)
                confirmation.show();
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('NO_ROUTE'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };

    //send the route to the server and stop tracking the user location
    $scope.sendRoute = function () {
        window.analytics.trackEvent('Mission', 'Completed', 'Route', $scope.mission.id);
        if (checkConnection($filter, true)) {
            if (map.getMarkers().length > 1) {
                backgroundGeoLocation.stop();
                loading.show();
                var markers = map.getMarkers();
                var deviceUUID = "";
                var now = $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss");

                if (device.uuid != null)
                    deviceUUID = device.uuid;
                else
                    deviceUUID = "test";

                var data = {
                    "device_uuid": deviceUUID,
                    "mission_id": $scope.mission.id,
                    "measurements": []
                };

                markers.forEach(function (entry) {
                    data.measurements.push({
                        latitude: entry.getPosition().lat(),
                        longitude: entry.getPosition().lng(),
                        observation_date: entry.observation_date
                    });
                });

                data.latitude = data.measurements[data.measurements.length - 1].latitude;
                data.longitude = data.measurements[data.measurements.length - 1].longitude;
                data.observation_date = now;

                $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
                $http.post(apiUrl + '/observations/store', data, null)
                        .then(
                                function (data) {
                                    loading.hide();
                                    $scope.translationData = {
                                        value: data.data.message.points
                                    };
                                    success.show();
                                    setTimeout(function () {
                                        document.removeEventListener("backbutton", $scope.backButtonPressed);
                                        myNavigator.off('prepop');
                                        window.localStorage.removeItem('recording_mission');
                                        myNavigator.resetToPage('tabs.html', {animation: 'fade'});
                                    }, 2000);
                                },
                                function (error) {
                                    loading.hide();
                                    fail.show();
                                    setTimeout(function () {
                                        document.removeEventListener("backbutton", $scope.backButtonPressed);
                                        myNavigator.off('prepop');
                                        window.localStorage.removeItem('recording_mission');
                                        myNavigator.resetToPage('tabs.html', {animation: 'fade'});
                                    }, 2000);
                                }
                        );
            }
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('NO_ROUTE'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };
});

module.controller('InviteController', function ($scope, $translate, $filter, $http) {
    window.analytics.trackView('invite');
    window.analytics.trackEvent('Page', 'View', 'Invite');

    $scope.msg = $filter('translate')('INVITE_MSG_PLACEHOLDER');

    $scope.invite = function (email, msg) {

        var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (checkConnection($filter, true)) {
            if (email) {
                if (email_validation.test(email)) {
                    modal.show();

                    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
                    $http({
                        method: 'POST',
                        url: apiUrl + '/users/invite',
                        data: {
                            email: email,
                            msg: msg
                        }
                    }).success(function (data) {
                        modal.hide();
                        ons.notification.alert({
                            title: $filter('translate')('EMAIL_SENT'),
                            message: $filter('translate')('FRIEND_INVITED'),
                            buttonLabel: 'OK',
                            animation: 'default',
                            callback: function () {
                            }
                        });
                    }).error(function (error) {
                        modal.hide();
                        console.log(error);
                    });
                }
            }
            else {
                modal.hide();
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('FILL_EMAIL'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };
});

module.controller('SuggestMissionController', function ($scope, $translate, $filter, $http) {
    window.analytics.trackView('suggest');
    window.analytics.trackEvent('Page', 'View', 'Suggest');

    $scope.suggest = function (description) {
        if (checkConnection($filter, true)) {

            if (description) {
                modal.show();

                $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("logintoken");
                $http({
                    method: 'POST',
                    url: apiUrl + '/missions/suggest',
                    data: {
                        description: description
                    }
                }).success(function (data) {
                    modal.hide();

                    ons.notification.alert({
                        title: "",
                        message: $filter('translate')('MISSION_SUGGESTED'),
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
                }).error(function (error) {
                    modal.hide();
                    console.log(error);
                });
            }
            else {
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('FILL_DESCRIPTION'),
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            }
        }
    };
});


function validateLogin(username, password, $filter) {
    if (isEmpty(username) && isEmpty(password)) {
        modal.hide();
        ons.notification.alert({
            title: $filter('translate')('ERROR'),
            message: $filter('translate')('FILL_EMAIL_PASSWORD'),
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    } else if (isEmpty(username)) {
        modal.hide();
        ons.notification.alert({
            title: $filter('translate')('ERROR'),
            message: $filter('translate')('FILL_EMAIL'),
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    } else if (isEmpty(password)) {
        modal.hide();
        ons.notification.alert({
            title: $filter('translate')('ERROR'),
            message: $filter('translate')('FILL_PASSWORD'),
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
            var response = JSON.parse(xhttp.responseText);
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                modal.hide();
                if (response.status == "success") {
                    window.analytics.setUserId(response.message.token);
                    saveLocalStorage(response.message.token);
                    myNavigator.replacePage('tabs.html', {params: {tab: 0}});
                } else {
                    ons.notification.alert({
                        title: $filter('translate')('ERROR'),
                        message: $filter('translate')('CREDENTIALS_NOT_VALID'),
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {
                        }
                    });
                }
            } else if (xhttp.readyState == 4 && xhttp.status == 400) {
                modal.hide();
                ons.notification.alert({
                    title: 'Unauthorized action',
                    message: "" + response.message.description,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {
                    }
                });
            } else if (xhttp.readyState == 4 && xhttp.status == 404) {
                modal.hide();
                ons.notification.alert({
                    title: $filter('translate')('ERROR'),
                    message: $filter('translate')('CREDENTIALS_NOT_VALID'),
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

function registration(username, email, password, $filter) {

    var email_validation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (username && email && password && password.trim().length > 0 && password.length > 5) {
        if (email_validation.test(email)) {
            sendRegisterRequest(username, email, password, $filter);
        } else {
            modal.hide();
        }
    } else {
        modal.hide();
        ons.notification.alert({
            title: $filter('translate')('ERROR'),
            message: $filter('translate')('REGISTRATION_FAILED'),
            buttonLabel: 'OK',
            animation: 'default',
            callback: function () {
            }
        });
    }
}

function sendRegisterRequest(username, email, password, $filter) {
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
                    myNavigator.replacePage('tabs.html', {params: {tab: 0}});
                }, 2000)
            } else {
                if (response.message.code == "email_exists")
                    ons.notification.alert({
                        title: $filter('translate')('ERROR'),
                        message: $filter('translate')('EMAIL_EXISTS'),
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
                title: 'Bad Request',
                message: "" + response.message.description,
                buttonLabel: 'OK',
                animation: 'default',
                callback: function () {
                }
            });
        } else if (xhttp.readyState == 4 && xhttp.status == 409) {
            modal.hide();
            var response = JSON.parse(xhttp.responseText)
            ons.notification.alert({
                title: $filter('translate')('EMAIL_EXISTS'),
                message: "" + response.message.description,
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
        window.analytics.setUserId(localStorage.getItem("logintoken"));
        return true;
    }
}

function checkConnection($filter, showMsg) {
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

        if (showMsg)
            ons.notification.alert({
                title: $filter('translate')('CONNECTION_ERROR'),
                message: $filter('translate')('CONNECTION_ERROR_MSG'),
                buttonLabel: 'OK',
                animation: 'default',
                callback: function () {
                }
            });

        return false;
    } else {
        return true;
    }
}

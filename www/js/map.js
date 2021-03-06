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

function Map() {

    this.markers = [];

    this.initialize = function (lat, lon) {
        this.map = this.show(lat, lon);
    };

    this.show = function (lat, lon) {
        return new google.maps.Map(
            document.getElementById("map-container"),
            {
                zoom: 18,
                center: new google.maps.LatLng(lat, lon),
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
    };

    this.addMarkerToMap = function (lat, lon) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            draggable: true,
            animation: google.maps.Animation.DROP,
            map: this.map,
            icon: 'img/marker.png'
        });
        this.markers.push(marker);
    };

    this.addRouteMarkerToMap = function (lat, lon, date) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            draggable: false,
            animation: google.maps.Animation.DROP,
            map: this.map,
            icon: 'img/marker.png',
            observation_date: date
        });
        if (this.markers.length >= 1) {
            this.markers[this.markers.length - 1].setMap(null);
        }
        this.markers.push(marker);
    };

    this.drawLine = function (path) {
        var line = new google.maps.Polyline({
            path: path,
            strokeColor: '#3366cc',
            fillOpacity: 0.4,
            strokeWeight: 1
        });
        
        line.setMap(this.map);
    };

    this.getMarkers = function() {
        return this.markers;
    };
}

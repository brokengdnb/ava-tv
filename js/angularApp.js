angular.module('projectorApp', ['ngMaterial', 'ngMessages','ja.qr'])
    .controller('AppCtrl', function ($scope, $mdSidenav, $http, $location) {
        $scope.idRoom = 'lol';
        $scope.QRurl = '';

        $scope.idInputChange = function(newData) {
            $http.get('/localIP').then(function(data) {
                // you can do some processing here
                $scope.QRurl = "http://" + data.data.local + "/" + newData.idRoom;
            });
        };

        $scope.ipInputChange = function(newData) {
                // you can do some processing here
                $scope.QRurl = "http://" + newData.ipServer + "/" + $scope.idRoom;
        };

        var parser = new UAParser();
        var dd = parser.getResult();
        $scope.deviceParsedData =  "TV - " + dd.os.name + " (" + dd.os.version + ")";

        $scope.randomRoom = function() {
            $scope.idRoom = Math.random().toString(36).substr(2, 3);
            document.getElementById('roomnum').value = $scope.idRoom;
            $scope.QRurl = "http://" + $scope.ipServer + "/" + $scope.idRoom;
        };

        $scope.getIp = function() {
            $http.get('/localIP').then(function(data) {
                // you can do some processing here
                $scope.ipServer = data.data.local;
            });
        };

        setTimeout(function () {
            $scope.randomRoom();
            $scope.getIp();
        },1000);

        $scope.activeFullScreen = false;
        $scope.toggleFullScreen = function () {
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
                document.getElementById("fullScreen").innerHTML = "fullscreen_exit"
                $scope.activeFullScreen = true;
                document.getElementById('Home').style.cursor = 'none';
            }
            else {
                cancelFullScreen.call(doc);
                document.getElementById("fullScreen").innerHTML = "fullscreen";
                $scope.activeFullScreen = false;
                document.getElementById('Home').style.cursor = 'crosshair';
            }
        };
    });
angular.module('projectorApp', ['ngMaterial', 'ngMessages','ja.qr'])
    .controller('AppCtrl', function ($scope, $mdSidenav, $http, $location, $mdDialog, $rootScope) {
        $scope.idRoom = '23';
        $scope.QRurl = '';


        $scope.ipInputChange = function(newData) {
            // qr code is changing on a go by IP address of a server and ID of a room
            $scope.QRurl = "http://" + newData.ipServer + "/" + $scope.idRoom;
        };

        $scope.idInputChange = function(newData) {
            $http.get('/localIP').then(function(data) {
                // qr code is changing on a go by IP address of a server and ID of a room
                $scope.QRurl = "http://" + data.data.local + "/" + newData.idRoom;
            });
        };



        $scope.openInNewTab = function() {
          var win = window.open($scope.QRurl, '_blank');
          win.focus();
        };

        $scope.openHomeNewTab = function() {
            var win = window.open($rootScope.ipDatabase, '_blank');
            win.focus();
        };



        var parser = new UAParser();
        var dd = parser.getResult();
        $scope.deviceParsedData =  "TV - " + dd.os.name + " (" + dd.browser.name + ")";

        $scope.randomRoom = function() {
            $scope.idRoom = Math.random().toString(14).substr(2, 2);
            document.getElementById('roomnum').value = $scope.idRoom;
            $scope.QRurl = "http://" + $scope.ipServer + "/" + $scope.idRoom;
        };

        $scope.room23 = function() {
            $scope.idRoom = 23;
            document.getElementById('roomnum').value = 23;
            $scope.QRurl = "http://" + $scope.ipServer + "/" + 23;
        };

        $scope.openDatabase = function() {
            var win = window.open("http://" + $scope.ipServer + ":3000/", '_blank');
            win.focus();
        };

        $scope.getIp = function() {
            $http.get('/localIP').then(function(data) {
                // you can do some processing here
                $scope.ipServer = data.data.local;
                //$scope.ipServer = '127.0.0.1';

                $scope.QRurl = "http://" + $scope.ipServer + "/" + $scope.idRoom;

            });
        };

        setTimeout(function () {
            $scope.randomRoom();
            $scope.getIp();
        },1000);

        $scope.activeFullScreen = false;


        $scope.showQR = function (ev) {
            $http.get('/localIP').then(function(data) {
                // you can do some processing here
                $scope.showQRDialog = false;

                $mdDialog.show({
                    locals:{
                        ipDatabase: data.data.local,
                        Room: roomnum
                    },
                    controller: dialogController,
                    onComplete: onCompleteFnc,
                    templateUrl: '/assets/dialog-qr.tmpl.html',
                    //templateUrl: '/templates/network/periodic.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                    .then(function(answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                        $scope.showQRDialog = false;
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                        $scope.showQRDialog = false;
                    });
            });

        };


        function onCompleteFnc($scope){
            $scope.showQRDialog = true;
        }

        function dialogController($scope, $mdDialog, Room, $rootScope, ipDatabase){
            $scope.newWindow = "http://" + ipDatabase;
            $scope.QRurl = $scope.newWindow + "/" + Room;
            $scope.ip = ipDatabase;
            $scope.room = Room;

            $scope.openHomeNewTab = function() {
                var win = window.open($scope.newWindow, '_blank');
                win.focus();
            };

            $scope.openInNewTab = function() {
                var win = window.open($scope.QRurl, '_blank');
                win.focus();
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

        document.getElementById('Home').style.cursor = 'crosshair';

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

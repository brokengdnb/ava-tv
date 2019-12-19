angular.module('controlApp', ['ngMaterial', 'ngMessages', 'ngResource'])
    .factory('Videos',
        function($resource) {
            return $resource('http://localhost:3000/api/notes/:id', {id: '@_id'}, {
                'query':  {method:'GET', isArray:true},
                'get':    {method:'GET'},
                'update': {method:'PUT'},
                'save':   {method:'POST'},
                'remove': {method:'DELETE'},
                'delete': {method:'DELETE'}
            });
        }
    )
    .controller('MainCtrl', function ($scope, $mdSidenav, $http, $location, $log, $mdDialog, Videos) {

        $scope.videos = Videos.query();

        $scope.videos.$promise.then(function(data) {
            $scope.videosData = data;
        });

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            };
        }

        $scope.closeLeft = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function(){
            return $mdSidenav('right').isOpen();
        };

        $http.get('/localIP').then(function(data) {
            // you can do some processing here
            $scope.ipServer = data.data.local;

            var urlParam = window.location.pathname;
            $scope.roomIDparam = urlParam.substr(1);

            console.warn($scope.roomIDparam);
        });

        var parser = new UAParser();

        var dd = parser.getResult();
        //$scope.deviceParsedData = dd.browser.name + ": " + dd.os.name + " " + dd.os.version;

        $scope.deviceParsedData =  "Control - " + dd.os.name + " (" + dd.os.version + ")";

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
            }
            else {
                cancelFullScreen.call(doc);
                document.getElementById("fullScreen").innerHTML = "fullscreen";
                $scope.activeFullScreen = false;
            }
        };

        function dialogController($scope, $mdDialog){
            $scope.playPre = function(video){
                var time = getTime();

                var urlParam = window.location.pathname;
                var roomIDparam = urlParam.substr(1);


                console.warn(roomIDparam);

                socket.emit('change video', {
                    room: roomIDparam,
                    videoId: video.url,
                    time: time
                });

                $scope.cancel();
            };

            $scope.preVideos = [
                {
                    img: "/preVideos/psycho01.png",
                    url: "/preVideos/psycho01.mp4"
                },{
                    img: "/preVideos/city01.png",
                    url: "/preVideos/city01.mp4"
                },{
                    img: "/preVideos/xray01.png",
                    url: "/preVideos/xray01.mp4"
                },{
                    img: "/preVideos/airport01.png",
                    url: "/preVideos/airport01.mp4"
                },{
                    img: "/preVideos/.png",
                    url: "/preVideos/.mp4"
                },{
                    img: "/preVideos/.png",
                    url: "/preVideos/.mp4"
                }
            ];

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

        $scope.showDialog = function(ev){
            $mdDialog.show({
                controller: dialogController,
                templateUrl: '/assets/dialog.tmpl.html',
                //templateUrl: '/templates/network/periodic.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                    $scope.activeMap = false;
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.activeMap = false;
                });
        }
});
angular.module('controlApp', ['ngMaterial', 'ngMessages', 'ngResource', 'angularMoment', 'ngDroplet'])
    .run(function($http, $rootScope) {
        $http.get('/localIP').then(function(data) {
            // you can do some processing here
            $rootScope.ipDatabase = data.data.local;
            //console.warn($rootScope.ipDatabase);
        });
    })
    .factory('Videos', ['$rootScope', '$location', '$resource', '$http', '$q', function($rootScope, $location, $resource, $http, $q) {
        var service = {};

        service.callIp = function() {
            var deferred = $q.defer();

            $http.get('/localIP').then(function(data) {
            // you can do some processing here
                $rootScope.ipDatabase = data.data.local.toString();
                deferred.resolve($rootScope.ipDatabase);

                var url = $location.absUrl().split('/')[2];

                $rootScope.random = (new Date()).toString();
                //console.log(url);

                  service.api = $resource('http://' + url + ':3000/api/notes/:id' + "?cb=" + $rootScope.random, {id: '@_id'}, {
                        'query':  {method:'GET', isArray:true},
                        'get':    {method:'GET'},
                        'update': {method:'PUT'},
                        'save':   {method:'POST'},
                        'remove': {method:'DELETE'},
                        'delete': {method:'DELETE'}
                    })
            });
            return deferred.promise;
        };

        service.callRandom = function() {
            var deferred = $q.defer();
            $rootScope.random = (new Date()).toString();
            return deferred.promise;
        };

        return service;
    }])
    .factory('Notes',
        function($resource, $location) {

            var url = $location.absUrl().split('/')[2];


            var random = (new Date()).toString();

            return $resource('http://' + url + ':3000/api/notes/:id' + "?cb=" + random, {id: '@_id'}, {
                'query':  {method:'GET', isArray:true},
                'get':    {method:'GET'},
                'update': {method:'PUT'},
                'save':   {method:'POST'},
                'remove': {method:'DELETE'},
                'delete': {method:'DELETE'}
            });
        }
    ).factory('Playlists',
    function($resource, $location) {

        var url = $location.absUrl().split('/')[2];

        //console.log(url);


        return $resource('http://' + url + ':3000/api/playlists/:id', {id: '@_id'}, {
            'query':  {method:'GET', isArray:true},
            'get':    {method:'GET'},
            'update': {method:'PUT'},
            'save':   {method:'POST'},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'}
        });
    }
).factory('Favourites',
    function($resource, $location) {

        var url = $location.absUrl().split('/')[2];
        var random = (new Date()).toString();

        return $resource('http://' + url + ':3000/api/favourites/:id' + "?cb=" + random, {id: '@_id'}, {
            'query':  {method:'GET', isArray:true},
            'get':    {method:'GET'},
            'update': {method:'PUT'},
            'save':   {method:'POST'},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'}
        });
    }
).factory('Effects',
    function($resource, $location) {

        var url = $location.absUrl().split('/')[2];
        var random = (new Date()).toString();

        return $resource('http://' + url + ':3000/api/effects/:id', {id: '@_id'}, {
            'query':  {method:'GET', isArray:true},
            'get':    {method:'GET'},
            'update': {method:'PUT'},
            'save':   {method:'POST'},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'}
        });
    }
).factory('Songs',
    function($resource, $location) {

        var url = $location.absUrl().split('/')[2];
        var random = (new Date()).toString();

        return $resource('http://' + url + ':3000/api/songs/:id' + "?cb=" + random, {id: '@_id'}, {
            'query':  {method:'GET', isArray:true},
            'get':    {method:'GET'},
            'update': {method:'PUT'},
            'save':   {method:'POST'},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'}
        });
    }
).factory('Movies',
    function($resource, $location) {

        var url = $location.absUrl().split('/')[2];
        var random = (new Date()).toString();

        return $resource('http://' + url + ':3000/api/movies/:id' + "?cb=" + random, {id: '@_id'}, {
            'query':  {method:'GET', isArray:true},
            'get':    {method:'GET'},
            'update': {method:'PUT'},
            'save':   {method:'POST'},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'}
        });
    }
).controller('GridBottomSheetCtrl', function($scope, $rootScope, $mdDialog, $mdBottomSheet, Effects, Item, Nodes, Videos, $mdToast, $mdSidenav, Favourites) {

    $scope.data = Item;
    $scope.nodes = Nodes.getConnectedNodes(Item._id);

    $scope.sortedNodes = [];

    $scope.playLoad = function(video){
        var time = getTime();
        var urlParam = window.location.pathname;
        var roomIDparam = urlParam.substr(1);

        var videoData = "http://" + $rootScope.ipDatabase + ":3000/export/effects/" + video._id + ".mp4";

        console.warn(roomIDparam);

        socket.emit('change video', {
            room: roomIDparam,
            videoId: videoData,
            time: time
        });

        $mdBottomSheet.hide();

    }


    $scope.playPre = function(video){
        let timeBegin = document.getElementById("preVideo-fuck").currentTime;


        var time = getTime();
        var urlParam = window.location.pathname;
        var roomIDparam = urlParam.substr(1);

        var videoData = "http://" + $rootScope.ipDatabase + ":3000/export/effects/" + video._id + ".mp4";

        console.warn(timeBegin);

        socket.emit('change video', {
            room: roomIDparam,
            videoId: videoData,
            time: time,
            timeBegin: timeBegin
        });

        let videoNow = document.getElementById("html5src");
        
        $mdBottomSheet.hide().then(function () {


            $mdSidenav("left")
                .open()
                .then(function () {
                    videoNow.currentTime = timeBegin;
                });
        });
    };

     $scope.favouriteAdd = function() {
        $scope.favouriteData = new Favourites();
        $scope.favouriteData.youtubeID = $scope.data.youtubeID;
        $scope.favouriteData.itemId = $scope.data._id;

        let savePromise = $scope.favouriteData.$save();
        savePromise.then(function(data2) {
            $mdDialog.hide();
            $mdToast.show(
                $mdToast.simple()
                    .textContent("Added to favourites")
                    .position("top right")
                    //.theme("success-toast")
                    .hideDelay(3000)
            );
        });
    }


    $scope.deleteFavouriteFromBot = function() {
        $scope.favouriteDelete = Favourites.get({id: $scope.data.favouriteId}, function () {
            $scope.favouriteDelete.$delete(function() {

                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Deleted from favourites")
                        .position("top right")
                        .hideDelay(3000)
                );
            });
        });

    }

    function showEditDialogController($scope, $mdDialog, data, $mdToast){
        let videoToEdit = Videos.api.get({id: data._id});
        $scope.data = {};
        $scope.data.youtubeTags = [];

        videoToEdit.$promise.then(function(dataToEdit) {
            $scope.data = dataToEdit;
        });

        $scope.save = function() {
            let savePromise2 = $scope.data.$save();
            savePromise2.then(function(data2) {
                $mdDialog.hide();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Saved")
                        .position("top right")
                        //.theme("success-toast")
                        .hideDelay(3000)
                );
            });
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

    $scope.showEditDialog = function(ev){
        $mdDialog.show({
            controller: showEditDialogController,
            templateUrl: '/assets/edit-dialog.html',
            //templateUrl: '/templates/network/periodic.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals: {
                data: Item
            }
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
                $scope.activeMap = false;
            }, function() {
                $scope.status = 'You cancelled the dialog.';
                $scope.activeMap = false;
            });
    }

        setTimeout(function () {
            document.getElementById('preVideo').innerHTML = '';

            if(Item.shape === "image"){
                let clip = document.createElement('video');
                document.getElementById('preVideo').innerHTML = '';

                $scope.playPreVideoUrl = "http://" + $rootScope.ipDatabase + ":3000/export/effects/" + Item._id + ".mp4";
                clip.id       = 'preVideo-fuck';
                clip.controls = 'controls';
                clip.src      = $scope.playPreVideoUrl;
                clip.type     = 'video/mp4';
                document.getElementById('preVideo').appendChild(clip);
            } else {
                Item.audioUrl = "http://" + $rootScope.ipDatabase +":3000/export/songs/" + Item._id + ".mp3";

                var sound      = document.createElement('audio');
                document.getElementById('preVideo').innerHTML = '';
                sound.id       = 'preAudio-player';
                sound.controls = 'controls';
                sound.src      = Item.audioUrl;
                sound.type     = 'audio/mpeg';
                document.getElementById('preVideo').appendChild(sound);
            }
        }, 900);


   /* Nodes.forEach(function(node) {
        let tempVideo = {};
        tempVideo = Effects.get({id: node});
        tempVideo.$promise.then(function(data) {
            data.image = "http://" + $rootScope.ipDatabase + ":3000/export/imgs/" + data._id + ".png";
            $scope.sortedNodes.push(data);
        });
    });*/

    $scope.listItemClick = function($index) {
        var clickedItem = $scope.nodes[$index];
        $mdBottomSheet.hide(clickedItem);
    };
}).controller('MainCtrl', function (moment, $mdToast, Effects, Notes, Playlists, $scope, $mdSidenav, $rootScope, $http, $location, $log, $mdDialog, Videos, $mdBottomSheet, Movies) {
    $scope.selectedVideoData = {};


    $scope.loadRoom23 = function() {
        alert("now");

        // Join room
        socket.emit('new room', 23, function(data) {
            // This should only call back if the client is the host
            if (data) {
                console.log("Host is syncing the new socket!")
                syncVideo(23)
            }
        });

        roomnum = 23;
    }

    var nodeIds, shadowState, nodesArray, nodes, edgesArray, edges, network;

    $http.get('/localIP').then(function(data) {
        // you can do some processing here
        $rootScope.ipDatabase = data.data.local.toString();
        $scope.ipDataAdress = $rootScope.ipDatabase;
    });

    $scope.setLastTime = function() {
        var videoObject = document.getElementById("html5src");
        console.log($scope.videoPlayingNow);
        console.warn($scope.videoPlayingNow);

        videoObject.currentTime = $scope.videoPlayingNow.lastTime;
    };

    $scope.selectedVideoData = null;

    $scope.loadMovie = function(data) {
        let videoData = "http://" + $scope.ipDataAdress + ":3000/export/movies/" + data._id + ".mp4";

        changeVideo(roomnum, videoData);

        $mdSidenav("left")
            .open()
            .then(function () {

            });
    }
    $scope.loadEffect = function(data) {
        $scope.searchEffects = "";

        var videoData = "http://" + $scope.ipDataAdress + ":3000/export/effects/" + data.id + ".mp4";

        changeVideo(roomnum, videoData);

        $mdSidenav("left")
            .open()
            .then(function () {

            });
    };

    $scope.loadVideo = function(data) {
        $scope.searchNodes = "";

        var videoData = "http://" + $scope.ipDataAdress + ":3000/uploads/" + data.youtubeID + ".mp4";
        var videoObject = document.getElementById("html5src");

        Videos.callIp()
            .then(function(dataIp) {
                $scope.ipDataAdress = dataIp;
                $rootScope.ipDatabase = $scope.ipDataAdress;

                if($scope.videoPlayingNow) {
                    var updateVideoTime = Videos.api.get({id: $scope.videoPlayingNow._id});
                    updateVideoTime.$promise.then(function(xx) {

                        const dayInSeconds= 24 * 60 * 60 * 1000;
                        updateVideoTime.lastTime = videoObject.currentTime;
                        updateVideoTime.lastTimePlayed = new Date();
                        updateVideoTime.$update(function() {
                            //get new and compare
                            changeVideo(roomnum, videoData);

                            $mdSidenav("right")
                                .close()
                                .then(function () {
                                    $mdSidenav("left")
                                        .open()
                                        .then(function () {
                                            $scope.videoPlayingNow = data;

                                            if(typeof data.lastTimePlayed != null) {
                                                if (((new Date) - (new Date(data.lastTimePlayed))) < dayInSeconds) {
                                                    console.error("less then 24h");
                                                    //videoObject.play();

                                                } else {
                                                    console.error("loooooonger baby")
                                                    //videoObject.play();
                                                }
                                            }

                                            $scope.selectedVideoData = null;

                                            /*$mdToast.show(
                                                $mdToast.simple()
                                                    .textContent("Got it!")
                                                    .position("top center")
                                                    .theme("success-toast")
                                                    .hideDelay(666)
                                            );*/
                                        });
                                });
                        });
                    });
                } else {
                    //copy !!! fixthat
                    //get new and compare
                    changeVideo(roomnum, videoData);

                    $mdSidenav("right")
                        .close()
                        .then(function () {
                            $mdSidenav("left")
                                .open()
                                .then(function () {

                                    $scope.videoPlayingNow = data;
                                    $scope.selectedVideoData = null;

                                    //videoObject.play();
                                    /*$mdToast.show(
                                        $mdToast.simple()
                                            .textContent("Got it!")
                                            .position("top left")
                                            .theme("success-toast")
                                            .hideDelay(666)
                                    );*/
                                });
                        });
                }
            });
    };

    Videos.callRandom().then(function () {
        alert("callRandom")
    });

    $scope.startNetwork = function() {
        // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes



        // create an array with nodes
        nodesArray = [

        ];
        nodes = new vis.DataSet(nodesArray);

        // create an array with edges
        edgesArray = [

        ];
        edges = new vis.DataSet(edgesArray);

        // create a network
        var container = document.getElementById('playlistsNetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            nodes: {
                borderWidth:2,
                size:33,
                shadow:true,
                color: {
                    border: '#FFFFFF',
                    background: '#666666'
                },
                font:{color:'#eeeeee'}
            },
            edges: {
                color: '#fffff',
                shadow:true,
                arrows: {to : true }
            },
            interaction: {
                dragNodes: false
            }
        };
        network = new vis.Network(container, data, options);


        network.on("click", function (params) {
            let selectedObject = this.getNodeAt(params.pointer.DOM);

            if(typeof selectedObject !== "undefined" || selectedObject != null) {
                params.event = "[original event]";

                let thisShitNotGood = this;
                let thisShit = this.getNodeAt(params.pointer.DOM);
                console.log(thisShit);

                $scope.noteToPlay = Effects.get({id: thisShit}, function () {
                    $scope.noteToPlay.$promise.then(function(data) {
                        $scope.selectedVideoData = data;

                        $scope.alert = '';
                        $mdBottomSheet.show({
                            templateUrl: '/assets/bottom-videos.html',
                            controller: 'GridBottomSheetCtrl',
                            clickOutsideToClose: true,
                            locals: {
                                Item: data,
                                Nodes: thisShitNotGood
                            }
                        }).then(function(clickedItem) {

                            $scope.clickNextSong(clickedItem);

                        }).catch(function(error) {
                            // User clicked outside or hit escape
                        });

                    });
                });
            }
        });


        /*network.on("doubleClick", function (params) {
            let selectedObject = this.getNodeAt(params.pointer.DOM);

            if(typeof selectedObject !== "undefined" || selectedObject != null) {
                //$rootScope.selectedSong = selectedObject;
                $scope.selectedTabIndex = 0;
                params.event = "[original event]";
                //console.log('returns: ' + this.getNodeAt(params.pointer.DOM));
                //$scope.toggleLeft(this.getNodeAt(params.pointer.DOM));

                Videos.callIp()
                    .then(function(dataIp) {
                        $scope.ipDataAdress = dataIp;
                        $rootScope.ipDatabase = $scope.ipDataAdress;
                        $scope.noteToPlay = Videos.api.get({id: selectedObject});
                        $scope.noteToPlay.$promise.then(function(data) {

                            $scope.selectedVideoData = data;
                            $mdSidenav("right")
                                .open()
                                .then(function () {
                                    document.getElementById('song').innerHTML = '';

                                    if(data.shape === "image"){
                                        $scope.videoUrl = "http://" + $scope.ipDataAdress +":3000/uploads/" + data.youtubeID + ".mp4";

                                        var sound = document.createElement('video');
                                        document.getElementById('song').innerHTML = '';
                                        sound.id       = 'video-player';
                                        sound.controls = 'controls';
                                        sound.src      = $scope.videoUrl;
                                        sound.type     = 'video/mp4';
                                        document.getElementById('song').appendChild(sound);
                                    } else {
                                        $scope.audioUrl = "http://" + $scope.ipDataAdress +":3000/uploads/" + data.youtubeID + ".mp3";

                                        var sound      = document.createElement('audio');
                                        document.getElementById('song').innerHTML = '';
                                        sound.id       = 'audio-player';
                                        sound.controls = 'controls';
                                        sound.src      = $scope.audioUrl;
                                        sound.type     = 'audio/mpeg';
                                        document.getElementById('song').appendChild(sound);
                                    }
                                });
                        });
                    });
            }
        });*/

        $scope.clickNextSong = function(id) {
            if (typeof id !== "undefined" || id != null) {
                let connectedNodes = this.getConnectedNodes(id);

                setTimeout(function () {

                    // TODO: focus network and fire click action
                    Videos.callIp()
                        .then(function(data) {
                            $scope.ipDataAdress = data;
                            $rootScope.ipDatabase = $scope.ipDataAdress;
                            $scope.noteToPlay = Videos.api.get({id: id});
                            $scope.noteToPlay.$promise.then(function (data) {

                                $scope.selectedVideoData = data;

                            });
                        });
                },1000);


            }
        }



    };

    function objectToArray(obj) {
        return Object.keys(obj).map(function (key) {
            obj[key].id = key;
            return obj[key];
        });
    }

    /*Videos.callIp()
        .then(function(data){
            $scope.ipDataAdress = data;
            $rootScope.ipDatabase = $scope.ipDataAdress;

           /!* socket2 = new io("http://" + $scope.ipDataAdress + ':8000');*!/
            $scope.videos = Videos.api.query();
            $scope.videos.$promise.then(function(data) {
                var filtered = data.filter(function(el) { return el.shape != "circularImage"; });
                $scope.videosData = filtered.map(function (obj) {
                    return {
                        image: "http://" + $scope.ipDataAdress + ":3000/uploads/" + obj.youtubeID + ".png",
                        _id: obj._id,
                        tags: obj.youtubeTags,
                        youtubeID: obj.youtubeID,
                        createdAt: obj.createdAt,
                        lastTime: obj.lastTime,
                        lastTimePlayed: obj.lastTimePlayed
                    };
                });
            });
        }, function(error){
            console.alert(error);
        });*/

    $scope.sliderOpacityChanged = function(data) {
        console.warn(data);
        /*socket2.emit('slider', {
            level: data
        });*/
    };

    $scope.showVideos = function() {
        $scope.selectedTabIndex = 2;

        $scope.playlistList = Playlists.query();

        $scope.playlistList.$promise.then(function(data) {
            $scope.playlistListData = data;
        });

        Videos.callIp()
            .then(function(data){
                $scope.ipDataAdress = data;
                $rootScope.ipDatabase = $scope.ipDataAdress;

                $scope.videos = Videos.api.query();
                $scope.videos.$promise.then(function(data) {
                    var filtered = data.filter(function(el) { return el.shape != "circularImage"; });
                    $scope.videosData = filtered.map(function (obj) {
                        return {
                            image: "http://" + $scope.ipDataAdress + ":3000/uploads/" + obj.youtubeID + ".png",
                            _id: obj._id,
                            tags: obj.youtubeTags,
                            youtubeID: obj.youtubeID,
                            createdAt: obj.createdAt,
                            lastTime: obj.lastTime,
                            lastTimePlayed: obj.lastTimePlayed,
                            dateNow: ((new Date().getTime() / 1000) - (new Date(obj.lastTimePlayed).getTime() / 1000)),
                            dateNowParsed: ((new Date().getTime() / 1000) - (new Date(obj.lastTimePlayed).getTime() / 1000)).toFixed(0),
                            oneDayInSeconds: moment.duration(10, 'hours').as('seconds')
                        };
                    });

                    $mdSidenav("left")
                        .close()
                        .then(function () {
                            $mdSidenav("right")
                                .open()
                                .then(function () {

                                });
                        });
                });
            }, function(error){
                console.alert(error);
            })
    };

    $scope.setTheData = function(nodesArrayData, edgesArrayData) {
        var nodesArrayDataSorted = nodesArrayData.map(function (obj) {
            //console.log(obj.title[0] + " - " + obj.color[0][0].main);
            //console.log(obj);

            if(obj.shape === "image") {
                return {
                    image: "http://" + $scope.ipDataAdress + ":3000" + obj.image,
                    id: obj.id,
                    shape: obj.shape,
                    //group: obj.group[0],
                    //tip: "fuck jej",
                    color: "red"
                };
            } else {
                return {
                    image: "http://" + $scope.ipDataAdress + ":3000" + obj.image,
                    id: obj.id,
                    shape: obj.shape,
                    label: obj.label
                    //group: obj.group[0],
                    //tip: "fuck jej",
                    //color: obj.genre[0][0].color[0][0]
                };
            }
        });

        //console.log(edgesArrayData);

        nodes = new vis.DataSet(nodesArrayDataSorted);
        edges = new vis.DataSet(edgesArrayData);
        network.setData({nodes:nodes, edges:edges})
    };

    $scope.startNetwork();
    $scope.playlistIdToEdit = "";

    $scope.playlistList = Playlists.query();
    $scope.playlistList.$promise.then(function(data) {
        $scope.playlistListData = data;
    });

    $scope.changePlaylist = function(id) {
        $scope.playlistIdToEdit = id;

        $scope.playlistToEdit = Playlists.get({id: $scope.playlistIdToEdit});

        $scope.playlistToEdit.$promise.then(function(data) {
            $scope.playlistToEdit = data;

            $mdSidenav("right")
                .toggle()
                .then(function () {
                    $scope.setTheData($scope.playlistToEdit.nodes, $scope.playlistToEdit.edges);
                    network.stabilize();
                });
        });
    };

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug($rootScope.ipDatabase);
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

        $scope.toggleRight = function(){
                $mdSidenav('right').open()
                    .then(function () {

                        $scope.playlistList = Playlists.query();
                        $scope.playlistList.$promise.then(function(data) {
                            $scope.playlistListData = data;
                            $scope.selectedTabIndex = 1;

                            $scope.moviesList = Movies.query();
                            $scope.moviesList.$promise.then(function(moviesData) {
                                $scope.moviesListData = moviesData;

                                $scope.effectsList = Effects.query();
                                $scope.effectsList.$promise.then(function(effectsData) {

                                    $scope.effectsListData = {};

                                    $scope.effectsListData = effectsData.map(function (obj) {
                                        //console.log(obj.title[0] + " - " + obj.color[0][0].main);
                                        return {
                                            image: "http://" + $rootScope.ipDatabase + ":3000/export/imgs/" + obj._id + ".png",
                                            id: obj._id,
                                            tags: obj.tags,
                                            genre: obj.genre,
                                            //group: obj.group[0],
                                            //tip: "fuck jej",
                                            //color: obj.genre[0][0].color[0][0]
                                        };
                                    });
                                 });

                        /*Videos.callIp()
                            .then(function(data){
                                $scope.ipDataAdress = data;
                                $rootScope.ipDatabase = $scope.ipDataAdress;

                                $scope.videos = Videos.api.query();
                                $scope.videos.$promise.then(function(data) {
                                    var filtered = data.filter(function(el) { return el.shape != "circularImage"; });
                                    $scope.videosData = filtered.map(function (obj) {
                                        return {
                                            image: "http://" + $scope.ipDataAdress + ":3000/uploads/" + obj.youtubeID + ".png",
                                            _id: obj._id,
                                            tags: obj.youtubeTags,
                                            youtubeID: obj.youtubeID,
                                            createdAt: obj.createdAt,
                                            lastTime: obj.lastTime,
                                            lastTimePlayed: obj.lastTimePlayed
                                        };
                                    });



                                });
                            }, function(error){
                                console.alert(error);
                            })*/
                            });
                        });
            });
        };

        $scope.isOpenRight = function(){
            return $mdSidenav('right').isOpen();
        };

        $http.get('/localIP').then(function(data) {
            // you can do some processing here
            $scope.ipServer = data.data.local;

            let urlParam = window.location.pathname;
            $scope.roomIDparam = urlParam.substr(1);

            // console.warn($scope.roomIDparam);
        });

        var parser = new UAParser();
        var dd = parser.getResult();
        //$scope.deviceParsedData = dd.browser.name + ": " + dd.os.name + " " + dd.os.version;

        $scope.deviceParsedData =  "Control - " + dd.os.name + " (" + dd.browser.name + ")";
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

        function dialogController($scope, $mdDialog, $rootScope, Favourites){
            $scope.playPre = function(video){
                var time = getTime();
                var urlParam = window.location.pathname;
                var roomIDparam = urlParam.substr(1);

                var videoData = "http://" + $rootScope.ipDatabase + ":3000/uploads/" + video.youtubeID + ".mp4";


                $scope.cancel();

                $mdSidenav("left")
                    .open()
                    .then(function () {
                        socket.emit('change video', {
                            room: roomIDparam,
                            videoId: videoData,
                            time: time
                        });
                    });
            };



            $scope.favouritesList = Favourites.query();

            $scope.favouritesList.$promise.then(function(data) {
                $scope.favouritesListData = data;
                $scope.favourites = $scope.favouritesListData.map(function (obj) {
                    return {
                        img: "http://" + $rootScope.ipDatabase + ":3000/uploads/" + obj.youtubeID + ".png",
                        id: obj._id,
                        itemId: obj.itemId,
                        youtubeID: obj.youtubeID
                    };
                });
            });

            $scope.deleteFavourite = function(item) {
                $scope.favouriteDelete = Favourites.get({id: item.id}, function () {
                    $scope.favouriteDelete.$delete(function() {
                        $scope.hide();

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Deleted from favourites")
                                .position("top right")
                                .hideDelay(3000)
                        );
                    });
                });
            }

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
                clickOutsideToClose: true,
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
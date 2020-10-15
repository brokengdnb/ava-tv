> Then I take AVA & EMI for a walk... we talk and end up in some random room of unlimited posibilities... as a DJ as well as video DJ in one... 3,2,1 and here... we... go...

---

- [Demo](#demo)
- [Download](#download)
- [Dependencies](#dependencies)
- [Run](#run)
- [Index](#index)
- [Idea](#idea)
- [TODO](#todo)
- [Support](#support)
- [License](#license)

## Demo



## Download

- [AVA-TV-1.0.zip (~70MB)](https://github.com/brokengdnb/ava-tv/releases/tag/v1)

> MD5
- ...

## Dependencies

 - AVA-Data

## Run

```bash
git clone https://github.com/brokengdnb/ava-tv && cd ava-tv/
npm install
bower install
npm run start
```
> just like that... TV & Control runs on [http://localhost/](http://localhost/ "http://localhost/") but first you need to start AVA-Data on port 3000 to have some data to stream...

## Index

Is split in two parts:

  - TV / Projector

[![beamer](https://github.com/brokengdnb/ava-tv/blob/master/demo/ava-TV-beamer.png?raw=true "beamer")](https://github.com/brokengdnb/ava-tv/demo/ava-TV-beamer.png?raw=true "beamer")

  - Controller

[![iphone](https://github.com/brokengdnb/ava-tv/blob/master/demo/ava-tv-iphone.png?raw=true "beamer")](https://github.com/brokengdnb/ava-tv/demo/ava-tv-iphone.png?raw=true "beamer")

TV will generate random ID for a room & controller link to connect each other. Each of them can be multiplied by sharing URL link to diferent devices or scanning QR code:

```javascript
// qr code is changing on a go by IP address of a streaming server and ID of a room
$scope.idInputChange = function(newData) {
	$http.get('/localIP').then(function(data) {
		$scope.QRurl = "http://" + data.data.local + "/" + newData.idRoom;
	});
};

```

The app will get it's own IP adsress from local network as well as IP of database so we can have many televisions connected to one controller as well as we can have many controllers that control one TV, for example if you cannot find your TV remote control... just create new one from your phone/tablet or am I going from bedroom to kitchen? so I transform my phone/control into TV so I can continue on a go while I'm doing something else in somewhere else.

```javascript
// server.js get requsted /roomID and render front-end (control.html)
app.get('/:room', function(req, res) {
	given_room = req.params.room;
	res.sendFile(__dirname + '/control.html');
});

// where basic JS get roomID, transoport to angularJS and socket.IO do the rest
let urlParam = window.location.pathname;
$scope.roomIDparam = urlParam.substr(1);
```


Then we got a 'roomID' where all is heppening. So the ID of a room can be a string or number or combination of both [a-Z, 1-9] set or randomly generated for each room where is some number of TVs and some number of connected controlers. Hope you catching my drift:

```javascript
// Sync video data throw all connected devices
socket.on('sync video', function(data) {
	if (io.sockets.adapter.rooms['room-' + socket.roomnum] !== undefined) {
		let roomnum = data.room
		let currTime = data.time
		let state = data.state
		let videoId = data.videoId

		// 0 = YouTube, 1 = Daily Motion, 2 = Vimeo, 3 = local file
		let playerId = 3

		// var videoId = io.sockets.adapter.rooms['room-'+roomnum].currVideo
		io.sockets.in("room-" + roomnum).emit('syncVideoClient', {
			time: currTime,
			state: state,
			videoId: videoId,
			playerId: playerId
		})
	}
});
```

This syncing room ID then time, state (play/pause), file URL and playerId (YouTube,DM,Vimeo or local) stream... not the media itself and that is different. So you can be wacher (user) or you can be admin of the same stream on a go, change URL, seek throw or pause/play... but there is only one admin who can control the main stream at one time for "unlimited" number of users. And every user can be switched to be an admin and takeover main stream for the other users. Ja? Like dat:

```javascript
// Change host
    socket.on('change host', function(data) {
        if (io.sockets.adapter.rooms['room-' + socket.roomnum] !== undefined) {
            console.log(io.sockets.adapter.rooms['room-' + socket.roomnum])
            let roomnum = data.room
            let newHost = socket.id
            let currHost = io.sockets.adapter.rooms['room-' + socket.roomnum].host

            // If socket is already the host or not!
            if (newHost != currHost) {
                console.log("I want to be the host and my socket id is: " + newHost);
                //console.log(io.sockets.adapter.rooms['room-' + socket.roomnum])

                // Broadcast to current host and set false
                socket.broadcast.to(currHost).emit('unSetHost')
                // Reset host
                io.sockets.adapter.rooms['room-' + socket.roomnum].host = newHost
                // Broadcast to new host and set true
                socket.emit('setHost')

                io.sockets.adapter.rooms['room-' + socket.roomnum].hostName = socket.username
                // Update host label in all sockets
                io.sockets.in("room-" + roomnum).emit('changeHostLabel', {
                    username: socket.username
                })
                // Notify alert
                socket.emit('notify alerts', {
                    alert: 1,
                    user: socket.username
                })
            }
        }
    });
```

## Idea

> The idea started in January 2018, technology and libraries comes by summer thanks to project Vynchronize, the idea is simple... control multiple end-points (AUDIO & VIDEO) from multiple devices in multiple "rooms" and if you can, please render my playlists as well... so far only 2D but I already found a libraries for 360 VR... that will take a time but turtle will always win a race...



[![MVC](https://github.com/brokengdnb/ava-data/blob/master/demo-img/emi.png?raw=true "preview")](https://github.com/brokengdnb/ava-data/demo-img/emi.png?raw=true "preview")


### Todo
- add effects (fade in/out) between changes of a stream... soft does not work, so hard one into media itself? Or with implementing other players do effect between them as well?
- add dual-bind connection into EMI for getting time / syncing decks and loading songs into selected deck from this project / playlist
- add list of connected devices localy in room & globaly for all
- add function for changing player on go, like between local server and youtube
- remotly control MUTE function of TVs and selecting wich one in wich room
- update cache button / new data request
- export selected playlist for offline local use (PWA?) without database
- fix favourites new URL data
- fix song's connected nodes

## Support

- **OS X (tested on Mojave 10.14.6)**
- **iOS > 10 (tested on iPhone 5)**
- Linux & Android > 6
- ~~Windows~~  => *(I don't have one and I will **NOT** support this platform, never ever, your choise = your problem)"*

## License

The MIT License.

Copyright (c) 2020 BrokenG
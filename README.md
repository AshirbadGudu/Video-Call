# Video-Call
Creating Video Call app in Peer js with Javascript


## Creating Some Global Variables
```
var MY_STREAM;
var peerList = [];
```

## Access All Required DOM Elements

```
const videoCallBtn = document.getElementById("videoCallBtn");
const stopVideoCallBtn = document.getElementById("stopVideoCallBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const peerId = document.getElementById("peerId");
const msg = document.getElementById("msg");
```

## Create Peer Connection

```var peer = new Peer();```

## Listen Peer Open Event

```   
peer.on('open', (id) => msg.innerHTML = "Youe Video Call id: " + id);
```

## Listen Peer Call Event
```
peer.on('call', (call) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
        }
    }).then((stream) => {
        MY_STREAM = stream;
        addLocalVideo(stream);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
            if (!peerList.includes(call.peer)) {
                addRemoteVideo(remoteStream);
                peerList.push(call.peer);
            }
        })

    }).catch((err) => console.log(err))
});
```
## Add Event To Video Call Button
```
videoCallBtn.addEventListener('click', () => {
    let remotePeerId = peerId.value;
    msg.innerHTML = "Connecting to " + remotePeerId;
    callPeer(remotePeerId);
});
```
## Add Event to stop call button
```     
stopVideoCallBtn.addEventListener('click', () => stopVideo())
```

## Create Video Calling Function
```       
const callPeer = (id) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
        }
    }).then((stream) => {
        MY_STREAM = stream;
        addLocalVideo(stream);
        let call = peer.call(id, stream);

        call.on('stream', (remoteStream) => {
            if (!peerList.includes(call.peer)) {
                addRemoteVideo(remoteStream);
                peerList.push(call.peer);
            }
        })
    }).catch((err) => console.log(err));
}
```
## Stop Video Call Function
```
const stopVideo = () => {
    const localTracks = document.querySelector("#localVideo").srcObject.getTracks();
    localTracks.forEach((track) => track.stop());
    const remoteTracks = document.querySelector("#remoteVideo").srcObject.getTracks();
    remoteTracks.forEach((track) => track.stop());
};
```
## Create Remote Stream Video
```
const addRemoteVideo = (remoteStream) => remoteVideo.srcObject = remoteStream
```
## Create local Stream Video
```
const addLocalVideo = (localStream) => localVideo.srcObject = localStream
```

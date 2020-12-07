/* -------------------------------------------------------------------------- */
/*                          Creating Global Variables                         */
/* -------------------------------------------------------------------------- */

const MY_GLOBALS = {
  MY_STREAM: null,
  PEER_LIST: [],
  METING_ID: null,
};

/* -------------------------------------------------------------------------- */
/*                     Accessing All Required DOM Elements                    */
/* -------------------------------------------------------------------------- */

const call_now_btn = document.querySelector(".call_now_btn");
const end_call_btn = document.querySelector(".end_call_btn");
const change_layout_btn = document.querySelector(".change_layout_btn");
const share_btn = document.querySelector(".share_btn");

const remote_video = document.querySelector(".remote_card_video");
const local_video = document.querySelector(".local_card_video");

const remote_id = document.querySelector("#remote_id");

const video_container = document.querySelector(".video_container");

/* -------------------------------------------------------------------------- */
/*                           Change Layout Function                           */
/* -------------------------------------------------------------------------- */

change_layout_btn.addEventListener("click", (e) => {
  video_container.classList.toggle("layout_1");
  video_container.classList.toggle("layout_2");
});

/* -------------------------------------------------------------------------- */
/*                         Share and Copy ID Function                         */
/* -------------------------------------------------------------------------- */

share_btn.addEventListener("click", () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Join With Video",
        url: "https://expressvideocall.netlify.app/",
        text: "My Meeting ID: " + MY_GLOBALS.METING_ID,
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    navigator.clipboard.writeText(MY_GLOBALS.METING_ID);
    document.execCommand("copy");
  }
});

/* -------------------------------------------------------------------------- */
/*                           Create Peer Connection                           */
/* -------------------------------------------------------------------------- */

const peer = new Peer();

/* -------------------------------------------------------------------------- */
/*                           Listen Peer Open Event                           */
/* -------------------------------------------------------------------------- */

peer.on("open", (id) => (MY_GLOBALS.METING_ID = id));

/* -------------------------------------------------------------------------- */
/*                           Listen Peer Call Event                           */
/* -------------------------------------------------------------------------- */
peer.on("call", (call) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    .then((stream) => {
      MY_GLOBALS.MY_STREAM = stream;
      addLocalVideo(stream);
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        if (!MY_GLOBALS.PEER_LIST.includes(call.peer)) {
          addRemoteVideo(remoteStream);
          MY_GLOBALS.PEER_LIST.push(call.peer);
        }
      });
    })
    .catch((err) => console.log(err));
});

/* -------------------------------------------------------------------------- */
/*                       Add Event To Video Call Button                       */
/* -------------------------------------------------------------------------- */

call_now_btn.addEventListener("click", () => {
  const id = remote_id.value;
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    .then((stream) => {
      MY_GLOBALS.MY_STREAM = stream;
      addLocalVideo(stream);
      const call = peer.call(id, stream);
      call.on("stream", (remoteStream) => {
        if (!MY_GLOBALS.PEER_LIST.includes(call.peer)) {
          addRemoteVideo(remoteStream);
          MY_GLOBALS.PEER_LIST.push(call.peer);
        }
      });
    })
    .catch((err) => console.log(err));
});

/* -------------------------------------------------------------------------- */
/*                        Add Event to End call button                        */
/* -------------------------------------------------------------------------- */

end_call_btn.addEventListener("click", () => {
  const localTracks = local_video.srcObject.getTracks();
  const remoteTracks = remote_video.srcObject.getTracks();
  localTracks.forEach((track) => track.stop());
  remoteTracks.forEach((track) => track.stop());
});

/* -------------------------------------------------------------------------- */
/*                         Create Remote Stream Video                         */
/* -------------------------------------------------------------------------- */

const addRemoteVideo = (stream) => (remote_video.srcObject = stream);

/* -------------------------------------------------------------------------- */
/*                          Create Local Stream Video                         */
/* -------------------------------------------------------------------------- */

const addLocalVideo = (stream) => (local_video.srcObject = stream);

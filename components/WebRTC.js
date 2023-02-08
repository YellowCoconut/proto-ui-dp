import React from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import useSocket from "../pages/hooks/useSocket";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        "stun:openrelay.metered.ca:80",
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun01.sipphone.com",
        "stun:stun.ekiga.net",
        "stun:stun.fwdnet.net",
        "stun:stun.ideasip.com",
        "stun:stun.iptel.org",
        "stun:stun.rixtelecom.se",
        "stun:stun.schlund.de",
        "stun:stunserver.org",
        "stun:stun.softjoys.com",
        "stun:stun.voiparound.com",
        "stun:stun.voipbuster.com",
        "stun:stun.voipstunt.com",
        "stun:stun.voxgratia.org",
        "stun:stun.xten.com",
      ],
    },
  ],
};

export default function WebRTC() {
  useSocket();
  //useRef은 특정컴포넌트에 접근할 수 있는 객체, 초기값 null
  //userRef hook은 내부 데이터가 변경되었을 때 별도로 알리지 않음
  const userVideoRef = useRef();
  const userStreamRef = useRef();
  const peerVideoRef = useRef();
  const webRTCConnRef = useRef(null);
  const socketRef = useRef();
  const hostRef = useRef(false);
  const selectRef = useRef();
  const router = useRouter();
  //State
  const [micSetting, setMicSetting] = useState(true);
  const [cameraSetting, setCameraSetting] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [nickName, setNickName] = useState("");
  const [nickName2, setNickName2] = useState("");
  //닉네임 설정
  const handleNickName = (e) => {
    setNickName(e.currentTarget.value);
  };

  //사이드 이펙트를 수행하기 위한 훅
  //videoRef가 create,update 될 때 실행된다. (props, state가 바뀔 때 마다 getUserCamera함수를 호출한다)
  // umount 시에 실행하고 싶은 함수는 return 함수를 달아준다
  useEffect(() => {
    // 서버 <-> 브라우저 간 socket io 통신 연결
    socketRef.current = io();
    // 초기 room을이름 설정
    setRoomName("Room1");
    console.log("RoomName :", roomName);
    socketRef.current.on("created", handleRoomCreated);

    socketRef.current.emit("join", roomName);
    socketRef.current.on("joined", handleRoomJoined);
    // roomName으로 room을이 없으면 서버는 'created'를 emit한다.
    // room을이 만들어졌고, 다음 사람이 참가하면 서버는 'ready'를 emit한다.
    socketRef.current.on("ready", initiateCall);

    // 참가자가 room을을 떠나면 'leave'를 emit한다.
    socketRef.current.on("leave", onPeerLeave);

    //room을이 가득 찼으면 서버는 'full'을 emit한다.
    socketRef.current.on("full", () => {
      alert("참가하려는 room을이 가득 찼습니다.");
    });

    // client- signaling server 간 offer , answer, ice-candidate 과정
    socketRef.current.on("offer", handleReceivedOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice-candidate", handlerNewIceCandidateMsg);

    // unmmount시 소켓을 끊는다
    return () => socketRef.current.disconnect();
  }, [roomName]);

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const currentCamera = userStreamRef.current.getVideoTracks()[0];

      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;

        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
        selectRef.current.appendChild(option);
        console.log(selectRef.current)
      });
    } catch (e) {
      console.log(e);
    }
  }

  const handleSelect = (e) => {
    handleCameraChange(e.target.value);
    selectRef.current = e.target.value;
  };

  async function handleCameraChange(selected) {
    await getMedia(selected);
    if (webRTCConnRef.current) {
      const videoTrack = userStreamRef.current.getVideoTracks()[0];
      const videoSender = webRTCConnRef.current.getSenders().find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
  }

  async function getMedia(deviceId) {
    const initialConstraints = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraints = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstraints);
      userStreamRef.current = stream;
      userVideoRef.current.srcObject = stream;
      userVideoRef.current.onloadedmetadata = () => {
        userVideoRef.current.play();
      };
      if (!deviceId) {
        console.log("[get Cameras]");
        await getCameras();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleRoomCreated = async () => {
    try {
      console.log("[room created]");
      hostRef.current = true;
      await getMedia();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRoomJoined = async () => {
    try {
      await getMedia();
      socketRef.current.emit("ready", roomName);
      console.log("[emit ready]");
    } catch (e) {
      console.log(e);
    }
  };
  //peer와 연결 생성 시작
  const initiateCall = async () => {
    console.log("[initiateCall]");
    if (hostRef.current) {
      webRTCConnRef.current = makeConnection();
      userStreamRef.current.getTracks().forEach((track) => webRTCConnRef.current.addTrack(track, userStreamRef.current));
      try {
        console.log("[emit offer]");
        const offer = await webRTCConnRef.current.createOffer();
        webRTCConnRef.current.setLocalDescription(offer);
        socketRef.current.emit("offer", offer, roomName);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onPeerLeave = () => {
    //room을에 혼자 남아 있을 경우, 남아 있는 사람이 room을의 주인이 됨
    hostRef.current = true;
    if (peerVideoRef.current.srcObject) {
      // peer의 모든 track 수신을 중지
      peerVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    // leave 한 peer와 연결을 종료
    if (webRTCConnRef.current) {
      webRTCConnRef.current.ontrack = null;
      webRTCConnRef.current.onicecandidate = null;
      webRTCConnRef.current.close();
      webRTCConnRef.current = null;
    }
  };
  //room을 떠날 때
  const leaveRoom = () => {
    socketRef.current.emit("leave", roomName);
    console.log("[emit leave]");
    //유저와 peer 모든 media 수신을 중지
    if (userVideoRef.current.srcObject) {
      userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    //connect이 있는지 확인하고 피어와 기존 연결을 종료
    if (webRTCConnRef.current) {
      webRTCConnRef.current.ontrack = null;
      webRTCConnRef.current.onicecandidate = null;
      webRTCConnRef.current.close();
      webRTCConnRef.current = null;
    }
    router.push("/");
  };

  const makeConnection = () => {
    // RTC Peer Connection 생성
    const connection = new RTCPeerConnection(ICE_SERVERS);
    //icecandidate, track listener 추가
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      console.log("[emit ice-candidate]");
      socketRef.current.emit("ice-candidate", event.candidate, roomName);
    }
  };

  const handleTrackEvent = (event) => {
    peerVideoRef.current.srcObject = event.streams[0];
  };

  const handleReceivedOffer = async (offer) => {
    if (!hostRef.current) {
      webRTCConnRef.current = makeConnection();
      userStreamRef.current.getTracks().forEach((track) => webRTCConnRef.current.addTrack(track, userStreamRef.current));
      webRTCConnRef.current.setRemoteDescription(offer);

      const answer = await webRTCConnRef.current.createAnswer();
      try {
        webRTCConnRef.current.setLocalDescription(answer);
        socketRef.current.emit("answer", answer, roomName);
        console.log("[emit answer]");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleAnswer = (answer) => {
    webRTCConnRef.current.setRemoteDescription(answer).catch((err) => console.log(err));
  };

  // 들어오는 "candidate"를 RTCIceCandidate로 casting
  const handlerNewIceCandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    webRTCConnRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  };

  //마이크 셋팅 변경 버튼 클릭 시
  const changeMicSetting = () => {
    toggleMediaStream("audio", micSetting);
    setMicSetting((prevSetting) => !prevSetting);
  };
  //카메라 셋팅 변경 버튼 클릭 시
  const changeCameraSetting = () => {
    toggleMediaStream("video", cameraSetting);
    setCameraSetting((prevSetting) => !prevSetting);
  };

  //미디어스트리미 옵션 값 변경
  const toggleMediaStream = (type, state) => {
    userStreamRef.current.getTracks().forEach((track) => {
      if (track.kind === type) {
        track.enabled = !state;
      }
    });
  };

  return (
    <div className=" flex flex-col bg-black h-screen">
    <div className="p-10 flex basis-1/4 flex-row">
      <div className="flex flex-row basis-1/2 justify-center">
        <div className="flex flex-row">
          <div className="flex flex-col grow-0 w-60 box-border border-4 text-white text-center">
            <video className="w-96" id="myface" autoPlay playsInline ref={userVideoRef}></video>
            <p className="flex text-3xl justify-center text-white">{nickName}</p>
          </div>
          <div className= "flex flex-col basis-1/5 justify-evenly">
            <input className="mb-5 rounded-full text-center" value={nickName} onChange={handleNickName} placeholder="닉네임을 입력하세요." />        
            <button id="muteBtn" onClick={changeMicSetting} type="button" className="box-border height width mb-5 border-4 text-white">
              {micSetting ? "마이크 음소거" : "마이크 음소거 해제"}
            </button>
            <button id="cameraBtn" onClick={changeCameraSetting} type="button" className="box-border height width mb-5 border-4 text-white">
              {cameraSetting ? "화면 끄기" : "화면 켜기"}
            </button>
            <button onClick={leaveRoom} type="button" className="box-border height width mb-5 border-4 text-white">
              Leave
            </button>
            <select onChange={handleSelect} ref={selectRef}>
              </select>
          </div>
        </div>
        </div>
        <div className="flex flex-row basis-1/2 justify-center">
        <div className="flex flex-row">
          <div className="flex flex-col grow-0 w-60 box-border border-4 text-white text-center">
            <video className="w-96" id="myface" autoPlay playsInline ref={peerVideoRef}></video>
            <p className="flex text-3xl justify-center text-white">{nickName2}</p>
          </div>
          </div>
        </div>
        </div>
        </div>
  );
}

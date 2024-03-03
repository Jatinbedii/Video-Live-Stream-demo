"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
function page() {
  const [socket, setsocket] = useState(null);
  const [myroom, setroom] = useState(null);
  const videoref = useRef(null);
  const canvasref = useRef(null);
  async function enablecam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoref.current) {
      videoref.current.srcObject = stream;
    }
  }

  function workonframe() {
    if (videoref.current.srcObject) {
      const video = videoref.current;
      const canvas = canvasref.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const compressedDataURL = canvas.toDataURL("image/jpeg", 0.5);
      if (myroom != null) {
        socket.emit("videoframe", { video: compressedDataURL });
      }
    }
  }
  useEffect(() => {
    const mysocket = io("http://localhost:3001");
    setsocket(mysocket);
    mysocket.on("joinedroom", ({ room }) => {
      setroom(room);
    });
  }, []);
  useEffect(() => {
    enablecam();
    const intervalId = setInterval(workonframe, 100);
  }, [myroom]);

  return (
    <div className="bg-red-600 h-screen">
      <video ref={videoref} autoPlay playsInline />
      <canvas ref={canvasref} style={{ display: "none" }} />
      <div className="text-white text-3xl">STREAMING</div>
    </div>
  );
}

export default page;

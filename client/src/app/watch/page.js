"use client";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

function page() {
  const canvasref = useRef(null);
  function drawPhoto(videoDataUrl) {
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");

    const video = new Image();
    video.onload = () => {
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(video, 0, 0);
    };
    video.src = videoDataUrl;
  }
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("videoframe", ({ video }) => {
      drawPhoto(video);
    });
  });
  return (
    <div className="h-screen bg-yellow-300">
      <canvas ref={canvasref}></canvas>
      <div className="text-3xl text-black">Watching</div>
    </div>
  );
}

export default page;

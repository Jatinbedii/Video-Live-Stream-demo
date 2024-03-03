import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.get("/", (req, res) => {
  res.send("hello");
});
io.on("connection", (socket) => {
  console.log("connected");
  socket.join("room1");
  socket.emit("joinedroom", { room: "room1" });

  socket.on("videoframe", ({ video }) => {
    socket.to("room1").emit("videoframe", { video });
  });
});
server.listen(3001, () => {
  console.log("server running");
});

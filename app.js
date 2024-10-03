const express = require("express");
const path = require("path");
const { Socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`server on port${PORT}`));

const { Server } = require("socket.io");
const io = new Server(server);
let socketsConnected = new Set();

app.use(express.static(path.join(__dirname, "public")));
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(`user has connected of id ${socket.id}`);
  socketsConnected.add(socket.id);
  socket.on("disconnect", () => onDisconnect(socket));
  socket.on("chat message", (data) => {
    console.log(data.dateTime);
    io.emit("chat message", {
      typer: data.typer,
      msg: data.message,
      dateTime: new Date(data.dateTime),
      id: socket.id,
    });
  });
  var usersNum = socketsConnected.size;
  console.log(usersNum);
  io.emit("user count", usersNum);
  socket.on("typing", (data) => {
    io.emit("typing", {
      feedback: data.feedback,
      id: data.id,
    });
  });
}
function onDisconnect(socket) {
  console.log("user has disconnected", socket.id);
  socketsConnected.delete(socket.id);
  var usersNum = socketsConnected.size;
  console.log(usersNum);
  io.emit("user count", usersNum);
}

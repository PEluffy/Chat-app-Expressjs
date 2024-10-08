const express = require("express");
const { register } = require("module");
const fs = require("fs");
const path = require("path");
const { Socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`server on port${PORT}`));

const { Server } = require("socket.io");
const io = new Server(server);
let socketsConnected = new Set(); // Track connected users using a Set to store socket IDs

app.use(express.json()); // Middleware to parse JSON bodies
app.post("/register", (req, res) => {
  console.log(req);
  const userData = req.body;
  fs.readFile(path.join(__dirname, "user.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading user.json", err);
      return res.static(500).send("server Error");
    }
    let users;
    try {
      users = JSON.parse(data);
    } catch (e) {
      users = [];
    }
    users.push(userData);
    fs.writeFile(
      path.join(__dirname, "user.json"),
      JSON.stringify(users),
      (err) => {
        if (err) {
          console.error("error while writing on a file");
          return res.status(500).send("Server error");
        }
        res.status(201).send("user registered successfully");
      }
    );
  });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory
io.on("connection", onConnected); // Listen for incoming socket connections

function onConnected(socket) {
  console.log(`user has connected of id ${socket.id}`);
  socketsConnected.add(socket.id); // Add new socket to the set of connected users
  socket.on("disconnect", () => onDisconnect(socket)); // Handle socket disconnection
  //client send message to the socket using emit
  socket.on("chat message", (data) => {
    console.log(data.dateTime);
    //sending every websocket about the chat message
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
    //sending typing msg to all websockets
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

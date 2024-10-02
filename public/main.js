const socket = io();
var form = document.getElementById("message-form");
var message = document.getElementById("message-input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (message.value) {
    socket.emit("chat message", message.value);
    message.value = "";
  }
});

socket.on("chat message", function ({ msg, id }) {
  console.log(msg);
  var item = document.createElement("li");
  if (socket.id === id) {
    item.className = "message-right";
  } else {
    item.className = "message-left";
  }
  console.log(socket.id);

  var paragraph = document.createElement("p");
  item.appendChild(paragraph);
  paragraph.textContent = msg;
  document.querySelector("#message-container").appendChild(item);
});

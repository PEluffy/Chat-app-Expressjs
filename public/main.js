const socket = io();
var form = document.getElementById("message-form");
var messageInput = document.getElementById("message-input");
var typer = document.getElementById("name-input");
var feedback = document.getElementById("feedback");
var messageContainer = document.getElementById("message-container");

//when message input is in active state
messageInput.addEventListener("focus", function (e) {
  console.log(typer.value);
  socket.emit("typing", {
    feedback: `${typer.value} is typing ......`,
    id: socket.id,
  });
});
//when being in active state keyy is pressed
messageInput.addEventListener("keypress", function (e) {
  console.log(typer.value);
  socket.emit("typing", {
    feedback: `${typer.value} is typing ......`,
    id: socket.id,
  });
});
//when message input is in inactive state or no action is being performed in that box
messageInput.addEventListener("blur", function (e) {
  socket.emit("typing", {
    feedback: "",
    id: socket.id,
  });
});
//get msg on socket of type 'typing' => when user is typing
socket.on("typing", ({ feedback, id }) => {
  if (socket.id == id) {
    return;
  } else {
    document.querySelector("#feedback").textContent = feedback;
  }
});
//form submit state
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(new Date());
  if (messageInput.value) {
    socket.emit("chat message", {
      typer: typer.value,
      message: messageInput.value,
      dateTime: new Date(),
    });
    messageInput.value = "";
  }
});
//server emits user count when a client is connected
socket.on("user count", function (usersNum) {
  console.log(usersNum);
  document.querySelector("#clients-sum").textContent = usersNum;
});
//socket emits when a msg is send from the user
socket.on("chat message", function ({ msg, id, dateTime, typer }) {
  console.log(msg);
  var item = document.createElement("li");
  var paragraph = document.createElement("p");
  var span = document.createElement("span");
  if (socket.id === id) {
    item.className = "message-right";
  } else {
    item.className = "message-left";
  }
  console.log(socket.id);
  paragraph.className = "message";
  item.appendChild(paragraph);
  paragraph.textContent = msg;
  paragraph.appendChild(span);
  span.className = "date-time-msg";
  span.id = "date-time-msg";
  document.querySelector("#message-container").appendChild(item);
  span.textContent = ` ${typer}  ${new Date(dateTime)}`;
  scrollToBottom();
  moveFeedbackToBottom();
});
//to make the chat box scrollable to the end
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
//moving feedback to the end of message container
function moveFeedbackToBottom() {
  const feedbackElement = document.querySelector("li.message-feedback");
  if (feedbackElement) {
    messageContainer.appendChild(feedbackElement); // Move it to the bottom
  }
}

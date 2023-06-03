const socket = io();

let user="";
async function UserChat() {
  const { value: email } = await Swal.fire({
    title: "Ingresa tu E-mail.",
    input: "text",
    inputLabel: "E-mail",
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "Debes ingresar un E-mail valido!";
      }
    },
  });

  if (email) {
    user = email;
    Swal.fire(`Te llamaras: ${user}`);
  } else {
    Swal.fire(`E-mail no ingresado`);
  }
};
UserChat();

const chatBox = document.getElementById("chatbox");
chatBox.addEventListener("keyup", ({ key }) => {
  let mess = { msg: chatBox.value, user: user };
  if (key == "Enter") {
    socket.emit("message", mess );
    chatBox.value = "";
  }
});

socket.on("messageLogs", (messages) => {
  let log = document.getElementById('messageLogs');
  let messagesHTML = "";

  messages.forEach((message) => {
    messagesHTML += "<div>";
    messagesHTML += `<b>${message.user}:</b><br>${message.msg}<br>`;
    messagesHTML += "</div>";
  });

  log.innerHTML = messagesHTML;
});
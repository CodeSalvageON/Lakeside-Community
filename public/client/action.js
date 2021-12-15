function makeid (length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

let coolID = "";
let encryptionKey = "";
let username = "";

let localEncryptionKey = localStorage.getItem("bhsim_key");
let localUsername = localStorage.getItem("bhsim_username");

const signupUsername = document.getElementById("screen-name-signup");
const signupPassword = document.getElementById("password-signup");

const loginUsername = document.getElementById("screen-name-login");
const loginPassword = document.getElementById("password-login");

const loginMSG = document.getElementById("login-msg");
const msgWriteValue = document.getElementById("msg-text");
const chatbox = document.getElementById("chatbox");

let oldChat = "";

$("#alt-log-on").click(function () {
  $("#signup-form").hide();
  $("#login-form").show();
});

$("#alt-sign-up").click(function () {
  $("#login-form").hide();
  $("#signup-form").show();
});

$("#signup-form").submit(function () {
  event.preventDefault();
  
  coolID = makeid(7);
  encryptionKey = signupPassword.value;
  localStorage.setItem("bhsim_key", encryptionKey);
  username = signupUsername.value;
  localStorage.setItem("bhsim_username", username);

  $("#startup").hide();
  $("#chat").show();
  chatbox.scrollTo(0, chatbox.scrollHeight);
});

$("#login-form").submit(function () {
  event.preventDefault();
  
  if (loginPassword.value === localEncryptionKey) {
    $("#startup").hide();
    $("#chat").show();
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }

  else {
    loginMSG.innerText = "Error: Incorrect Encryption Key.";
  }
});

$("#msg-write").submit(function () {
  event.preventDefault();

  fetch ("/chat", {
    method : "POST",
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      username : btoa(localUsername),
      msg : btoa(msgWriteValue.value)
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data); 
    msgWriteValue.value = "";
  })
  .catch(error => {
    throw error;
  });
});

setInterval(function () {
  fetch ("/chat")
  .then(response => response.text())
  .then(data => {
    if (data === oldChat) {
      // do nothing
    }

    else {
      chatbox.innerHTML = data;
      oldChat = data;

      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  })
  .catch(error => {
    throw error;
  });
}, 500);
const fs = require('fs');
const express = require('express');
const sanitizer = require('sanitizer');

const key = process.env.KEY;
const encryptor = require('simple-encryptor')(key);

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var atob = require('atob');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let chatLog = "";

const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}
    
const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
}

app.get('', function (req, res) {
  const index = __dirname + '/public/client/index.html';

  res.sendFile(index);
});

global.atob = function (b64Encoded) {
  return new Buffer(b64Encoded, 'base64').toString('binary');
};

app.post('/chat', function (req, res) {
  const username = req.body.username;
  const msg = req.body.msg;

  let w_u = atob(username);
  let w_m = atob(msg);

  const d_username = sanitizer.escape(w_u);
  const d_msg = sanitizer.escape(w_m);

  chatLog += "<p><p class='blue'>" + d_username + "</p> " + d_msg + "</p>";
});

app.get('/chat', function (req, res) {
  res.send(chatLog);
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
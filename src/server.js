'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server, {
  cors: { origin: '*' },
});
let path = require('path');
let favicon = require('serve-favicon');

const cors = require('cors');



let stream = require('./socket/stream');



app.use(favicon(path.join(__dirname, 'favicon-32x32.png')));

app.use(express.static('public'));
app.use(cors());

io.of('/stream').on('connection', stream);



module.exports = {
  server: app,
  startup: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
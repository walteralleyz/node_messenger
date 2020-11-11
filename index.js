const 
    express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    MessageController = require('./controller/messages'),
    PORT = process.env.PORT || 8000;


const messageController = new MessageController(io);

app.use(express.static('public'));

http.listen(PORT, () => {
    console.log('Listening on port:', PORT);
    messageController.connect();
});

// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express=require('express');

// Init globals variables for each module required
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// launch the http server on given port
server.listen(8080);

// Indicate where static files are located. Without this, no external js file, no css...  

    app.use(express.static(__dirname + '/'));    


// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/simpleChat.html');
});

// usernames which are currently connected to the chat
var usernames = {};
var tousLesMonstres = {};

io.sockets.on('connection', function (socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendpos', function (newPos) {
		// we tell the client to execute 'updatechat' with 2 parameters
		//console.log("recu sendPos");
		socket.broadcast.emit('updatepos', socket.username, newPos);
	});

	// when the client emits 'sendchat', this listens and executes
	// Exemple ordreDeDessin = {'x1':0, 'y1':0, 'x2':100, 'y2':100}
	socket.on('sendpaint', function (ordreDeDessin) {
		// we tell all clients except emitter tp execute 'updatepaint'
		// with 2 parameters
		socket.broadcast.emit('updatepaint', socket.username, ordreDeDessin);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);

		var monstre = {'x':0, 'y':0, 'v':0}
		tousLesMonstres[username] = monstre;
		io.sockets.emit('updateMonstres',tousLesMonstres);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
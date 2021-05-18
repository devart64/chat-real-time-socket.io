
const http = require('http');
const server = http.createServer(function(req, res){
    console.log('Un utilisateur a affiché la page')
});

server.listen(3000);

const { Server } = require("socket.io");
let io = new Server(server);

io.sockets.on('connection', function(socket){
    console.log('nouvel utilisateur')
})

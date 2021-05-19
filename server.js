// on instancie express
const express = require("express");
const app = express();

// on charge "path"
const path = require ("path");

// on autorise le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// On crée le serveur http
const http = require("http").createServer(app);

// on instancie socket.io
const io = require("socket.io")(http);

// on charge sequelize
const Sequelize = require("sequelize");

// on fabrique le lien de la base de données
const dbPath = path.resolve(__dirname, "chat.sqlite");
// on se connecte à la base
const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: dbPath
});

// on charge le model "Chat"
const Chat = require('./Models/Chat')(sequelize, Sequelize.DataTypes);

// on effectue le chargement "réél"
Chat.sync();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// on écoute l'événement "connexion" de socket.io
io.on('connection', (socket) => {
    console.log(' un utilisateur s\est connecté : id socket => '+socket.id)
          
        
        socket.broadcast.emit("connection_user", socket.id);

    // on écoute la déconnexion
    socket.on('disconnect', (socket) => {
        console.log(' un utilisateur s\est déconnecté ');
        io.emit("disconnect_user", socket.id);
    });

    // on gère le chat
    socket.on('chat_message', (msg) => {
        // on relai le message vers tous les users connectés
        io.emit("chat_message", msg);
    });
});





// on écoute sur le port 3000
http.listen(3000, () => {
    console.log("J'écoute le port 3000");
})
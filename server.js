const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('pseudo', (pseudo) => {
        socket.pseudo = pseudo;
        socket.broadcast.emit('message', { pseudo, text: ` a rejoint le chat` });
    });

    socket.on('message', (text) => {
        const message = { pseudo: socket.pseudo, text };
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
        if (socket.pseudo) {
            socket.broadcast.emit('message', {
                pseudo: socket.pseudo, text: ` a quitté le chat`
            });
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${ port }`);
});
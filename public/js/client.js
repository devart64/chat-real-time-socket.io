// on se oncnecte
const socket = io();

// on gère l'arrivée d'un nouvel utilisateur
socket.on("connect", () => {
    // on emet un message d'entrée dans une salle
    socket.emit("enter_room", "general")
})


window.onload = () => {

    // on écoute l'événement submit
    document.querySelector("form").addEventListener("submit", (e) => {
        // on empéche l'envoi du form
        e.preventDefault();
        console.log('formulaire envoyé !');
        const name = document.querySelector("#name");
        const message = document.querySelector("#message");
        //  on récupère la salle
        const room = document.querySelector('.marker_channel.active').dataset.room;
        let date = new Date();
    

        // on envoi le message
        socket.emit("chat_message", {name: name.value, message: message.value,room: room, senderID: socket.id, date: date});
        message.value = "";
    });

    // on écoute l'événement "chat_message"
    socket.on("received_message", (msg) => {
        console.log(msg)
        generationHtmlMessage(msg)

    });

    // on écoute l'événement init_message
    socket.on('init_messages', (msg) => {
       let data = JSON.parse(msg.messages);
       console.log(data)
       if( data !== []) {
           data.forEach(donnees => {
               publishMessages(donnees);
           })
       }

    })

    // on écoute la frappe au clavier
    document.querySelector('#message').addEventListener('input', () => {
        // on récupère le nom
        let nom = document.querySelector('#name').value;
        // on récupère la room
        const room = document.querySelector('.marker_channel.active').dataset.room;
        socket.emit('typing', {
            name: nom,
            room: room
        })
    })

    socket.on('usertyping', msg => {
        console.log(msg)
        const wrting = document.querySelector('#writing');
        wrting.innerHTML = msg.name + ' est en train d\écrire...';
    })

    
   
    socket.on('connection_user', (IDSocket) => {
        console.log('user connected')
      //  gestionListeUtilisateurConnecte(IDSocket, "connection");
    } );

    socket.on('disconnect_user', (IDSocket) => {
        console.log('user deconnected')
       // gestionListeUtilisateurConnecte(IDSocket, "deconnection");
    } );

    // on écoute le clique sur les onglets
    document.querySelectorAll('.marker_channel').forEach((tab) => {
        tab.addEventListener('click', function name(params) {
            // on vérifie si l'onglet n'est pas actif
            if(!this.classList.contains('active')) {
                // on récupère l'élément actif
                const actif = document.querySelector('.marker_channel.active');
                actif.classList.remove('active');
                this.classList.add('active');
                document.querySelector('#messages').innerHTML = "";
                // on quitte l'ancienne salle
                socket.emit('leave_room', actif.dataset.room);
                // on entre dans la nouvelle salle
                socket.emit('enter_room', this.dataset.room);
                
            }
        })
    });



    generationHtmlMessage = (msg) => {
        let created = new Date(msg.date);
        let divACloner = "";
        if(isSenderMessage(msg.senderID)) {
            divACloner = document.querySelector('.sender_message_div');
        } else {
            divACloner = document.querySelector('.receiver_message_div');
        }
        let dateLocal = cerated.toLocaleDateString();
        let divClone = divACloner.cloneNode(true);
        divClone.querySelector('.texte_message').innerHTML = msg.message;
        divClone.querySelector('.texte_nom').innerHTML = msg.name; 
        divClone.querySelector('.date_message').innerHTML = dateLocal;
        divClone.style.display = "block";
        document.querySelector('.chat-box').appendChild(divClone);
        
    }

    isSenderMessage = (IDSocket) => {
        if(IDSocket === socket.id) {
            console.log('sender')
            return true;
        } else {
            console.log('receiver')
            return false;
        }
    }

    gestionListeUtilisateurConnecte = (IDSocket, action) => {
        console.log('event est detecte')
        if(action === 'connection') {
            divACloner = document.querySelector('#modele_item_connecte');
            let divClone = divACloner.cloneNode(true);
            divClone.classList.add('marker_item_'+IDSocket);
            divClone.querySelector('.nom_user_connecte').innerHTML = IDSocket;
            divClone.style.display = "block";
            document.querySelector('.liste_des_connecte').appendChild(divClone);
        } else {
            console.log(IDSocket)
            document.querySelector('.marker_item_'+IDSocket).remove();
        }
    }

    
}

function publishMessages(msg) {
    let created = new Date(msg.createdAt);
    let divACloner = "";
    let nameUser = document.querySelector('#name').value;
    if(msg.name === nameUser) {
        divACloner = document.querySelector('.sender_message_div');
    } else {
        divACloner = document.querySelector('.receiver_message_div');
    }
    let dateLocal = "";
    if(msg.createdAt !== null) {
        dateLocal = created.toLocaleDateString();
    }
    
    
    let divClone = divACloner.cloneNode(true);
        divClone.querySelector('.texte_message').innerHTML = msg.message;
        divClone.querySelector('.texte_nom').innerHTML = msg.name; 
        divClone.querySelector('.date_message').innerHTML = dateLocal;
        divClone.style.display = "block";
        document.querySelector('.chat-box').appendChild(divClone);
}


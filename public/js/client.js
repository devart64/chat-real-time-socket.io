// on se oncnecte
const socket = io();



window.onload = () => {

    

    // on écoute l'événement submit
    document.querySelector("form").addEventListener("submit", (e) => {
        // on empéche l'envoi du form
        e.preventDefault();
        console.log('formulaire envoyé !');
        const name = document.querySelector("#name");
        const message = document.querySelector("#message");
        let date = new Date();
        let dateLocal = date.toLocaleString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        date = dateLocal;

        // on envoi le message
        socket.emit("chat_message", {name: name.value, message: message.value, senderID: socket.id, date: date});
        message.value = "";
    });

    // on écoute l'événement "chat_message"
    socket.on("chat_message", (msg) => {
        console.log(msg)
        generationHtmlMessage(msg)

    });

   
    socket.on('connection_user', (IDSocket) => {
        console.log('user connected')
      //  gestionListeUtilisateurConnecte(IDSocket, "connection");
    } );

    socket.on('disconnect_user', (IDSocket) => {
        console.log('user deconnected')
       // gestionListeUtilisateurConnecte(IDSocket, "deconnection");
    } );



    generationHtmlMessage = (msg) => {
        let divACloner = "";
        if(isSenderMessage(msg.senderID)) {
            divACloner = document.querySelector('.sender_message_div');
        } else {
            divACloner = document.querySelector('.receiver_message_div');
        }
        let divClone = divACloner.cloneNode(true);
        divClone.querySelector('.texte_message').innerHTML = msg.message;
        divClone.querySelector('.texte_nom').innerHTML = msg.name; 
        divClone.querySelector('.date_message').innerHTML = msg.date;
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

    //// ON GERE LES CHANNELS //////////
    document.querySelector('.marker_channel').addEventListener('click',  function(e){
        alert('lol')
    })

    
}


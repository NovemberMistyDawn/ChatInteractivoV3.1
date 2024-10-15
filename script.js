const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "chat-interactivo-ce323.firebaseapp.com",
    databaseURL: "https://chat-interactivo-ce323-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-interactivo-ce323",
    storageBucket: "chat-interactivo-ce323.appspot.com",
    messagingSenderId: "474997098356",
    appId: "1:474997098356:web:86ed5449562419fa964e21",
    measurementId: "G-FRE2732VJC"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const usersRef = db.collection('users');
const messagesRef = db.collection('mensajes');

let userId = null;
let userName = null;
let invitationCode;

// Función para generar y mostrar el código de invitación
function generateAndShowInvitationCode() {
    invitationCode = generateInvitationCode();
    document.getElementById('invitationCode').textContent = invitationCode;
}

// Función para generar un código de invitación aleatorio
function generateInvitationCode() {
    return Math.random().toString(36).substr(2, 8);
}

// Evento para unirse al chat
document.getElementById('joinChat').addEventListener('click', () => {
    userName = document.getElementById('username').value.trim();
    const userType = document.querySelector('input[name="userType"]:checked').value;

    if (userName) {
        if (userType === 'guest') {
            document.getElementById('accessCodeLabel').style.display = 'block';
            document.getElementById('accessCode').style.display = 'block';
        } else {
            handleMainUserJoin();
        }
    } else {
        alert('Por favor, ingresa un nombre.');
    }
});

// Manejar unión del usuario principal
function handleMainUserJoin() {
    usersRef.add({
        name: userName,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
        userId = docRef.id;
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        loadMessages();
        generateAndShowInvitationCode();
    }).catch((error) => {
        console.error("Error al guardar el usuario: ", error);
    });
}

// Manejar envío de mensajes
document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
document.getElementById('imageInput').addEventListener('change', handleImageUpload);

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message && userId) {
        messagesRef.add({
            message: message,
            sender: userName,
            userId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            input.value = '';
        }).catch((error) => {
            console.error("Error al enviar el mensaje: ", error);
        });
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && userId) {
        const storageRef = storage.ref();
        const folderRef = storageRef.child(`misImagenes/${Date.now()}-${file.name}`);

        const uploadTask = folderRef.put(file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progreso de la subida: ' + progress + '%');
        }, (error) => {
            console.error("Error al subir la imagen: ", error);
        }, () => {
            folderRef.getDownloadURL().then((url) => {
                messagesRef.add({
                    imageUrl: url,
                    sender: userName,
                    userId: userId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    console.log('Imagen y mensaje guardados en Firestore');
                });
            });
        });
    }
}

document.getElementById('messageInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el salto de línea en el input
        sendMessage(); // Llama a la función que envía el mensaje
    }
});

// Función para cargar los mensajes en tiempo real
function loadMessages() {
    messagesRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageElement = document.createElement('div');
            const isCurrentUser = messageData.userId === userId;

            messageElement.classList.add('message', isCurrentUser ? 'sent' : 'received');

            if (messageData.imageUrl) {
                messageElement.innerHTML = `<strong>${messageData.sender}:</strong><br><img src="${messageData.imageUrl}" style="max-width: 150px; height: auto; border-radius: 10px;">`;
            } else {
                messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
            }

            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}
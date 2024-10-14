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

// Evento para unirse al chat
document.getElementById('joinChat').addEventListener('click', () => {
    userName = document.getElementById('username').value.trim();
    if (userName) {
        usersRef.add({
            name: userName,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef) => {
            userId = docRef.id;
            document.getElementById('welcome').style.display = 'none';
            document.getElementById('chat').style.display = 'block';
            loadMessages(); // Cargar los mensajes al unirse al chat
        }).catch((error) => {
            console.error("Error al guardar el usuario: ", error);
        });
    } else {
        alert('Por favor, ingresa un nombre.');
    }
});

// Eventos para enviar mensajes y subir imágenes
document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
document.getElementById('imageInput').addEventListener('change', handleImageUpload);

// Función para cargar los mensajes en tiempo real
function loadMessages() {
    messagesRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = ''; // Limpiar el contenedor de mensajes antes de cargar nuevos
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageElement = document.createElement('div');
            const isCurrentUser = messageData.userId === userId;

            // Aplicar la clase correcta según si el mensaje es del usuario actual o de otro
            messageElement.classList.add('message', isCurrentUser ? 'sent' : 'received');

            // Determinar si el mensaje contiene una imagen o texto
            if (messageData.imageUrl) {
                // Mostrar la imagen si existe imageUrl en el mensaje
                messageElement.innerHTML = `<strong>${messageData.sender}:</strong><br><img src="${messageData.imageUrl}" style="max-width: 150px; height: auto; border-radius: 10px;">`;
            } else {
                // Mostrar texto si es un mensaje normal
                messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
            }

            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplazar hacia abajo para ver el último mensaje
    });
}

// Función para enviar un mensaje de texto
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
            input.value = ''; // Limpiar el campo de texto después de enviar
        }).catch((error) => {
            console.error("Error al enviar el mensaje: ", error);
        });
    }
}

// Función para manejar la subida de imágenes
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && userId) {
        const storageRef = storage.ref(); // Obtener referencia al storage
        const folderRef = storageRef.child(`misImagenes/${Date.now()}-${file.name}`); // Crear referencia a la carpeta 'misImagenes'

        // Subir el archivo a Firebase Storage
        const uploadTask = folderRef.put(file);

        uploadTask.on('state_changed', (snapshot) => {
            // Puedes añadir aquí lógica para mostrar el progreso de la subida si lo deseas
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progreso de la subida: ' + progress + '%');
        }, (error) => {
            // Manejar errores de subida
            console.error("Error al subir la imagen: ", error);
        }, () => {
            // Cuando la subida es exitosa, obtener la URL de la imagen
            folderRef.getDownloadURL().then((url) => {
                // Guardar la URL de la imagen en la colección de mensajes
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
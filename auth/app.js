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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Función para registrar un usuario
const registerUser = () => {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("¡Usuario registrado con éxito!");
            console.log("Usuario registrado:", userCredential.user);
        })
        .catch((error) => {
            alert("Error en el registro: " + error.message);
            console.error(error);
        });
};

// Función para iniciar sesión con un usuario registrado
const loginUser = () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("¡Login exitoso!");
            console.log("Usuario logueado:", userCredential.user);
        })
        .catch((error) => {
            alert("Error en el login: " + error.message);
            console.error(error);
        });
};
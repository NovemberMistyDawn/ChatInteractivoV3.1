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

// Elementos del DOM
const signInButton = document.getElementById('slide-right-button');
const signUpButton = document.getElementById('slide-left-button');
const signInForm = document.getElementById('sign-in-form');
const signUpForm = document.getElementById('sign-up-form');
const overlay = document.getElementById('overlay');
const signInInfo = document.getElementById('sign-in-info');
const signUpInfo = document.getElementById('sign-up-info');

// Función para mostrar la vista de login
const showSignIn = () => {
    overlay.classList.remove('slide-left');
    overlay.classList.add('slide-right');
    signInInfo.style.display = 'block';
    signUpInfo.style.display = 'none';
};

// Función para mostrar la vista de registro
const showSignUp = () => {
    overlay.classList.remove('slide-right');
    overlay.classList.add('slide-left');
    signInInfo.style.display = 'none';
    signUpInfo.style.display = 'block';
};

// Asignar eventos a los botones para cambiar de vista
signInButton.addEventListener('click', showSignIn);
signUpButton.addEventListener('click', showSignUp);

// Función para registrar un usuario
const registerUser = (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("¡Usuario registrado con éxito!");
            console.log("Usuario registrado:", userCredential.user);
            showSignIn(); // Cambiar a la vista de login automáticamente
        })
        .catch((error) => {
            alert("Error en el registro: " + error.message);
            console.error(error);
        });
};

// Función para iniciar sesión
const loginUser = (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("¡Login exitoso!");
            console.log("Usuario logueado:", userCredential.user);
            // Aquí puedes redirigir al usuario a otra página o hacer algo al iniciar sesión
        })
        .catch((error) => {
            alert("Error en el login: " + error.message);
            console.error(error);
        });
};

// Asignar eventos a los formularios
signUpForm.addEventListener('submit', registerUser);
signInForm.addEventListener('submit', loginUser);

// Listener para detectar cambios en el estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario autenticado:", user);
        // Aquí podrías redirigir al usuario a otra página si está autenticado
    } else {
        console.log("Ningún usuario está autenticado");
        // Aquí podrías redirigir al usuario a la página de login si no está autenticado
    }
});
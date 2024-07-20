import { database, ref, push, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase-config.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageForm = document.getElementById('messageForm');
const authDiv = document.getElementById('auth');
const messageSection = document.getElementById('messageSection');
const logoutButton = document.getElementById('logoutButton');

// Obtenha o nome do motoboy a partir do título da página
const motoboy = document.title.split(' ')[3].toLowerCase();

// Lógica de Cadastro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            registerForm.reset();
        })
        .catch((error) => {
            alert('Erro ao cadastrar: ' + error.message);
        });
});

// Lógica de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loginForm.reset();
        })
        .catch((error) => {
            alert('Erro ao entrar: ' + error.message);
        });
});

// Lógica de Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Logout bem-sucedido
    }).catch((error) => {
        alert('Erro ao sair: ' + error.message);
    });
});

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        authDiv.style.display = 'none';
        messageSection.style.display = 'block';
    } else {
        authDiv.style.display = 'block';
        messageSection.style.display = 'none';
    }
});

// Enviar Mensagem
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const messagesRef = ref(database, `messages/${motoboy}`);
    push(messagesRef, {
        text: message,
        timestamp: Date.now()
    }).then(() => {
        messageForm.reset();
        alert('Mensagem enviada com sucesso!');
    }).catch((error) => {
        alert('Erro ao enviar mensagem: ' + error.message);
    });
});

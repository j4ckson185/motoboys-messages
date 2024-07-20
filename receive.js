// receive.js
import { database, ref, onChildAdded, remove, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const logoutButton = document.getElementById('logoutButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const notificationSound = document.getElementById('notificationSound');

// Solicita permissão para notificações e toca o som após a primeira interação do usuário
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', () => {
        notificationSound.play().then(() => {
            notificationSound.pause();
            notificationSound.currentTime = 0;
        }).catch(error => {
            console.log('Erro ao solicitar permissão para reproduzir som:', error);
        });

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, { once: true });
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

// Apagar todas as mensagens
deleteAllButton.addEventListener('click', () => {
    const motoboy = document.title.split(' ')[2].toLowerCase();
    const messagesRef = ref(database, `messages/${motoboy}`);
    remove(messagesRef).then(() => {
        messagesDiv.innerHTML = '';
    }).catch((error) => {
        alert('Erro ao apagar mensagens: ' + error.message);
    });
});

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        authDiv.style.display = 'none';
        messagesSection.style.display = 'block';
        loadMessages();
    } else {
        authDiv.style.display = 'block';
        messagesSection.style.display = 'none';
    }
});

function loadMessages() {
    const motoboy = document.title.split(' ')[2].toLowerCase();
    const messagesRef = ref(database, `messages/${motoboy}`);
    messagesDiv.innerHTML = ''; // Limpa as mensagens existentes
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        const messageId = snapshot.key;
        displayMessage(messageId, messageData.text);
        playNotificationSound();
        showNotification(messageData.text);
    });
}

function displayMessage(messageId, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-item');
    messageElement.innerHTML = `
        <p>${message}</p>
        <button class="deleteButton" onclick="deleteMessage('${messageId}')">x</button>
    `;
    messagesDiv.appendChild(messageElement);
}

function playNotificationSound() {
    notificationSound.play().catch(error => {
        console.error("Erro ao reproduzir o som de notificação:", error);
    });
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Nova mensagem', {
            body: message,
            icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png'
        });
    }
}

window.deleteMessage = function(messageId) {
    const motoboy = document.title.split(' ')[2].toLowerCase();
    const messageRef = ref(database, `messages/${motoboy}/${messageId}`);
    remove(messageRef).then(() => {
        document.querySelector(`button[onclick="deleteMessage('${messageId}')"]`).parentElement.remove();
    }).catch((error) => {
        alert('Erro ao apagar mensagem: ' + error.message);
    });
}

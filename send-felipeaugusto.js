import { database, ref, push } from './firebase-config.js';

const messageForm = document.getElementById('messageForm');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message) {
        const messagesRef = ref(database, 'messages/felipeaugusto');
        push(messagesRef, {
            text: message
        }).then(() => {
            messageInput.value = '';
        }).catch((error) => {
            console.error('Erro ao enviar mensagem:', error);
        });
    }
});

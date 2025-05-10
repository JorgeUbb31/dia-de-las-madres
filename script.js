// Funciones interactivas
function showLove() {
    const message = document.getElementById('secretMessage');
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

function playMusic() {
    const audio = new Audio('audio/cancion.mp3');
    audio.play().catch(error => {
        alert('¡Permite la reproducción de audio para escuchar la sorpresa! 🎧');
    });
}

function showMessageForm() {
    const messageContainer = document.getElementById('savedMessages');
    messageContainer.classList.remove('hidden');
    messageContainer.classList.add('show-messages');
    document.getElementById('customMessage').focus();
}

// Sistema de mensajes persistente
function saveMessage() {
    const messageInput = document.getElementById('customMessage');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('¡El mensaje no puede estar vacío! 📝');
        return;
    }

    const savedMessages = JSON.parse(localStorage.getItem('mothersDayMessages')) || [];
    
    const newMessage = {
        text: message,
        date: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    savedMessages.push(newMessage);
    localStorage.setItem('mothersDayMessages', JSON.stringify(savedMessages));
    
    displayMessages();
    messageInput.value = '';
}

function displayMessages() {
    const container = document.getElementById('savedMessages');
    container.innerHTML = '';
    
    const messages = JSON.parse(localStorage.getItem('mothersDayMessages')) || [];
    
    if(messages.length === 0) {
        container.innerHTML = '<p class="no-messages">Aún no hay mensajes guardados... ¡Sé el primero! 💖</p>';
        return;
    }
    
    messages.forEach((msg, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        messageElement.innerHTML = `
            <p class="fecha">📅 ${msg.date}</p>
            <p class="mensaje">💌 ${msg.text}</p>
            <button onclick="deleteMessage(${index})">Eliminar</button>
        `;
        container.appendChild(messageElement);
    });
}

function deleteMessage(index) {
    const messages = JSON.parse(localStorage.getItem('mothersDayMessages')) || [];
    messages.splice(index, 1);
    localStorage.setItem('mothersDayMessages', JSON.stringify(messages));
    displayMessages();
}
let audioInstance = null;
let stopButton = null;
let isPlaying = false; // Estado para saber si la música está sonando

function playMusic() {
    const musicCard = document.querySelector('.photo-card:nth-child(2)');

    // Crear una nueva instancia de audio si no existe
    if (!audioInstance) {
        audioInstance = new Audio('audio/cancion.mp3');
        audioInstance.addEventListener('ended', stopMusic);
    }

    // Alternar entre reproducir y pausar
    if (isPlaying) {
        audioInstance.pause();
        isPlaying = false;
        updateStopButton('▶️ Reanudar música');
    } else {
        audioInstance.play()
            .then(() => {
                isPlaying = true;
                updateStopButton('⏹️ Detener música');
                if (!stopButton) {
                    createStopButton(musicCard);
                }
            })
            .catch(handlePlayError);
    }
}

function stopMusic() {
    if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0; // Reiniciar el audio
        isPlaying = false;
    }

    if (stopButton) {
        stopButton.remove(); // Eliminar el botón del DOM
        stopButton = null; // Resetear la referencia
    }

    audioInstance = null; // Resetear la instancia
}

function updateStopButton(text) {
    if (stopButton) {
        stopButton.textContent = text;
    }
}

function createStopButton(musicCard) {
    stopButton = document.createElement('button');
    stopButton.textContent = '⏹️ Detener música';
    stopButton.style.marginTop = '10px';
    stopButton.style.backgroundColor = '#ff4444';
    stopButton.style.color = 'white';
    stopButton.style.padding = '8px 16px';
    stopButton.style.borderRadius = '20px';
    stopButton.style.cursor = 'pointer';

    stopButton.addEventListener('click', stopMusic);

    musicCard.appendChild(stopButton);
}

function handlePlayError() {
    alert('¡Haz clic en cualquier parte de la página para habilitar el audio! 🔇');

    document.body.addEventListener('click', () => {
        playMusic();
    }, { once: true });
}
// Inicialización
window.onload = function() {
    displayMessages();
    document.getElementById('savedMessages').classList.add('hidden');
}
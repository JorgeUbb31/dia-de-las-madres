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
let isPlaying = false; // Estado para saber si la música está sonando
let stopButton = null;

function playMusic() {
    const musicCard = document.querySelector('.photo-card:nth-child(2)');

    // Si la música ya está sonando, pausarla
    if (audioInstance && isPlaying) {
        audioInstance.pause();
        isPlaying = false;
        stopButton.textContent = '▶️ Reanudar música';
        return;
    }

    // Si la música está pausada, reanudarla
    if (audioInstance && !isPlaying) {
        audioInstance.play();
        isPlaying = true;
        stopButton.textContent = '⏹️ Detener música';
        return;
    }

    // Crear una nueva instancia de audio si no existe
    audioInstance = new Audio('audio/cancion.mp3');

    // Crear el botón si no existe
    if (!stopButton) {
        stopButton = document.createElement('button');
        stopButton.textContent = '⏹️ Detener música';
        stopButton.style.marginTop = '10px';
        stopButton.style.backgroundColor = '#ff4444';
        stopButton.style.color = 'white';
        stopButton.style.padding = '8px 16px';
        stopButton.style.borderRadius = '20px';
        stopButton.style.cursor = 'pointer';

        stopButton.addEventListener('click', stopMusic);
    }

    // Reproducir el audio
    audioInstance.play()
        .then(() => {
            isPlaying = true;
            if (!musicCard.contains(stopButton)) {
                musicCard.appendChild(stopButton);
            }
        })
        .catch(() => {
            handlePlayError();
        });

    // Cuando el audio termine, reiniciar el estado
    audioInstance.addEventListener('ended', () => {
        stopMusic();
        isPlaying = false;
    });
}

function stopMusic() {
    if (audioInstance) {
        audioInstance.pause(); // Pausar la música
        audioInstance.currentTime = 0; // Reiniciar el tiempo de reproducción
        isPlaying = false; // Actualizar el estado
    }

    if (stopButton) {
        stopButton.remove(); // Eliminar el botón del DOM
        stopButton = null; // Resetear la referencia
    }

    audioInstance = null; // Resetear la instancia
}

function handlePlayError() {
    alert('¡Primero haz clic en cualquier parte de la página para habilitar el audio! 🔇');

    const clickHandler = () => {
        playMusic();
        document.body.removeEventListener('click', clickHandler);
    };

    document.body.addEventListener('click', clickHandler);
}
// Inicialización
window.onload = function() {
    displayMessages();
    document.getElementById('savedMessages').classList.add('hidden');
}
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
// Variables globales para controlar el estado
let audioInstance = null;
let stopButton = null;

function playMusic() {
    // Si ya existe una reproducción, detenerla primero
    if(audioInstance) {
        stopMusic();
    }

    // Crear nueva instancia de audio
    audioInstance = new Audio('audio/cancion.mp3');
    const musicCard = document.querySelector('.photo-card:nth-child(2)');

    // Crear el botón de detener si no existe
    if(!stopButton) {
        stopButton = document.createElement('button');
        stopButton.textContent = '⏹️ Detener música';
        stopButton.style.marginTop = '10px';
        stopButton.onclick = stopMusic;
        
        // Agregar estilo al botón
        stopButton.style.backgroundColor = '#ff4444';
        stopButton.style.color = 'white';
        stopButton.style.padding = '8px 16px';
        stopButton.style.borderRadius = '20px';
        stopButton.style.cursor = 'pointer';
    }

    // Intentar reproducir
    audioInstance.play()
        .then(() => {
            // Agregar el botón si no está presente
            if(!musicCard.contains(stopButton)) {
                musicCard.appendChild(stopButton);
            }
        })
        .catch(error => {
            handlePlayError();
        });

    // Limpiar cuando termine la canción
    audioInstance.addEventListener('ended', stopMusic);
}

function stopMusic() {
    if(audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
        audioInstance = null;
    }
    
    if(stopButton) {
        stopButton.remove();
        stopButton = null;
    }
}

function handlePlayError() {
    alert('¡Primero haz clic en cualquier parte de la página! 🔇');
    
    // Configurar el evento de clic una sola vez
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
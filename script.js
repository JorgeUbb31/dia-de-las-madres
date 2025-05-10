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
// Variables globales
let audioInstance = null; // Almacena la instancia de Audio
let stopButton = null; // Referencia al botón de detener
let isPlaying = false; // Indica si la música está en reproducción

/**
 * Función principal para reproducir música
 */
function playMusic() {
    const musicCard = document.querySelector('.photo-card:nth-child(2)'); // Selecciona la tarjeta objetivo

    // Si ya existe un audio en reproducción, pausarlo
    if (audioInstance && isPlaying) {
        pauseMusic();
        return;
    }

    // Si ya existe un audio, pero está pausado, reanudarlo
    if (audioInstance && !isPlaying) {
        audioInstance.play()
            .then(() => {
                isPlaying = true; // Actualiza el estado
                updateStopButton('⏹️ Detener música'); // Cambia el texto del botón
            })
            .catch(handlePlayError); // Maneja errores de reproducción
        return;
    }

    // Crear una nueva instancia de audio si no existe ninguna
    audioInstance = new Audio('audio/cancion.mp3');

    // Intentar reproducir el audio
    audioInstance.play()
        .then(() => {
            isPlaying = true; // Actualiza el estado
            updateStopButton('⏹️ Detener música'); // Cambia el texto del botón
            if (!stopButton) createStopButton(musicCard); // Crea el botón si no existe
        })
        .catch(handlePlayError); // Maneja errores de reproducción

    // Añadir un evento para cuando el audio termine
    audioInstance.addEventListener('ended', stopMusic);
}

/**
 * Pausa la música sin reiniciarla
 */
function pauseMusic() {
    if (audioInstance) {
        audioInstance.pause(); // Pausa el audio
        isPlaying = false; // Actualiza el estado
        updateStopButton('▶️ Reanudar música'); // Cambia el texto del botón
    }
}

/**
 * Detiene la música y reinicia el estado
 */
function stopMusic() {
    if (audioInstance) {
        audioInstance.pause(); // Pausa el audio
        audioInstance.currentTime = 0; // Reinicia el tiempo
        audioInstance = null; // Limpia la referencia
        isPlaying = false; // Actualiza el estado
    }

    if (stopButton) {
        stopButton.remove(); // Elimina el botón del DOM
        stopButton = null; // Limpia la referencia
    }
}

/**
 * Crea el botón para detener la música
 * @param {HTMLElement} musicCard - El contenedor donde se añadirá el botón
 */
function createStopButton(musicCard) {
    stopButton = document.createElement('button');
    stopButton.textContent = '⏹️ Detener música';
    stopButton.style.marginTop = '10px';
    stopButton.style.backgroundColor = '#ff4444';
    stopButton.style.color = 'white';
    stopButton.style.padding = '8px 16px';
    stopButton.style.borderRadius = '20px';
    stopButton.style.cursor = 'pointer';

    // Asigna la función de detener música al botón
    stopButton.addEventListener('click', stopMusic);

    // Añade el botón al contenedor
    musicCard.appendChild(stopButton);
}

/**
 * Actualiza el texto del botón de control
 * @param {string} text - El nuevo texto del botón
 */
function updateStopButton(text) {
    if (stopButton) {
        stopButton.textContent = text; // Cambia el texto del botón
    }
}

/**
 * Maneja errores al intentar reproducir el audio
 */
function handlePlayError() {
    alert('El navegador ha bloqueado el audio. Haz clic en cualquier parte de la página para habilitarlo.');

    const enableAudio = () => {
        playMusic();
        document.body.removeEventListener('click', enableAudio);
    };

    // Espera a que el usuario haga clic para habilitar el audio
    document.body.addEventListener('click', enableAudio, { once: true });
}
// Inicialización
window.onload = function() {
    displayMessages();
    document.getElementById('savedMessages').classList.add('hidden');
}
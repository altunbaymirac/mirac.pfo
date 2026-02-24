/* ═══════════════════════════════════════════════════════════════════════════════
   MIRAÇ ALTUNBAY - TERMINAL INTERFACE v2.1
   Complete JavaScript with Boot Animation, Easter Eggs, Firebase
═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey: "AIzaSyDXZtq63Ef1YUkZHuG78UKlTVCs53FBJvY",
    authDomain: "chat-mirac.firebaseapp.com",
    databaseURL: "https://chat-mirac-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-mirac",
    storageBucket: "chat-mirac.firebasestorage.app",
    messagingSenderId: "533641826188",
    appId: "1:533641826188:web:2e39acb96facc5fcf150a9"
};

let db, messagesRef, presenceRef, visitorsRef, connectedRef, myConnectionRef;
let isConnected = false;

// ─────────────────────────────────────────────────────────────────────────────────
// BOOT SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    startBootSequence();
});

function startBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const mainSite = document.getElementById('main-site');
    const bootLines = document.querySelectorAll('.boot-line');
    const progressBar = document.getElementById('boot-progress-bar');
    
    let progress = 0;
    let lineIndex = 0;
    
    // Show boot lines one by one
    bootLines.forEach((line, index) => {
        const delay = parseInt(line.dataset.delay) || (index * 200);
        setTimeout(() => {
            line.style.animationDelay = '0s';
            line.style.opacity = '1';
        }, delay);
    });
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 150);
    
    // Skip on any key
    const skipBoot = () => {
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        finishBoot();
    };
    
    document.addEventListener('keydown', skipBoot, { once: true });
    document.addEventListener('click', skipBoot, { once: true });
    
    // Auto finish after 3 seconds
    setTimeout(() => {
        if (bootScreen && !bootScreen.classList.contains('off')) {
            finishBoot();
        }
    }, 3000);
}

function finishBoot() {
    const bootScreen = document.getElementById('boot-screen');
    const mainSite = document.getElementById('main-site');
    
    bootScreen.classList.add('off');
    
    setTimeout(() => {
        bootScreen.style.display = 'none';
        mainSite.classList.remove('hidden');
        initMainSite();
    }, 400);
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN SITE INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

function initMainSite() {
    initClock();
    initTypingEffect();
    initKonamiCode();
    initFirebase();
    loadHighScores();
    loadCallsign();
}

// ─────────────────────────────────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────────────────────────────────

function initClock() {
    const updateClock = () => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('tr-TR');
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPING EFFECT
// ─────────────────────────────────────────────────────────────────────────────────

function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach((element) => {
        const text = element.dataset.text;
        const delay = parseInt(element.dataset.delay) || 0;
        
        if (text) {
            element.textContent = '';
            setTimeout(() => {
                typeText(element, text, 0);
            }, delay);
        }
    });
}

function typeText(element, text, index) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => {
            typeText(element, text, index + 1);
        }, 30 + Math.random() * 50);
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// KONAMI CODE EASTER EGG
// ─────────────────────────────────────────────────────────────────────────────────

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    const overlay = document.getElementById('easter-egg-overlay');
    overlay.classList.remove('hidden');
    
    // Start matrix rain
    startMatrixRain();
    
    // Play sound effect (if you want)
    playEasterEggSound();
}

function closeEasterEgg() {
    const overlay = document.getElementById('easter-egg-overlay');
    overlay.classList.add('hidden');
    
    // Stop matrix rain
    const matrixRain = document.getElementById('matrix-rain');
    matrixRain.innerHTML = '';
}

function startMatrixRain() {
    const matrixRain = document.getElementById('matrix-rain');
    matrixRain.innerHTML = '';
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ミラチアルトゥンバイ';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.cssText = `
            position: absolute;
            left: ${i * 20}px;
            top: ${-Math.random() * 100}%;
            color: #d1ff00;
            font-size: 14px;
            line-height: 1.2;
            text-shadow: 0 0 10px #d1ff00;
            animation: matrixFall ${3 + Math.random() * 5}s linear infinite;
            animation-delay: ${-Math.random() * 5}s;
        `;
        
        let text = '';
        for (let j = 0; j < 30; j++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length)) + '<br>';
        }
        column.innerHTML = text;
        matrixRain.appendChild(column);
    }
    
    // Add matrix animation to style
    if (!document.getElementById('matrix-style')) {
        const style = document.createElement('style');
        style.id = 'matrix-style';
        style.textContent = `
            @keyframes matrixFall {
                from { transform: translateY(-100%); }
                to { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
    }
}

function playEasterEggSound() {
    // Optional: Add a sound effect
    // const audio = new Audio('easter-egg-sound.mp3');
    // audio.play();
}

// ─────────────────────────────────────────────────────────────────────────────────
// FIREBASE INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

function initFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        
        messagesRef = db.ref('messages');
        presenceRef = db.ref('presence');
        visitorsRef = db.ref('visitors');
        connectedRef = db.ref('.info/connected');
        
        setupPresence();
        listenToMessages();
        trackVisitor();
        
        console.log('[SYSTEM] Firebase connected');
        updateConnectionStatus(true);
        
    } catch (error) {
        console.error('[ERROR] Firebase init failed:', error);
        updateConnectionStatus(false);
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// VISITOR COUNTER
// ─────────────────────────────────────────────────────────────────────────────────

function trackVisitor() {
    // Check if this is a new visitor (using sessionStorage)
    if (!sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        
        // Increment visitor count
        visitorsRef.child('total').transaction((current) => {
            return (current || 0) + 1;
        });
    }
    
    // Listen to visitor count
    visitorsRef.child('total').on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const countStr = count.toString().padStart(6, '0');
        animateCounter(countStr);
    });
}

function animateCounter(targetStr) {
    const counterEl = document.getElementById('visitor-count');
    const currentStr = counterEl.textContent;
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < targetStr.length) {
            const newStr = targetStr.substring(0, i + 1) + currentStr.substring(i + 1);
            counterEl.textContent = newStr;
            i++;
        } else {
            clearInterval(interval);
            counterEl.textContent = targetStr;
        }
    }, 100);
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRESENCE (Online Users)
// ─────────────────────────────────────────────────────────────────────────────────

function setupPresence() {
    const sessionId = generateSessionId();
    myConnectionRef = presenceRef.child(sessionId);
    
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            isConnected = true;
            updateConnectionStatus(true);
            
            myConnectionRef.set({
                online: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP,
                callsign: getCallsign()
            });
            
            myConnectionRef.onDisconnect().remove();
        } else {
            isConnected = false;
            updateConnectionStatus(false);
        }
    });
    
    presenceRef.on('value', (snap) => {
        const count = snap.numChildren();
        document.getElementById('online-count').innerText = `${count} OPERATOR${count !== 1 ? 'S' : ''} ONLINE`;
    });
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    if (connected) {
        statusEl.innerHTML = '<span class="status-connected">◉</span> CONNECTED';
        statusEl.className = 'connected';
    } else {
        statusEl.innerHTML = '<span class="status-disconnected">◉</span> DISCONNECTED';
        statusEl.className = 'disconnected';
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────────────────────────

function listenToMessages() {
    messagesRef
        .orderByChild('timestamp')
        .limitToLast(50)
        .on('child_added', (snapshot) => {
            const message = snapshot.val();
            displayMessage(message);
        });
}

function sendSignal() {
    const callsignInput = document.getElementById('callsign');
    const signalInput = document.getElementById('signal');
    
    const callsign = sanitizeInput(callsignInput.value.trim()) || 'ANONYMOUS';
    const signal = sanitizeInput(signalInput.value.trim());
    
    if (!signal) return;
    
    if (!isConnected) {
        showSystemMessage('BAĞLANTI YOK - MESAJ GÖNDERİLEMİYOR');
        return;
    }
    
    const message = {
        callsign: callsign.toUpperCase(),
        text: signal,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        clientTime: new Date().toISOString()
    };
    
    messagesRef.push(message)
        .then(() => {
            signalInput.value = '';
            saveCallsign(callsign);
        })
        .catch((error) => {
            console.error('[ERROR] Message send failed:', error);
            showSystemMessage('MESAJ GÖNDERİLEMEDİ');
        });
}

function displayMessage(message) {
    const log = document.getElementById('comms-log');
    if (!log) return;
    
    let timeStr = '--:--:--';
    if (message.timestamp) {
        const date = new Date(message.timestamp);
        timeStr = date.toLocaleTimeString('tr-TR');
    }
    
    const entry = document.createElement('div');
    entry.className = 'message-entry';
    entry.innerHTML = `
        <span class="msg-time">[${timeStr}]</span>
        <span class="msg-callsign">${escapeHtml(message.callsign)}:</span>
        <span class="msg-text">${escapeHtml(message.text)}</span>
    `;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    // Animation
    entry.style.opacity = '0';
    entry.style.transform = 'translateX(-10px)';
    setTimeout(() => {
        entry.style.transition = 'all 0.3s';
        entry.style.opacity = '1';
        entry.style.transform = 'translateX(0)';
    }, 10);
}

function showSystemMessage(text) {
    const log = document.getElementById('comms-log');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = 'message-entry system';
    entry.innerHTML = `
        <span class="msg-time">[${new Date().toLocaleTimeString('tr-TR')}]</span>
        <span class="msg-system">SYSTEM:</span>
        <span class="msg-text">${text}</span>
    `;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CALLSIGN MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

function getCallsign() {
    const input = document.getElementById('callsign');
    return (input ? input.value.trim() : '') || localStorage.getItem('callsign') || 'ANONYMOUS';
}

function saveCallsign(callsign) {
    localStorage.setItem('callsign', callsign);
}

function loadCallsign() {
    const saved = localStorage.getItem('callsign');
    const input = document.getElementById('callsign');
    if (saved && input) {
        input.value = saved;
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// HIGH SCORES
// ─────────────────────────────────────────────────────────────────────────────────

function loadHighScores() {
    const snakeScore = localStorage.getItem('snakeHighScore') || 0;
    const snakeEl = document.getElementById('snake-highscore');
    if (snakeEl) {
        snakeEl.textContent = snakeScore;
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendSignal();
    }
}

function sanitizeInput(str) {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .substring(0, 500);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showSection(sectionId) {
    document.querySelectorAll('.content-block').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// ─────────────────────────────────────────────────────────────────────────────────
// EASTER EGG: SECRET COMMANDS
// ─────────────────────────────────────────────────────────────────────────────────

// You can also add secret terminal commands here
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+D = Debug mode
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        console.log('[DEBUG] State:', { isConnected, konamiIndex });
    }
});

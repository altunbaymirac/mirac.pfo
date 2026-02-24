/* ═══════════════════════════════════════════════════════════════════════════════
   MIRAÇ ALTUNBAY - TERMINAL INTERFACE v2.1
   Clean version - No boot screen
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
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initTypingEffect();
    initKonamiCode();
    initFirebase();
    loadHighScores();
    loadCallsign();
});

// ─────────────────────────────────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────────────────────────────────

function initClock() {
    const clockEl = document.getElementById('clock');
    const updateClock = () => {
        if (clockEl) {
            clockEl.innerText = new Date().toLocaleTimeString('tr-TR');
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPING EFFECT
// ─────────────────────────────────────────────────────────────────────────────────

function initTypingEffect() {
    const texts = [
        { id: 'typing-1', text: '[UNIT: AGU MECHANICAL ENGINEERING]', delay: 0 },
        { id: 'typing-2', text: '[OPERATOR: MIRAÇ ALTUNBAY]', delay: 600 }
    ];
    
    texts.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            setTimeout(() => typeText(element, item.text, 0), item.delay);
        }
    });
}

function typeText(element, text, index) {
    if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        setTimeout(() => typeText(element, text, index + 1), 20 + Math.random() * 30);
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
    if (overlay) {
        overlay.style.display = 'flex';
        startMatrixRain();
    }
}

function closeEasterEgg() {
    const overlay = document.getElementById('easter-egg-overlay');
    if (overlay) overlay.style.display = 'none';
    stopMatrixRain();
}

let matrixAnimationId = null;

function startMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%ミラチ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#d1ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        matrixAnimationId = requestAnimationFrame(draw);
    }
    draw();
}

function stopMatrixRain() {
    if (matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
        matrixAnimationId = null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// FIREBASE
// ─────────────────────────────────────────────────────────────────────────────────

function initFirebase() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.database();
        messagesRef = db.ref('messages');
        presenceRef = db.ref('presence');
        visitorsRef = db.ref('visitors');
        connectedRef = db.ref('.info/connected');
        
        setupPresence();
        listenToMessages();
        trackVisitor();
        updateConnectionStatus(true);
        
    } catch (error) {
        console.error('[FIREBASE] Error:', error);
        updateConnectionStatus(false);
    }
}

function trackVisitor() {
    if (!visitorsRef) return;
    
    if (!sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        visitorsRef.child('total').transaction((current) => (current || 0) + 1);
    }
    
    visitorsRef.child('total').on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const counterEl = document.getElementById('visitor-count');
        if (counterEl) counterEl.textContent = count.toString().padStart(6, '0');
    });
}

function setupPresence() {
    if (!presenceRef || !connectedRef) return;
    
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    myConnectionRef = presenceRef.child(sessionId);
    
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            isConnected = true;
            updateConnectionStatus(true);
            myConnectionRef.set({ online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP, callsign: getCallsign() });
            myConnectionRef.onDisconnect().remove();
        } else {
            isConnected = false;
            updateConnectionStatus(false);
        }
    });
    
    presenceRef.on('value', (snap) => {
        const count = snap.numChildren();
        const countEl = document.getElementById('online-count');
        if (countEl) countEl.innerText = `${count} OPERATOR${count !== 1 ? 'S' : ''} ONLINE`;
    });
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;
    
    if (connected) {
        statusEl.innerHTML = '<span style="color:#d1ff00">◉</span> CONNECTED';
    } else {
        statusEl.innerHTML = '<span style="color:#ff3366">◉</span> DISCONNECTED';
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────────────────────────

function listenToMessages() {
    if (!messagesRef) return;
    
    messagesRef.orderByChild('timestamp').limitToLast(50).on('child_added', (snapshot) => {
        displayMessage(snapshot.val());
    });
}

function sendSignal() {
    const callsignInput = document.getElementById('callsign');
    const signalInput = document.getElementById('signal');
    if (!callsignInput || !signalInput) return;
    
    const callsign = sanitizeInput(callsignInput.value.trim()) || 'ANONYMOUS';
    const signal = sanitizeInput(signalInput.value.trim());
    
    if (!signal) return;
    
    if (!isConnected || !messagesRef) {
        showSystemMessage('BAĞLANTI YOK');
        return;
    }
    
    messagesRef.push({
        callsign: callsign.toUpperCase(),
        text: signal,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        signalInput.value = '';
        saveCallsign(callsign);
    }).catch(() => {
        showSystemMessage('MESAJ GÖNDERİLEMEDİ');
    });
}

function displayMessage(message) {
    const log = document.getElementById('comms-log');
    if (!log) return;
    
    const timeStr = message.timestamp ? new Date(message.timestamp).toLocaleTimeString('tr-TR') : '--:--:--';
    
    const entry = document.createElement('div');
    entry.className = 'message-entry';
    entry.innerHTML = `<span class="msg-time">[${timeStr}]</span> <span class="msg-callsign">${escapeHtml(message.callsign)}:</span> <span class="msg-text">${escapeHtml(message.text)}</span>`;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function showSystemMessage(text) {
    const log = document.getElementById('comms-log');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = 'message-entry system';
    entry.innerHTML = `<span class="msg-time">[${new Date().toLocaleTimeString('tr-TR')}]</span> <span class="msg-system">SYSTEM:</span> <span class="msg-text">${text}</span>`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

function getCallsign() {
    const input = document.getElementById('callsign');
    return (input ? input.value.trim() : '') || localStorage.getItem('callsign') || 'ANONYMOUS';
}

function saveCallsign(callsign) { localStorage.setItem('callsign', callsign); }

function loadCallsign() {
    const saved = localStorage.getItem('callsign');
    const input = document.getElementById('callsign');
    if (saved && input) input.value = saved;
}

function loadHighScores() {
    const snakeEl = document.getElementById('snake-highscore');
    if (snakeEl) snakeEl.textContent = localStorage.getItem('snakeHighScore') || 0;
}

function handleEnter(event) { if (event.key === 'Enter') sendSignal(); }

function sanitizeInput(str) { return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 500); }

function escapeHtml(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

function showSection(sectionId) {
    document.querySelectorAll('.content-block').forEach(s => s.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
}

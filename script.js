/* ═══════════════════════════════════════════════════════════════════════════════
   MIRAÇ ALTUNBAY - TERMINAL INTERFACE
   Firebase Realtime Chat Integration
═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey:,
    authDomain: "chat-mirac.firebaseapp.com",
    databaseURL: "https://chat-mirac-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-mirac",
    storageBucket: "chat-mirac.firebasestorage.app",
    messagingSenderId: "533641826188",
    appId: "1:533641826188:web:2e39acb96facc5fcf150a9"
};

// Firebase başlat
let db;
let messagesRef;
let presenceRef;
let connectedRef;
let myConnectionRef;
let isConnected = false;

// ─────────────────────────────────────────────────────────────────────────────────
// BAŞLATMA
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initFirebase();
    loadCallsign();
});

function initClock() {
    const updateClock = () => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('tr-TR');
    };
    updateClock();
    setInterval(updateClock, 1000);
}

function initFirebase() {
    try {
        // Firebase'i başlat
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        
        // Referanslar
        messagesRef = db.ref('messages');
        presenceRef = db.ref('presence');
        connectedRef = db.ref('.info/connected');
        
        // Bağlantı durumunu takip et
        setupPresence();
        
        // Mesajları dinle
        listenToMessages();
        
        console.log('[SYSTEM] Firebase connected');
        updateConnectionStatus(true);
        
    } catch (error) {
        console.error('[ERROR] Firebase init failed:', error);
        updateConnectionStatus(false);
        showSystemMessage('FIREBASE BAĞLANTI HATASI - CONFIG KONTROL EDİN');
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRESENCE (Online Kullanıcılar)
// ─────────────────────────────────────────────────────────────────────────────────

function setupPresence() {
    const sessionId = generateSessionId();
    myConnectionRef = presenceRef.child(sessionId);
    
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            // Bağlandık
            isConnected = true;
            updateConnectionStatus(true);
            
            // Varlığımızı kaydet
            myConnectionRef.set({
                online: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP,
                callsign: getCallsign()
            });
            
            // Çıkışta temizle
            myConnectionRef.onDisconnect().remove();
            
        } else {
            isConnected = false;
            updateConnectionStatus(false);
        }
    });
    
    // Online sayısını takip et
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
// MESAJLAR
// ─────────────────────────────────────────────────────────────────────────────────

function listenToMessages() {
    // Son 50 mesajı al ve yenileri dinle
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
    
    // Mesajı Firebase'e gönder
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
    
    // Timestamp formatla
    let timeStr = '--:--:--';
    if (message.timestamp) {
        const date = new Date(message.timestamp);
        timeStr = date.toLocaleTimeString('tr-TR');
    }
    
    // Mesaj elementi oluştur
    const entry = document.createElement('div');
    entry.className = 'message-entry';
    entry.innerHTML = `
        <span class="msg-time">[${timeStr}]</span>
        <span class="msg-callsign">${escapeHtml(message.callsign)}:</span>
        <span class="msg-text">${escapeHtml(message.text)}</span>
    `;
    
    log.appendChild(entry);
    
    // Otomatik scroll
    log.scrollTop = log.scrollHeight;
    
    // Giriş animasyonu
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
// CALLSIGN YÖNETİMİ
// ─────────────────────────────────────────────────────────────────────────────────

function getCallsign() {
    return document.getElementById('callsign').value.trim() || 
           localStorage.getItem('callsign') || 
           'ANONYMOUS';
}

function saveCallsign(callsign) {
    localStorage.setItem('callsign', callsign);
}

function loadCallsign() {
    const saved = localStorage.getItem('callsign');
    if (saved) {
        document.getElementById('callsign').value = saved;
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// YARDIMCI FONKSİYONLAR
// ─────────────────────────────────────────────────────────────────────────────────

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendSignal();
    }
}

function sanitizeInput(str) {
    // Basit sanitization
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

// Bölüm değiştirme
function showSection(sectionId) {
    document.querySelectorAll('.content-block').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// ─────────────────────────────────────────────────────────────────────────────────
// EASTER EGG KOMUTLARI
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+C = Clear chat (sadece görsel)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        document.getElementById('comms-log').innerHTML = '';
        showSystemMessage('LOCAL BUFFER CLEARED');
    }
});

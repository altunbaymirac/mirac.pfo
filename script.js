/* ═══════════════════════════════════════════════════════════════════════════════
   MIRAÇ ALTUNBAY - TERMINAL INTERFACE v2.1
   Theme System + Terminal Commands + Sound Effects
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
let soundEnabled = false;

// ─────────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] Starting...');
    
    loadTheme();
    loadSoundPreference();
    initClock();
    initTypingEffect();
    initKonamiCode();
    loadHighScores();
    loadCallsign();
    
    setTimeout(initFirebase, 300);
});

// ─────────────────────────────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'green';
    document.documentElement.setAttribute('data-theme', saved);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    playSound('click');
    closeThemeModal();
}

function openThemeModal() {
    document.getElementById('theme-modal').style.display = 'flex';
    playSound('click');
}

function closeThemeModal() {
    document.getElementById('theme-modal').style.display = 'none';
}

// ─────────────────────────────────────────────────────────────────────────────────
// SOUND SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

function loadSoundPreference() {
    soundEnabled = localStorage.getItem('sound') === 'true';
    updateSoundIcon();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled);
    updateSoundIcon();
    if (soundEnabled) playSound('click');
}

function updateSoundIcon() {
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound(type) {
    if (!soundEnabled) return;
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
            break;
        case 'error':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.15;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
            break;
        case 'success':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.1;
            oscillator.start();
            setTimeout(() => { oscillator.frequency.value = 800; }, 100);
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────────────────────────────────────

function initClock() {
    const clockEl = document.getElementById('clock');
    const update = () => {
        if (clockEl) clockEl.innerText = new Date().toLocaleTimeString('tr-TR');
    };
    update();
    setInterval(update, 1000);
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPING EFFECT
// ─────────────────────────────────────────────────────────────────────────────────

function initTypingEffect() {
    const texts = [
        { id: 'typing-1', text: '[UNIT: AGU MECHANICAL ENGINEERING]', delay: 0 },
        { id: 'typing-2', text: '[OPERATOR: MIRAÇ ALTUNBAY]', delay: 500 }
    ];
    
    texts.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) setTimeout(() => typeText(el, item.text, 0), item.delay);
    });
}

function typeText(el, text, i) {
    if (i < text.length) {
        el.textContent = text.substring(0, i + 1);
        setTimeout(() => typeText(el, text, i + 1), 15 + Math.random() * 25);
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// TERMINAL COMMANDS
// ─────────────────────────────────────────────────────────────────────────────────

const commands = {
    help: () => [
        'Available commands:',
        '  help     - Show this help',
        '  about    - About me',
        '  skills   - My tech stack',
        '  projects - My projects',
        '  contact  - Contact info',
        '  theme    - Change theme (green/amber/cyan/red)',
        '  games    - List games',
        '  clear    - Clear terminal',
        '  date     - Show date',
        '  hack     - ???',
        '  matrix   - ???',
        '  sudo     - ???'
    ],
    about: () => [
        '╔══════════════════════════════════════╗',
        '║  MIRAÇ ALTUNBAY                      ║',
        '║  AGÜ Makine Mühendisliği (1. Sınıf)  ║',
        '║  Kayseri, Turkey                     ║',
        '╚══════════════════════════════════════╝',
        '',
        'Mühendislik ve yazılım arasında köprü kuran bir maker.',
        '"Anything that moves with an engine" felsefesiyle çalışıyorum.'
    ],
    skills: () => [
        '> SOFTWARE',
        '  React Native, Firebase, Python, JavaScript',
        '',
        '> HARDWARE', 
        '  ESP32, LoRa, Arduino',
        '',
        '> INTERESTS',
        '  Havacılık, Roketler, Bilim Kurgu'
    ],
    projects: () => [
        '> ACTIVE PROJECTS:',
        '',
        '[1] FLARE - Emergency Mesh Network',
        '    LoRa tabanlı acil durum haberleşme sistemi',
        '    Status: IN DEVELOPMENT',
        '',
        '[2] DCE-SOFC Hybrid Propulsion',
        '    Amonyak yakıtlı deniz motoru simülasyonu',
        '    Status: TTO PRESENTATION READY'
    ],
    contact: () => [
        '> CONTACT INFO:',
        '  GitHub:   github.com/miracaltunbay',
        '  LinkedIn: linkedin.com/in/miracaltunbay',
        '  Email:    mirac@example.com'
    ],
    games: () => [
        '> AVAILABLE GAMES:',
        '  snake  - Classic snake game',
        '  tetris - Block puzzle',
        '  pong   - Table tennis',
        '',
        'Type game name to play!'
    ],
    date: () => [new Date().toString()],
    clear: () => {
        document.getElementById('terminal-output').innerHTML = '';
        return [];
    },
    hack: () => {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    terminalPrint(generateHackLine(), 'success');
                }, i * 100);
            }
        }, 500);
        return ['Initiating hack sequence...', 'ACCESS GRANTED'];
    },
    matrix: () => {
        activateEasterEgg();
        return ['Entering the Matrix...'];
    },
    sudo: () => ['Nice try! 😄', 'Permission denied: You are not root.'],
    snake: () => { window.location.href = 'snake.html'; return ['Loading snake.exe...']; },
    tetris: () => { window.location.href = 'tetris.html'; return ['Loading tetris.exe...']; },
    pong: () => { window.location.href = 'pong.html'; return ['Loading pong.exe...']; },
    theme: (args) => {
        const themes = ['green', 'amber', 'cyan', 'red'];
        if (args[0] && themes.includes(args[0])) {
            setTheme(args[0]);
            return [`Theme changed to ${args[0]}`];
        }
        return ['Usage: theme <green|amber|cyan|red>'];
    },
    echo: (args) => [args.join(' ') || ''],
    whoami: () => ['guest@altunbay-terminal'],
    pwd: () => ['/home/guest'],
    ls: () => ['about.txt  projects/  skills.txt  games/  secret/'],
    cd: () => ['Permission denied. Nice try though!'],
    cat: (args) => {
        if (args[0] === 'about.txt') return commands.about();
        if (args[0] === 'skills.txt') return commands.skills();
        return ['File not found: ' + (args[0] || '')];
    },
    neofetch: () => [
        '       _____          ',
        '      /     \\        miraç@terminal',
        '     | () () |       ---------------',
        '      \\  ^  /        OS: ALTUNBAY_OS v2.1',
        '       |||||         Host: AGU Mechanical Engineering',
        '       |||||         Kernel: JavaScript ES6+',
        '                     Shell: Terminal.js',
        '                     Theme: ' + (localStorage.getItem('theme') || 'green')
    ],
    exit: () => {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#d1ff00;font-family:monospace;font-size:20px;">Connection closed.</div>';
        return [];
    }
};

function generateHackLine() {
    const chars = '0123456789ABCDEF';
    let line = '';
    for (let i = 0; i < 40; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
    }
    return '[0x' + line.substring(0, 8) + '] ' + line;
}

function handleTerminalInput(event) {
    if (event.key !== 'Enter') return;
    
    const input = document.getElementById('terminal-input');
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    
    if (!cmd) return;
    
    playSound('click');
    terminalPrint('miraç@agu:~$ ' + cmd, 'info');
    
    const parts = cmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    if (commands[command]) {
        const output = commands[command](args);
        if (output && output.length) {
            output.forEach(line => terminalPrint(line));
        }
    } else {
        playSound('error');
        terminalPrint(`Command not found: ${command}`, 'error');
        terminalPrint("Type 'help' for available commands.");
    }
    
    terminalPrint('');
}

function terminalPrint(text, type = '') {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line' + (type ? ' ' + type : '');
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────────
// KONAMI CODE
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
        playSound('success');
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
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%ミラチアルトゥンバイ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const theme = localStorage.getItem('theme') || 'green';
        const colors = { green: '#d1ff00', amber: '#ffb000', cyan: '#00ffff', red: '#ff4444' };
        ctx.fillStyle = colors[theme] || '#d1ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
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
    if (typeof firebase === 'undefined') {
        console.error('[FIREBASE] SDK not loaded');
        updateConnectionStatus(false);
        return;
    }
    
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        
        db = firebase.database();
        messagesRef = db.ref('messages');
        presenceRef = db.ref('presence');
        visitorsRef = db.ref('visitors');
        connectedRef = db.ref('.info/connected');
        
        setupPresence();
        listenToMessages();
        trackVisitor();
        
        console.log('[FIREBASE] Connected');
    } catch (error) {
        console.error('[FIREBASE] Error:', error);
        updateConnectionStatus(false);
    }
}

function trackVisitor() {
    if (!visitorsRef) return;
    
    if (!sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        visitorsRef.child('total').transaction(c => (c || 0) + 1);
    }
    
    visitorsRef.child('total').on('value', snap => {
        const el = document.getElementById('visitor-count');
        if (el) el.textContent = (snap.val() || 0).toString().padStart(6, '0');
    });
}

function setupPresence() {
    if (!presenceRef || !connectedRef) return;
    
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    myConnectionRef = presenceRef.child(sessionId);
    
    connectedRef.on('value', snap => {
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
    
    presenceRef.on('value', snap => {
        const el = document.getElementById('online-count');
        if (el) el.innerText = `${snap.numChildren()} OPERATOR${snap.numChildren() !== 1 ? 'S' : ''} ONLINE`;
    });
}

function updateConnectionStatus(connected) {
    const el = document.getElementById('connection-status');
    if (el) el.innerHTML = connected ? '<span style="color:var(--primary)">◉</span> CONNECTED' : '<span style="color:var(--danger)">◉</span> DISCONNECTED';
}

function listenToMessages() {
    if (!messagesRef) return;
    messagesRef.orderByChild('timestamp').limitToLast(50).on('child_added', snap => displayMessage(snap.val()));
}

function sendSignal() {
    const callsignInput = document.getElementById('callsign');
    const signalInput = document.getElementById('signal');
    if (!callsignInput || !signalInput) return;
    
    const callsign = sanitizeInput(callsignInput.value.trim()) || 'ANONYMOUS';
    const signal = sanitizeInput(signalInput.value.trim());
    
    if (!signal) return;
    if (!isConnected || !messagesRef) { showSystemMessage('BAĞLANTI YOK'); playSound('error'); return; }
    
    playSound('click');
    messagesRef.push({ callsign: callsign.toUpperCase(), text: signal, timestamp: firebase.database.ServerValue.TIMESTAMP })
        .then(() => { signalInput.value = ''; saveCallsign(callsign); playSound('success'); })
        .catch(() => { showSystemMessage('GÖNDERILEMEDI'); playSound('error'); });
}

function displayMessage(msg) {
    const log = document.getElementById('comms-log');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = 'message-entry';
    entry.innerHTML = `<span class="msg-time">[${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('tr-TR') : '--:--:--'}]</span> <span class="msg-callsign">${escapeHtml(msg.callsign)}:</span> <span class="msg-text">${escapeHtml(msg.text)}</span>`;
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

function saveCallsign(c) { localStorage.setItem('callsign', c); }

function loadCallsign() {
    const saved = localStorage.getItem('callsign');
    const input = document.getElementById('callsign');
    if (saved && input) input.value = saved;
}

function loadHighScores() {
    ['snake', 'tetris', 'pong'].forEach(game => {
        const el = document.getElementById(game + '-highscore');
        if (el) el.textContent = localStorage.getItem(game + 'HighScore') || 0;
    });
}

function handleEnter(e) { if (e.key === 'Enter') sendSignal(); }
function sanitizeInput(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 500); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function showSection(id) {
    playSound('click');
    document.querySelectorAll('.content-block').forEach(s => s.style.display = 'none');
    const sec = document.getElementById(id);
    if (sec) sec.style.display = 'block';
    
    // Focus terminal input when switching to terminal
    if (id === 'terminal') {
        setTimeout(() => {
            const input = document.getElementById('terminal-input');
            if (input) input.focus();
        }, 100);
    }
}

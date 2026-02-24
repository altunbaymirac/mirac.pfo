/* ═══════════════════════════════════════════════════════════════════════════════
   FLARE MESH NETWORK SIMULATOR v2.0 - ENGINE
   With Tutorial, Info System, and Comprehensive Explanations
═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS & STATE
// ─────────────────────────────────────────────────────────────────────────────────

const LORA_CONFIG = {
    SF: { 7: 0.6, 9: 0.8, 10: 1.0, 12: 1.4 },
    BW: { 125: 1.2, 250: 1.0, 500: 0.8 },
    BASE_RANGE: 150,
    TX_RANGE_FACTOR: 5,
};

const INFO_CONTENT = {
    scenario: {
        title: '📡 Senaryolar Hakkında',
        content: `
            <p><strong>NORMAL:</strong> GSM çalışıyor, FLARE yedek olarak bekliyor.</p>
            <p><strong>DEPREM:</strong> GSM altyapısı çökmüş! Baz istasyonları hasar görmüş. FLARE mesh ağı devreye giriyor.</p>
            <p><strong>SEL:</strong> Kısmi altyapı hasarı. Bazı node'lar su altında kalmış.</p>
            <hr>
            <p>Deprem senaryosunda rastgele node'lar hasar görür ve mesajlar alternatif rotalardan iletilir.</p>
        `
    },
    lora: {
        title: '📻 LoRa Parametreleri',
        content: `
            <p><strong>LoRa (Long Range)</strong> düşük güç, uzun menzil kablosuz iletişim teknolojisidir.</p>
            <hr>
            <p><strong>SF (Spreading Factor):</strong></p>
            <p>• SF7: ~2km menzil, 5.5 kbps hız</p>
            <p>• SF12: ~15km menzil, 0.3 kbps hız</p>
            <p>Yüksek SF = Uzun menzil ama yavaş veri</p>
            <hr>
            <p><strong>BW (Bandwidth):</strong></p>
            <p>• 125kHz: Uzun menzil, yavaş</p>
            <p>• 500kHz: Kısa menzil, hızlı</p>
            <hr>
            <p><strong>TX Power:</strong></p>
            <p>Verici gücü. 20dBm'de ~100mW güç harcar. Pil ömrü için optimize edilmeli.</p>
        `
    },
    rssi: {
        title: '📊 RSSI Nedir?',
        content: `
            <p><strong>RSSI (Received Signal Strength Indicator)</strong> alınan sinyalin gücünü dBm cinsinden gösterir.</p>
            <hr>
            <p>• <strong>-50 dBm:</strong> Mükemmel (çok yakın)</p>
            <p>• <strong>-70 dBm:</strong> İyi</p>
            <p>• <strong>-90 dBm:</strong> Orta</p>
            <p>• <strong>-110 dBm:</strong> Zayıf (sınırda)</p>
            <p>• <strong>-130 dBm:</strong> Bağlantı yok</p>
            <hr>
            <p>FLARE sisteminde -110 dBm altındaki bağlantılar güvenilir sayılmaz.</p>
        `
    }
};

const state = {
    nodes: [],
    connections: [],
    selectedNode: null,
    params: { sf: 10, bw: 250, txPower: 14 },
    scenario: 'normal',
    gsmOnline: true,
    nodeDisableMode: false,
    propagatingMessage: null,
    totalMessages: 0,
    deliveredMessages: 0
};

let canvas, ctx;
let nodeIdCounter = 0;
let currentTutorialStep = 1;
const totalTutorialSteps = 5;

// ─────────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initClock();
    initEventListeners();
    initTutorial();
    createInitialNodes();
    gameLoop();
});

function initCanvas() {
    canvas = document.getElementById('network-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function initClock() {
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString('tr-TR');
    }, 1000);
}

function initEventListeners() {
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('dblclick', handleCanvasDoubleClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    const txSlider = document.getElementById('tx-power');
    txSlider.addEventListener('input', (e) => {
        state.params.txPower = parseInt(e.target.value);
        document.getElementById('tx-power-val').innerText = state.params.txPower + ' dBm';
        updateConnections();
        updateStats();
    });
    
    // Info icons hover
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('mouseenter', showTooltip);
        icon.addEventListener('mouseleave', hideTooltip);
    });
}

// ─────────────────────────────────────────────────────────────────────────────────
// TUTORIAL SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

function initTutorial() {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('flare-tutorial-seen');
    
    if (!hasSeenTutorial) {
        showTutorial();
    } else {
        document.getElementById('tutorial-overlay').classList.add('hidden');
    }
    
    // Create dots
    const dotsContainer = document.getElementById('tutorial-dots');
    for (let i = 1; i <= totalTutorialSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'tutorial-dot' + (i === 1 ? ' active' : '');
        dot.onclick = () => goToStep(i);
        dotsContainer.appendChild(dot);
    }
}

function showTutorial() {
    document.getElementById('tutorial-overlay').classList.remove('hidden');
    currentTutorialStep = 1;
    updateTutorialUI();
}

function skipTutorial() {
    localStorage.setItem('flare-tutorial-seen', 'true');
    document.getElementById('tutorial-overlay').classList.add('hidden');
}

function reopenTutorial() {
    showTutorial();
}

function nextStep() {
    if (currentTutorialStep < totalTutorialSteps) {
        currentTutorialStep++;
        updateTutorialUI();
    } else {
        skipTutorial();
    }
}

function prevStep() {
    if (currentTutorialStep > 1) {
        currentTutorialStep--;
        updateTutorialUI();
    }
}

function goToStep(step) {
    currentTutorialStep = step;
    updateTutorialUI();
}

function updateTutorialUI() {
    // Update steps
    document.querySelectorAll('.tutorial-step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === currentTutorialStep) {
            step.classList.add('active');
        }
    });
    
    // Update dots
    document.querySelectorAll('.tutorial-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentTutorialStep);
    });
    
    // Update buttons
    document.getElementById('prev-btn').disabled = currentTutorialStep === 1;
    document.getElementById('next-btn').textContent = 
        currentTutorialStep === totalTutorialSteps ? '[BAŞLA →]' : '[İLERİ →]';
}

// ─────────────────────────────────────────────────────────────────────────────────
// INFO & TOOLTIP SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

function showInfo(infoKey) {
    const info = INFO_CONTENT[infoKey];
    if (!info) return;
    
    document.getElementById('info-modal-title').textContent = info.title;
    document.getElementById('info-modal-body').innerHTML = info.content;
    document.getElementById('info-modal').style.display = 'flex';
}

function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

function showTooltip(e) {
    const tooltip = document.getElementById('info-tooltip');
    const content = e.target.dataset.info;
    
    if (!content) return;
    
    document.getElementById('tooltip-content').textContent = content;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
}

function hideTooltip() {
    document.getElementById('info-tooltip').style.display = 'none';
}

// ─────────────────────────────────────────────────────────────────────────────────
// NODE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

function createInitialNodes() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    addNodeAt(centerX, centerY - 80, 'gateway');
    addNodeAt(centerX - 120, centerY + 20, 'node');
    addNodeAt(centerX + 130, centerY + 30, 'node');
    addNodeAt(centerX - 60, centerY + 120, 'node');
    addNodeAt(centerX + 70, centerY + 100, 'node');
    addNodeAt(centerX + 10, centerY + 180, 'survivor');
    
    log('SYSTEM', '6 node ile demo ağ oluşturuldu');
}

function addNode() {
    const x = 50 + Math.random() * (canvas.width - 100);
    const y = 50 + Math.random() * (canvas.height - 100);
    addNodeAt(x, y, 'node');
}

function addSurvivor() {
    const x = 50 + Math.random() * (canvas.width - 100);
    const y = 50 + Math.random() * (canvas.height - 100);
    addNodeAt(x, y, 'survivor');
}

function addNodeAt(x, y, type = 'node') {
    nodeIdCounter++;
    const node = {
        id: nodeIdCounter,
        x, y, type,
        active: true,
        rssi: -50,
        snr: 10,
        messagesReceived: 0,
        pulseRadius: 0,
        isPulsing: false
    };
    
    state.nodes.push(node);
    updateConnections();
    updateStats();
    
    const typeLabel = type === 'gateway' ? 'GATEWAY' : type === 'survivor' ? 'KULLANICI' : 'NODE';
    log('SYSTEM', `${typeLabel}-${node.id} ağa eklendi`);
    
    return node;
}

function toggleSelectedNode() {
    if (state.selectedNode) {
        state.selectedNode.active = !state.selectedNode.active;
        const status = state.selectedNode.active ? 'AKTİF' : 'DEVRE DIŞI';
        log('SYSTEM', `NODE-${state.selectedNode.id} → ${status}`);
        updateConnections();
        updateStats();
    }
}

function resetNetwork() {
    state.nodes = [];
    state.connections = [];
    state.selectedNode = null;
    state.propagatingMessage = null;
    state.totalMessages = 0;
    state.deliveredMessages = 0;
    nodeIdCounter = 0;
    document.getElementById('node-info').style.display = 'none';
    document.getElementById('log-display').innerHTML = '';
    log('SYSTEM', 'Ağ sıfırlandı');
    createInitialNodes();
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONNECTIONS & RANGE
// ─────────────────────────────────────────────────────────────────────────────────

function calculateRange() {
    const sfMultiplier = LORA_CONFIG.SF[state.params.sf] || 1;
    const bwMultiplier = LORA_CONFIG.BW[state.params.bw] || 1;
    const txMultiplier = 1 + (state.params.txPower - 14) * 0.05;
    return LORA_CONFIG.BASE_RANGE * sfMultiplier * bwMultiplier * txMultiplier;
}

function calculateRSSI(distance, maxRange) {
    const ratio = distance / maxRange;
    return Math.round(-50 - (ratio * 80));
}

function updateConnections() {
    state.connections = [];
    const range = calculateRange();
    const activeNodes = state.nodes.filter(n => n.active);
    
    for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
            const nodeA = activeNodes[i];
            const nodeB = activeNodes[j];
            const distance = Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
            
            if (distance <= range) {
                const rssi = calculateRSSI(distance, range);
                state.connections.push({
                    from: nodeA,
                    to: nodeB,
                    distance,
                    rssi,
                    quality: rssi > -70 ? 'excellent' : rssi > -90 ? 'good' : rssi > -110 ? 'fair' : 'weak'
                });
                nodeA.rssi = rssi;
                nodeB.rssi = rssi;
            }
        }
    }
    
    document.getElementById('stat-range').textContent = Math.round(range) + ' px';
}

// ─────────────────────────────────────────────────────────────────────────────────
// MESSAGE PROPAGATION
// ─────────────────────────────────────────────────────────────────────────────────

function sendFromSelected() {
    if (state.selectedNode) openMessagePopup(state.selectedNode);
}

function openMessagePopup(sourceNode) {
    state.messageSourceNode = sourceNode;
    document.getElementById('message-overlay').style.display = 'flex';
    document.getElementById('msg-input').focus();
}

function closeMessagePopup() {
    document.getElementById('message-overlay').style.display = 'none';
    document.getElementById('msg-input').value = '';
}

function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (!text || !state.messageSourceNode) {
        closeMessagePopup();
        return;
    }
    
    const sourceNode = state.messageSourceNode;
    closeMessagePopup();
    propagateMessage(sourceNode, text);
}

function propagateMessage(sourceNode, text) {
    state.totalMessages++;
    
    const message = {
        id: Date.now(),
        text,
        sourceNode,
        reachedNodes: new Set([sourceNode.id]),
        hops: 0,
        startTime: Date.now(),
        currentWave: [sourceNode],
        complete: false
    };
    
    state.propagatingMessage = message;
    sourceNode.isPulsing = true;
    sourceNode.pulseRadius = 0;
    
    log('PROPAGATION', `NODE-${sourceNode.id}'den mesaj: "${text.substring(0, 25)}${text.length > 25 ? '...' : ''}"`);
    propagateWave(message);
}

function propagateWave(message) {
    if (message.complete) return;
    
    const range = calculateRange();
    const nextWave = [];
    
    for (const currentNode of message.currentWave) {
        for (const node of state.nodes) {
            if (!node.active) continue;
            if (message.reachedNodes.has(node.id)) continue;
            
            const distance = Math.sqrt(Math.pow(currentNode.x - node.x, 2) + Math.pow(currentNode.y - node.y, 2));
            
            if (distance <= range) {
                message.reachedNodes.add(node.id);
                nextWave.push(node);
                node.messagesReceived++;
                node.isPulsing = true;
                node.pulseRadius = 0;
                
                log('PROPAGATION', `→ NODE-${node.id} mesajı aldı (HOP ${message.hops + 1})`);
            }
        }
    }
    
    if (nextWave.length > 0) {
        message.hops++;
        message.currentWave = nextWave;
        updatePropagationDisplay(message);
        setTimeout(() => propagateWave(message), 500);
    } else {
        message.complete = true;
        const activeCount = state.nodes.filter(n => n.active).length;
        state.deliveredMessages += message.reachedNodes.size;
        
        log('SUCCESS', `✓ Yayılım tamamlandı: ${message.reachedNodes.size}/${activeCount} node, ${message.hops} hop`);
        updatePropagationDisplay(message, true);
        updateStats();
        
        setTimeout(() => {
            state.propagatingMessage = null;
            state.nodes.forEach(n => n.isPulsing = false);
        }, 2000);
    }
}

function updatePropagationDisplay(message, complete = false) {
    const activeNodes = state.nodes.filter(n => n.active).length;
    const progress = Math.round((message.reachedNodes.size / activeNodes) * 100);
    
    document.getElementById('prop-progress').textContent = progress + '%';
    document.getElementById('prop-fill').style.width = progress + '%';
    document.getElementById('prop-hops').textContent = message.hops;
    document.getElementById('prop-time').textContent = (Date.now() - message.startTime) + 'ms';
    document.getElementById('prop-reached').textContent = message.reachedNodes.size + '/' + activeNodes;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SCENARIOS
// ─────────────────────────────────────────────────────────────────────────────────

function setScenario(scenario) {
    state.scenario = scenario;
    
    document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const scenarioName = document.getElementById('scenario-name');
    const gsmStatus = document.getElementById('gsm-status');
    const gsmDot = document.getElementById('gsm-dot');
    const systemStatus = document.getElementById('system-status');
    
    // Reset all nodes first
    state.nodes.forEach(n => n.active = true);
    
    switch(scenario) {
        case 'normal':
            scenarioName.textContent = 'NORMAL OPERASYON';
            scenarioName.classList.remove('emergency');
            gsmStatus.textContent = 'ONLINE';
            gsmDot.classList.add('active');
            state.gsmOnline = true;
            systemStatus.textContent = 'STANDBY';
            systemStatus.classList.remove('active', 'emergency');
            log('SYSTEM', 'Senaryo: Normal operasyon');
            break;
            
        case 'earthquake':
            scenarioName.textContent = '⚠️ DEPREM - GSM ÇÖKTÜ';
            scenarioName.classList.add('emergency');
            gsmStatus.textContent = 'OFFLINE';
            gsmDot.classList.remove('active');
            state.gsmOnline = false;
            systemStatus.textContent = 'EMERGENCY';
            systemStatus.classList.add('active', 'emergency');
            log('ERROR', '⚠️ DEPREM! GSM altyapısı çöktü!');
            log('SYSTEM', 'FLARE mesh ağı aktif - Acil durum modu');
            simulateDamage(0.25);
            break;
            
        case 'flood':
            scenarioName.textContent = '🌊 SEL - KISMI HASAR';
            scenarioName.classList.add('emergency');
            gsmStatus.textContent = 'DEGRADED';
            gsmDot.classList.remove('active');
            state.gsmOnline = false;
            systemStatus.textContent = 'EMERGENCY';
            systemStatus.classList.add('active', 'emergency');
            log('ERROR', '🌊 SEL! Kısmi ağ hasarı');
            simulateDamage(0.3);
            break;
    }
    
    updateConnections();
    updateStats();
}

function simulateDamage(probability) {
    state.nodes.forEach(node => {
        if (node.type !== 'gateway' && Math.random() < probability) {
            node.active = false;
            log('ERROR', `NODE-${node.id} hasar gördü`);
        }
    });
}

// ─────────────────────────────────────────────────────────────────────────────────
// UI INTERACTIONS
// ─────────────────────────────────────────────────────────────────────────────────

let isDragging = false;
let dragNode = null;

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedNode = findNodeAt(x, y);
    
    if (state.nodeDisableMode && clickedNode) {
        clickedNode.active = !clickedNode.active;
        log('SYSTEM', `NODE-${clickedNode.id} → ${clickedNode.active ? 'AKTİF' : 'DEVRE DIŞI'}`);
        updateConnections();
        updateStats();
        return;
    }
    
    if (clickedNode) selectNode(clickedNode);
    else deselectNode();
}

function handleCanvasDoubleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickedNode = findNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (clickedNode && clickedNode.active) openMessagePopup(clickedNode);
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const node = findNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (node) {
        isDragging = true;
        dragNode = node;
        canvas.style.cursor = 'grabbing';
    }
}

function handleMouseMove(e) {
    if (isDragging && dragNode) {
        const rect = canvas.getBoundingClientRect();
        dragNode.x = e.clientX - rect.left;
        dragNode.y = e.clientY - rect.top;
        updateConnections();
    }
}

function handleMouseUp() {
    isDragging = false;
    dragNode = null;
    canvas.style.cursor = 'crosshair';
}

function findNodeAt(x, y) {
    for (const node of state.nodes) {
        if (Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20) return node;
    }
    return null;
}

function selectNode(node) {
    state.selectedNode = node;
    document.getElementById('node-info').style.display = 'block';
    
    const typeLabel = node.type === 'gateway' ? 'GATEWAY-' : node.type === 'survivor' ? 'USER-' : 'NODE-';
    document.getElementById('selected-node-id').textContent = typeLabel + node.id;
    document.getElementById('node-rssi').textContent = node.rssi + ' dBm';
    document.getElementById('node-snr').textContent = node.snr + ' dB';
    document.getElementById('node-connections').textContent = state.connections.filter(c => c.from === node || c.to === node).length;
    document.getElementById('node-messages').textContent = node.messagesReceived;
}

function deselectNode() {
    state.selectedNode = null;
    document.getElementById('node-info').style.display = 'none';
}

function toggleNodeMode() {
    state.nodeDisableMode = !state.nodeDisableMode;
    const btn = document.querySelector('.action-btn.danger');
    
    if (state.nodeDisableMode) {
        btn.classList.add('active');
        document.getElementById('node-mode-text').textContent = '[✓ MODU KAPAT]';
        document.getElementById('map-mode-indicator').textContent = '[NODE KAPAT MODU]';
        canvas.style.cursor = 'not-allowed';
    } else {
        btn.classList.remove('active');
        document.getElementById('node-mode-text').textContent = '[🔴 NODE KAPAT MODU]';
        document.getElementById('map-mode-indicator').textContent = '';
        canvas.style.cursor = 'crosshair';
    }
}

function setParam(param, value) {
    state.params[param] = value;
    document.querySelectorAll('.param-btn').forEach(btn => {
        const btnValue = parseInt(btn.textContent);
        if ((param === 'sf' && [7, 9, 10, 12].includes(btnValue)) ||
            (param === 'bw' && [125, 250, 500].includes(btnValue))) {
            btn.classList.toggle('active', btnValue === value);
        }
    });
    updateConnections();
    updateStats();
    log('SYSTEM', `LoRa: ${param.toUpperCase()}=${value}`);
}

// ─────────────────────────────────────────────────────────────────────────────────
// STATS & LOGGING
// ─────────────────────────────────────────────────────────────────────────────────

function updateStats() {
    const total = state.nodes.length;
    const active = state.nodes.filter(n => n.active).length;
    
    document.getElementById('stat-nodes').textContent = `${active}/${total}`;
    document.getElementById('stat-connections').textContent = state.connections.length;
    
    const delivery = state.totalMessages > 0 ? 
        Math.round((state.deliveredMessages / (state.totalMessages * active)) * 100) : '-';
    document.getElementById('stat-delivery').textContent = delivery === '-' ? '-' : Math.min(100, delivery) + '%';
}

function log(type, message) {
    const logDisplay = document.getElementById('log-display');
    const time = new Date().toLocaleTimeString('tr-TR');
    
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type.toLowerCase();
    entry.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
    
    logDisplay.appendChild(entry);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────────────────────────────────────────

function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    if (state.selectedNode) drawRangeCircle(state.selectedNode);
    drawConnections();
    drawNodes();
    drawPulseAnimations();
}

function drawGrid() {
    ctx.strokeStyle = '#1a1a00';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawConnections() {
    for (const conn of state.connections) {
        const alpha = conn.quality === 'excellent' ? 0.8 : conn.quality === 'good' ? 0.6 : conn.quality === 'fair' ? 0.4 : 0.2;
        let isActive = false;
        
        if (state.propagatingMessage) {
            const msg = state.propagatingMessage;
            isActive = msg.reachedNodes.has(conn.from.id) && msg.reachedNodes.has(conn.to.id);
        }
        
        ctx.strokeStyle = isActive ? '#00ff88' : `rgba(0, 170, 255, ${alpha})`;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.stroke();
    }
}

function drawNodes() {
    for (const node of state.nodes) {
        const isSelected = state.selectedNode === node;
        const size = node.type === 'gateway' ? 18 : node.type === 'survivor' ? 14 : 12;
        
        // Glow
        if (node.active) {
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 10);
            const color = node.type === 'gateway' ? '0, 255, 136' : node.type === 'survivor' ? '255, 221, 0' : '209, 255, 0';
            gradient.addColorStop(0, `rgba(${color}, 0.3)`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Body
        ctx.fillStyle = !node.active ? '#333' : node.type === 'gateway' ? '#00ff88' : node.type === 'survivor' ? '#ffdd00' : '#d1ff00';
        
        if (node.type === 'gateway') {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y - size);
            ctx.lineTo(node.x + size, node.y);
            ctx.lineTo(node.x, node.y + size);
            ctx.lineTo(node.x - size, node.y);
            ctx.closePath();
            ctx.fill();
        } else if (node.type === 'survivor') {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y - size);
            ctx.lineTo(node.x + size, node.y + size);
            ctx.lineTo(node.x - size, node.y + size);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Selection ring
        if (isSelected) {
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Label
        ctx.fillStyle = node.active ? '#fff' : '#666';
        ctx.font = 'bold 9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(node.type === 'gateway' ? 'GW' : node.type === 'survivor' ? '👤' : node.id, node.x, node.y + 3);
        
        // Inactive marker
        if (!node.active) {
            ctx.fillStyle = '#ff3366';
            ctx.font = 'bold 12px Courier New';
            ctx.fillText('✕', node.x, node.y - size - 5);
        }
    }
}

function drawRangeCircle(node) {
    const range = calculateRange();
    ctx.strokeStyle = 'rgba(0, 170, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(node.x, node.y, range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#00aaff';
    ctx.font = '10px Courier New';
    ctx.fillText(`${Math.round(range)}px`, node.x + range + 5, node.y);
}

function drawPulseAnimations() {
    for (const node of state.nodes) {
        if (node.isPulsing) {
            node.pulseRadius += 3;
            const alpha = 1 - (node.pulseRadius / 80);
            if (alpha > 0) {
                ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                node.isPulsing = false;
                node.pulseRadius = 0;
            }
        }
    }
}

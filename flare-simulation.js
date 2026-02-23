/* ═══════════════════════════════════════════════════════════════════════════════
   FLARE MESH NETWORK SIMULATOR - ENGINE
   Tactical Emergency Mesh Network Visualization
═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS & STATE
// ─────────────────────────────────────────────────────────────────────────────────

const LORA_CONFIG = {
    // Spreading Factor → Range multiplier
    SF: { 7: 0.6, 9: 0.8, 10: 1.0, 12: 1.4 },
    // Bandwidth → Speed multiplier (inverse for range)
    BW: { 125: 1.2, 250: 1.0, 500: 0.8 },
    // Base range in pixels (at SF10, BW250, TX14)
    BASE_RANGE: 150,
    // TX Power range modifier
    TX_RANGE_FACTOR: 5, // pixels per dBm
};

const state = {
    nodes: [],
    connections: [],
    selectedNode: null,
    // LoRa Parameters
    params: {
        sf: 10,
        bw: 250,
        txPower: 14
    },
    // Scenario
    scenario: 'normal',
    gsmOnline: true,
    // UI Mode
    nodeDisableMode: false,
    // Animation
    propagatingMessage: null,
    messageQueue: [],
    // Stats
    totalMessages: 0,
    deliveredMessages: 0
};

let canvas, ctx;
let animationId;
let nodeIdCounter = 0;

// ─────────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initClock();
    initEventListeners();
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
    // Canvas interactions
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('dblclick', handleCanvasDoubleClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    // TX Power slider
    const txSlider = document.getElementById('tx-power');
    txSlider.addEventListener('input', (e) => {
        state.params.txPower = parseInt(e.target.value);
        document.getElementById('tx-power-val').innerText = state.params.txPower + ' dBm';
        updateConnections();
    });
}

function createInitialNodes() {
    // Create some demo nodes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Gateway/Base station
    addNodeAt(centerX, centerY - 80, 'gateway');
    
    // Regular nodes
    addNodeAt(centerX - 120, centerY + 20, 'node');
    addNodeAt(centerX + 130, centerY + 30, 'node');
    addNodeAt(centerX - 60, centerY + 120, 'node');
    addNodeAt(centerX + 70, centerY + 100, 'node');
    
    // Survivor node
    addNodeAt(centerX + 10, centerY + 180, 'survivor');
    
    log('SYSTEM', '6 node ile demo ağ oluşturuldu');
}

// ─────────────────────────────────────────────────────────────────────────────────
// NODE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

function addNode() {
    const x = 50 + Math.random() * (canvas.width - 100);
    const y = 50 + Math.random() * (canvas.height - 100);
    addNodeAt(x, y, 'node');
}

function addNodeAt(x, y, type = 'node') {
    nodeIdCounter++;
    const node = {
        id: nodeIdCounter,
        x: x,
        y: y,
        type: type, // 'gateway', 'node', 'survivor'
        active: true,
        rssi: -50,
        snr: 10,
        messagesReceived: 0,
        lastMessageTime: null,
        // For animation
        pulseRadius: 0,
        isPulsing: false
    };
    
    state.nodes.push(node);
    updateConnections();
    updateStats();
    
    const typeLabel = type === 'gateway' ? 'GATEWAY' : type === 'survivor' ? 'KULLANICI' : 'NODE';
    log('SYSTEM', `${typeLabel}-${node.id} ağa eklendi [${Math.round(x)}, ${Math.round(y)}]`);
    
    return node;
}

function toggleSelectedNode() {
    if (state.selectedNode) {
        state.selectedNode.active = !state.selectedNode.active;
        const status = state.selectedNode.active ? 'AKTİF' : 'DEVRE DIŞI';
        log('SYSTEM', `NODE-${state.selectedNode.id} şimdi ${status}`);
        updateConnections();
        updateStats();
    }
}

function removeNode(node) {
    const index = state.nodes.indexOf(node);
    if (index > -1) {
        state.nodes.splice(index, 1);
        if (state.selectedNode === node) {
            state.selectedNode = null;
            document.getElementById('node-info').style.display = 'none';
        }
        updateConnections();
        updateStats();
        log('SYSTEM', `NODE-${node.id} ağdan kaldırıldı`);
    }
}

function resetNetwork() {
    state.nodes = [];
    state.connections = [];
    state.selectedNode = null;
    state.propagatingMessage = null;
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
    // Simple RSSI model: -50 dBm at closest, -130 dBm at max range
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
            
            const distance = Math.sqrt(
                Math.pow(nodeA.x - nodeB.x, 2) + 
                Math.pow(nodeA.y - nodeB.y, 2)
            );
            
            if (distance <= range) {
                const rssi = calculateRSSI(distance, range);
                state.connections.push({
                    from: nodeA,
                    to: nodeB,
                    distance: distance,
                    rssi: rssi,
                    quality: rssi > -70 ? 'excellent' : rssi > -90 ? 'good' : rssi > -110 ? 'fair' : 'weak'
                });
                
                // Update node RSSI (average of connections)
                nodeA.rssi = rssi;
                nodeB.rssi = rssi;
            }
        }
    }
    
    updateStats();
}

// ─────────────────────────────────────────────────────────────────────────────────
// MESSAGE PROPAGATION
// ─────────────────────────────────────────────────────────────────────────────────

function sendFromSelected() {
    if (state.selectedNode) {
        openMessagePopup(state.selectedNode);
    }
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
    const msgInput = document.getElementById('msg-input');
    const text = msgInput.value.trim();
    
    if (!text || !state.messageSourceNode) {
        closeMessagePopup();
        return;
    }
    
    const sourceNode = state.messageSourceNode;
    closeMessagePopup();
    
    // Start propagation
    propagateMessage(sourceNode, text);
}

function propagateMessage(sourceNode, text) {
    state.totalMessages++;
    
    const message = {
        id: Date.now(),
        text: text,
        sourceNode: sourceNode,
        reachedNodes: new Set([sourceNode.id]),
        hops: 0,
        startTime: Date.now(),
        path: [sourceNode],
        currentWave: [sourceNode],
        nextWave: [],
        complete: false
    };
    
    state.propagatingMessage = message;
    
    // Start pulse animation on source
    sourceNode.isPulsing = true;
    sourceNode.pulseRadius = 0;
    
    log('PROPAGATION', `NODE-${sourceNode.id}'den mesaj gönderildi: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    
    // Propagate in waves
    propagateWave(message);
}

function propagateWave(message) {
    if (message.complete) return;
    
    const range = calculateRange();
    message.nextWave = [];
    
    // Find all nodes reachable from current wave
    for (const currentNode of message.currentWave) {
        for (const node of state.nodes) {
            if (!node.active) continue;
            if (message.reachedNodes.has(node.id)) continue;
            
            const distance = Math.sqrt(
                Math.pow(currentNode.x - node.x, 2) + 
                Math.pow(currentNode.y - node.y, 2)
            );
            
            if (distance <= range) {
                message.reachedNodes.add(node.id);
                message.nextWave.push(node);
                message.path.push(node);
                node.messagesReceived++;
                node.lastMessageTime = Date.now();
                
                // Pulse animation
                node.isPulsing = true;
                node.pulseRadius = 0;
                
                log('PROPAGATION', `→ NODE-${node.id} mesajı aldı (HOP ${message.hops + 1})`);
            }
        }
    }
    
    if (message.nextWave.length > 0) {
        message.hops++;
        message.currentWave = message.nextWave;
        
        // Update propagation display
        updatePropagationDisplay(message);
        
        // Continue propagation after delay
        setTimeout(() => propagateWave(message), 500);
    } else {
        // Propagation complete
        message.complete = true;
        const endTime = Date.now();
        const duration = endTime - message.startTime;
        
        state.deliveredMessages += message.reachedNodes.size;
        
        log('SUCCESS', `Mesaj yayılımı tamamlandı: ${message.reachedNodes.size}/${state.nodes.filter(n => n.active).length} node'a ulaştı, ${message.hops} hop, ${duration}ms`);
        
        updatePropagationDisplay(message, true);
        updateStats();
        
        // Clear propagation after a moment
        setTimeout(() => {
            state.propagatingMessage = null;
            state.nodes.forEach(n => n.isPulsing = false);
        }, 2000);
    }
}

function updatePropagationDisplay(message, complete = false) {
    const activeNodes = state.nodes.filter(n => n.active).length;
    const progress = Math.round((message.reachedNodes.size / activeNodes) * 100);
    
    document.getElementById('prop-progress').innerText = progress + '%';
    document.getElementById('prop-fill').style.width = progress + '%';
    document.getElementById('prop-hops').innerText = message.hops;
    document.getElementById('prop-time').innerText = (Date.now() - message.startTime) + 'ms';
    document.getElementById('prop-reached').innerText = message.reachedNodes.size + '/' + activeNodes;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SCENARIOS
// ─────────────────────────────────────────────────────────────────────────────────

function setScenario(scenario) {
    state.scenario = scenario;
    
    // Update buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const scenarioName = document.getElementById('scenario-name');
    const gsmStatus = document.getElementById('gsm-status');
    const gsmDot = document.getElementById('gsm-dot');
    const systemStatus = document.getElementById('system-status');
    
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
            scenarioName.textContent = '⚠️ DEPREM - GSM ALTYAPISI ÇÖKTÜ';
            scenarioName.classList.add('emergency');
            gsmStatus.textContent = 'OFFLINE';
            gsmDot.classList.remove('active');
            state.gsmOnline = false;
            systemStatus.textContent = 'EMERGENCY MODE';
            systemStatus.classList.add('active', 'emergency');
            log('ERROR', '⚠️ DEPREM TESPİT EDİLDİ - GSM ALTYAPISI ÇÖKTÜ');
            log('SYSTEM', 'FLARE MESH AĞI AKTİF - Acil durum modu başlatıldı');
            
            // Randomly disable some nodes to simulate damage
            simulateDamage(0.2);
            break;
            
        case 'flood':
            scenarioName.textContent = '🌊 SEL - KISMI AĞ HASARI';
            scenarioName.classList.add('emergency');
            gsmStatus.textContent = 'DEGRADED';
            gsmDot.classList.remove('active');
            state.gsmOnline = false;
            systemStatus.textContent = 'EMERGENCY MODE';
            systemStatus.classList.add('active', 'emergency');
            log('ERROR', '🌊 SEL UYARISI - Kısmi ağ hasarı');
            log('SYSTEM', 'FLARE MESH AĞI AKTİF');
            
            simulateDamage(0.3);
            break;
    }
}

function simulateDamage(probability) {
    state.nodes.forEach(node => {
        if (node.type !== 'gateway' && Math.random() < probability) {
            node.active = false;
            log('ERROR', `NODE-${node.id} hasar gördü - devre dışı`);
        }
    });
    updateConnections();
    updateStats();
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
    
    // Check if clicked on a node
    const clickedNode = findNodeAt(x, y);
    
    if (state.nodeDisableMode && clickedNode) {
        clickedNode.active = !clickedNode.active;
        const status = clickedNode.active ? 'AKTİF' : 'DEVRE DIŞI';
        log('SYSTEM', `NODE-${clickedNode.id} → ${status}`);
        updateConnections();
        updateStats();
        return;
    }
    
    if (clickedNode) {
        selectNode(clickedNode);
    } else {
        deselectNode();
    }
}

function handleCanvasDoubleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedNode = findNodeAt(x, y);
    
    if (clickedNode && clickedNode.active) {
        openMessagePopup(clickedNode);
    }
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const node = findNodeAt(x, y);
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

function handleMouseUp(e) {
    isDragging = false;
    dragNode = null;
    canvas.style.cursor = 'crosshair';
}

function findNodeAt(x, y) {
    for (const node of state.nodes) {
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        if (distance < 20) {
            return node;
        }
    }
    return null;
}

function selectNode(node) {
    state.selectedNode = node;
    
    const infoPanel = document.getElementById('node-info');
    infoPanel.style.display = 'block';
    
    document.getElementById('selected-node-id').textContent = 
        (node.type === 'gateway' ? 'GATEWAY-' : node.type === 'survivor' ? 'USER-' : 'NODE-') + node.id;
    document.getElementById('node-rssi').textContent = node.rssi + ' dBm';
    document.getElementById('node-snr').textContent = node.snr + ' dB';
    
    const connections = state.connections.filter(c => c.from === node || c.to === node).length;
    document.getElementById('node-connections').textContent = connections;
    document.getElementById('node-messages').textContent = node.messagesReceived;
}

function deselectNode() {
    state.selectedNode = null;
    document.getElementById('node-info').style.display = 'none';
}

function toggleNodeMode() {
    state.nodeDisableMode = !state.nodeDisableMode;
    const btn = document.querySelector('.action-btn.danger');
    const text = document.getElementById('node-mode-text');
    
    if (state.nodeDisableMode) {
        btn.classList.add('active');
        text.textContent = '[✓ KAPAT MODU AKTİF]';
        document.getElementById('map-mode-indicator').textContent = '[NODE KAPAT MODU]';
        canvas.style.cursor = 'not-allowed';
    } else {
        btn.classList.remove('active');
        text.textContent = '[🔴 NODE KAPAT MODU]';
        document.getElementById('map-mode-indicator').textContent = '';
        canvas.style.cursor = 'crosshair';
    }
}

function setParam(param, value) {
    state.params[param] = value;
    
    // Update button states
    document.querySelectorAll(`.param-btn`).forEach(btn => {
        const btnValue = parseInt(btn.textContent);
        if (param === 'sf' && [7, 9, 10, 12].includes(btnValue)) {
            btn.classList.toggle('active', btnValue === value);
        }
        if (param === 'bw' && [125, 250, 500].includes(btnValue)) {
            btn.classList.toggle('active', btnValue === value);
        }
    });
    
    updateConnections();
    log('SYSTEM', `LoRa parametresi güncellendi: ${param.toUpperCase()}=${value}`);
}

// ─────────────────────────────────────────────────────────────────────────────────
// STATS & LOGGING
// ─────────────────────────────────────────────────────────────────────────────────

function updateStats() {
    const totalNodes = state.nodes.length;
    const activeNodes = state.nodes.filter(n => n.active).length;
    
    document.getElementById('stat-nodes').textContent = `${activeNodes}/${totalNodes}`;
    
    // Calculate average hops (simplified)
    const avgHops = state.connections.length > 0 ? 
        (state.connections.length / activeNodes).toFixed(1) : '0.0';
    document.getElementById('stat-hops').textContent = avgHops;
    
    // Coverage (based on connections)
    const maxPossibleConnections = (activeNodes * (activeNodes - 1)) / 2;
    const coverage = maxPossibleConnections > 0 ? 
        Math.round((state.connections.length / maxPossibleConnections) * 100) : 0;
    document.getElementById('stat-coverage').textContent = coverage + '%';
    
    // Delivery rate
    const delivery = state.totalMessages > 0 ? 
        Math.round((state.deliveredMessages / (state.totalMessages * activeNodes)) * 100) : 100;
    document.getElementById('stat-delivery').textContent = Math.min(100, delivery) + '%';
}

function log(type, message) {
    const logDisplay = document.getElementById('log-display');
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    switch(type) {
        case 'ERROR':
            entry.classList.add('error');
            break;
        case 'SUCCESS':
            entry.classList.add('success');
            break;
        case 'PROPAGATION':
            entry.classList.add('propagation');
            break;
        case 'SYSTEM':
        default:
            entry.classList.add('system');
            break;
    }
    
    entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    logDisplay.appendChild(entry);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────────────────────
// RENDERING
// ─────────────────────────────────────────────────────────────────────────────────

function gameLoop() {
    render();
    animationId = requestAnimationFrame(gameLoop);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw range circles for selected node
    if (state.selectedNode) {
        drawRangeCircle(state.selectedNode);
    }
    
    // Draw connections
    drawConnections();
    
    // Draw nodes
    drawNodes();
    
    // Draw pulse animations
    drawPulseAnimations();
}

function drawGrid() {
    ctx.strokeStyle = '#1a1a00';
    ctx.lineWidth = 0.5;
    
    const gridSize = 30;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawConnections() {
    for (const conn of state.connections) {
        const alpha = conn.quality === 'excellent' ? 0.8 : 
                     conn.quality === 'good' ? 0.6 : 
                     conn.quality === 'fair' ? 0.4 : 0.2;
        
        // Check if this connection is part of active propagation
        let isActiveConnection = false;
        if (state.propagatingMessage) {
            const msg = state.propagatingMessage;
            isActiveConnection = msg.reachedNodes.has(conn.from.id) && msg.reachedNodes.has(conn.to.id);
        }
        
        ctx.strokeStyle = isActiveConnection ? '#00ff88' : `rgba(0, 170, 255, ${alpha})`;
        ctx.lineWidth = isActiveConnection ? 3 : 2;
        
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.stroke();
        
        // Draw RSSI indicator at midpoint
        if (conn.quality !== 'excellent') {
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2;
            
            ctx.fillStyle = conn.quality === 'good' ? '#88ff00' : 
                           conn.quality === 'fair' ? '#ffaa00' : '#ff6600';
            ctx.font = '8px Courier New';
            ctx.fillText(conn.rssi + 'dBm', midX - 15, midY - 5);
        }
    }
}

function drawNodes() {
    for (const node of state.nodes) {
        const isSelected = state.selectedNode === node;
        const size = node.type === 'gateway' ? 18 : node.type === 'survivor' ? 14 : 12;
        
        // Node glow
        if (node.active) {
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size + 10);
            const color = node.type === 'gateway' ? '0, 255, 136' : 
                         node.type === 'survivor' ? '255, 221, 0' : '209, 255, 0';
            gradient.addColorStop(0, `rgba(${color}, 0.3)`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Node body
        ctx.fillStyle = !node.active ? '#333333' :
                       node.type === 'gateway' ? '#00ff88' : 
                       node.type === 'survivor' ? '#ffdd00' : '#d1ff00';
        
        if (node.type === 'gateway') {
            // Diamond shape for gateway
            ctx.beginPath();
            ctx.moveTo(node.x, node.y - size);
            ctx.lineTo(node.x + size, node.y);
            ctx.lineTo(node.x, node.y + size);
            ctx.lineTo(node.x - size, node.y);
            ctx.closePath();
            ctx.fill();
        } else if (node.type === 'survivor') {
            // Triangle for survivor/user
            ctx.beginPath();
            ctx.moveTo(node.x, node.y - size);
            ctx.lineTo(node.x + size, node.y + size);
            ctx.lineTo(node.x - size, node.y + size);
            ctx.closePath();
            ctx.fill();
        } else {
            // Circle for regular nodes
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
        
        // Node label
        ctx.fillStyle = node.active ? '#ffffff' : '#666666';
        ctx.font = 'bold 9px Courier New';
        ctx.textAlign = 'center';
        const label = node.type === 'gateway' ? 'GW' : node.type === 'survivor' ? 'USR' : node.id;
        ctx.fillText(label, node.x, node.y + 3);
        
        // Status indicator for inactive nodes
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
    
    // Range label
    ctx.fillStyle = '#00aaff';
    ctx.font = '10px Courier New';
    ctx.fillText(`${Math.round(range)}px range`, node.x + range + 5, node.y);
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

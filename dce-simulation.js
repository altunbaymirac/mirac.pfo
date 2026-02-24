/* ═══════════════════════════════════════════════════════════════════════════════
   DCE-SOFC HİBRİT SİSTEM - FİZİK MOTORU & UI
   Dijital İkiz Simülasyonu v2.0
═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────────
// SABİTLER
// ─────────────────────────────────────────────────────────────────────────────────

const PHYSICS = {
    R: 8.314,  // J/(mol·K)
    ARRHENIUS: {
        Ru: { A: 1.2e12, Ea: 80000, name: 'Ruthenium' },
        Ni: { A: 8.5e11, Ea: 120000, name: 'Nickel' }
    },
    SOFC: {
        OPERATING_TEMP: 750,
        WARMUP_TEMP: 600,
        EFF_ELECTRIC: 0.55,
        EFF_THERMAL: 0.35
    },
    MAX_PRESSURE: 30,  // MPa
    OPTIMAL_TEMP_MIN: 600,
    OPTIMAL_TEMP_MAX: 800
};

// ─────────────────────────────────────────────────────────────────────────────────
// SİSTEM DURUMU
// ─────────────────────────────────────────────────────────────────────────────────

const state = {
    running: false,
    // Kontrol değerleri
    motorLoad: 75,
    residenceTime: 2.5,
    targetTemp: 700,
    sofcEnabled: true,
    whrEnabled: true,
    catalyst: 'Ru',
    // Fizik değişkenleri
    reactorTemp: 25,
    sofcTemp: 25,
    reactorPressure: 0.1,
    conversionRate: 0,
    sofcElectric: 0,
    sofcThermal: 0,
    motorPower: 0,
    batterySOC: 65,
    batteryPower: 0,
    nh3Level: 85,
    // Zaman
    t: 0,
    lastUpdate: 0
};

// Chart veri geçmişi
const chartHistory = {
    temp: [],
    conv: [],
    maxPoints: 60
};

// ─────────────────────────────────────────────────────────────────────────────────
// BAŞLATMA
// ─────────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initSliders();
    initCatalystDots();
    initChart();
    requestAnimationFrame(gameLoop);
});

function initClock() {
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

function initSliders() {
    // Motor yükü
    const motorSlider = document.getElementById('motor-load');
    motorSlider.addEventListener('input', (e) => {
        state.motorLoad = parseInt(e.target.value);
        document.getElementById('motor-load-val').innerText = state.motorLoad + '%';
    });

    // Rezidans süresi
    const resSlider = document.getElementById('residence-time');
    resSlider.addEventListener('input', (e) => {
        state.residenceTime = parseInt(e.target.value) / 10;
        document.getElementById('residence-time-val').innerText = state.residenceTime.toFixed(1) + 's';
        document.getElementById('param-tau').innerText = state.residenceTime.toFixed(1);
    });

    // Hedef sıcaklık
    const tempSlider = document.getElementById('target-temp');
    tempSlider.addEventListener('input', (e) => {
        state.targetTemp = parseInt(e.target.value);
        document.getElementById('target-temp-val').innerText = state.targetTemp + '°C';
    });
}

function initCatalystDots() {
    const dotsGroup = document.getElementById('catalyst-dots');
    for (let i = 0; i < 80; i++) {
        const cx = 235 + (i % 10) * 10;
        const cy = 190 + Math.floor(i / 10) * 10;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 2);
        circle.setAttribute('fill', '#666600');
        circle.setAttribute('opacity', 0.5);
        dotsGroup.appendChild(circle);
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// CHART (Canvas)
// ─────────────────────────────────────────────────────────────────────────────────

let chartCtx;

function initChart() {
    const canvas = document.getElementById('live-chart');
    chartCtx = canvas.getContext('2d');
    // İlk çizim
    drawChart();
}

function drawChart() {
    if (!chartCtx) return;
    
    const canvas = chartCtx.canvas;
    const w = canvas.width;
    const h = canvas.height;
    
    // Temizle
    chartCtx.fillStyle = '#0a0a00';
    chartCtx.fillRect(0, 0, w, h);
    
    // Grid
    chartCtx.strokeStyle = '#1a1a00';
    chartCtx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
        const y = (h / 5) * i;
        chartCtx.beginPath();
        chartCtx.moveTo(0, y);
        chartCtx.lineTo(w, y);
        chartCtx.stroke();
    }
    
    // Sıcaklık çizgisi (turuncu)
    if (chartHistory.temp.length > 1) {
        chartCtx.strokeStyle = '#ff6600';
        chartCtx.lineWidth = 2;
        chartCtx.beginPath();
        chartHistory.temp.forEach((val, i) => {
            const x = (i / chartHistory.maxPoints) * w;
            const y = h - (val / 900) * h;
            if (i === 0) chartCtx.moveTo(x, y);
            else chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
    }
    
    // Dönüşüm çizgisi (yeşil)
    if (chartHistory.conv.length > 1) {
        chartCtx.strokeStyle = '#00ff88';
        chartCtx.lineWidth = 2;
        chartCtx.beginPath();
        chartHistory.conv.forEach((val, i) => {
            const x = (i / chartHistory.maxPoints) * w;
            const y = h - (val / 100) * h;
            if (i === 0) chartCtx.moveTo(x, y);
            else chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// KONTROL FONKSİYONLARI
// ─────────────────────────────────────────────────────────────────────────────────

function toggleSystem() {
    state.running = !state.running;
    const btn = document.getElementById('btn-start');
    const statusEl = document.getElementById('system-status');
    
    if (state.running) {
        btn.innerHTML = '[■ SİSTEMİ DURDUR]';
        btn.classList.add('running');
        statusEl.innerText = 'RUNNING';
        statusEl.classList.add('active');
        state.lastUpdate = performance.now();
    } else {
        btn.innerHTML = '[▶ SİSTEMİ BAŞLAT]';
        btn.classList.remove('running');
        statusEl.innerText = 'STANDBY';
        statusEl.classList.remove('active');
    }
}

function resetSystem() {
    state.running = false;
    state.reactorTemp = 25;
    state.sofcTemp = 25;
    state.reactorPressure = 0.1;
    state.conversionRate = 0;
    state.sofcElectric = 0;
    state.sofcThermal = 0;
    state.motorPower = 0;
    state.batterySOC = 65;
    state.nh3Level = 85;
    state.t = 0;
    
    chartHistory.temp = [];
    chartHistory.conv = [];
    
    document.getElementById('btn-start').innerHTML = '[▶ SİSTEMİ BAŞLAT]';
    document.getElementById('btn-start').classList.remove('running');
    document.getElementById('system-status').innerText = 'STANDBY';
    document.getElementById('system-status').classList.remove('active');
    
    updateUI();
}

function toggleSwitch(name) {
    const btn = document.getElementById('sw-' + name);
    if (name === 'sofc') {
        state.sofcEnabled = !state.sofcEnabled;
    } else if (name === 'whr') {
        state.whrEnabled = !state.whrEnabled;
    }
    
    if ((name === 'sofc' && state.sofcEnabled) || (name === 'whr' && state.whrEnabled)) {
        btn.classList.add('active');
        btn.querySelector('.sw-status').innerText = 'ON';
    } else {
        btn.classList.remove('active');
        btn.querySelector('.sw-status').innerText = 'OFF';
    }
}

function setCatalyst(type) {
    state.catalyst = type;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('cat-' + type).classList.add('active');
    
    const info = document.getElementById('catalyst-info');
    if (type === 'Ru') {
        info.innerText = 'Eₐ = 80 kJ/mol';
        document.getElementById('param-A').innerText = '1.2×10¹²';
        document.getElementById('param-Ea').innerText = '80';
    } else {
        info.innerText = 'Eₐ = 120 kJ/mol';
        document.getElementById('param-A').innerText = '8.5×10¹¹';
        document.getElementById('param-Ea').innerText = '120';
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// FİZİK MOTORU
// ─────────────────────────────────────────────────────────────────────────────────

function gameLoop(timestamp) {
    if (!state.lastUpdate) state.lastUpdate = timestamp;
    const dt = Math.min((timestamp - state.lastUpdate) / 1000, 0.1);
    state.lastUpdate = timestamp;
    
    if (state.running) {
        state.t += dt;
        updatePhysics(dt);
    }
    
    // UI her zaman güncelle (cooldown için)
    if (!state.running && (state.reactorTemp > 25 || state.sofcTemp > 25)) {
        cooldownPhysics(dt);
    }
    
    // Her 100ms'de UI güncelle
    if (Math.floor(timestamp / 100) !== Math.floor((timestamp - 16) / 100)) {
        updateUI();
        
        // Chart verisi ekle
        if (state.running) {
            chartHistory.temp.push(state.reactorTemp);
            chartHistory.conv.push(state.conversionRate * 100);
            if (chartHistory.temp.length > chartHistory.maxPoints) {
                chartHistory.temp.shift();
                chartHistory.conv.shift();
            }
            drawChart();
        }
    }
    
    requestAnimationFrame(gameLoop);
}

function updatePhysics(dt) {
    // ─────────────────────────────────────────────────
    // SOFC Dinamikleri
    // ─────────────────────────────────────────────────
    if (state.sofcEnabled) {
        const targetSOFCTemp = PHYSICS.SOFC.OPERATING_TEMP;
        state.sofcTemp += (targetSOFCTemp - state.sofcTemp) * 0.3 * dt;
        
        if (state.sofcTemp > 600) {
            const loadFactor = state.motorLoad / 100;
            const nh3Input = 80 * loadFactor;
            const energyInput = (nh3Input / 3600) * 18.6 * 1000;
            state.sofcElectric = energyInput * PHYSICS.SOFC.EFF_ELECTRIC;
            state.sofcThermal = energyInput * PHYSICS.SOFC.EFF_THERMAL;
        }
    } else {
        state.sofcTemp = Math.max(25, state.sofcTemp - 10 * dt);
        state.sofcElectric = Math.max(0, state.sofcElectric - 50 * dt);
        state.sofcThermal = Math.max(0, state.sofcThermal - 30 * dt);
    }
    
    // ─────────────────────────────────────────────────
    // Reaktör Termal Dinamikleri
    // ─────────────────────────────────────────────────
    let targetReactorTemp = 400;
    
    if (state.whrEnabled && state.sofcThermal > 0) {
        // SOFC atık ısısından ısınma
        targetReactorTemp = 400 + (state.sofcThermal / 100) * 450;
    }
    
    // Hedef sıcaklık ile sınırla
    targetReactorTemp = Math.min(state.targetTemp, targetReactorTemp);
    
    state.reactorTemp += (targetReactorTemp - state.reactorTemp) * 0.5 * dt;
    state.reactorTemp = Math.max(25, Math.min(850, state.reactorTemp));
    
    // ─────────────────────────────────────────────────
    // Arrhenius Kinetiği
    // ─────────────────────────────────────────────────
    const catalyst = PHYSICS.ARRHENIUS[state.catalyst];
    const T_kelvin = state.reactorTemp + 273.15;
    const k = catalyst.A * Math.exp(-catalyst.Ea / (PHYSICS.R * T_kelvin));
    const maxK = catalyst.A * Math.exp(-catalyst.Ea / (PHYSICS.R * 1100));
    
    // X = 1 - exp(-k*tau)
    const normalizedK = k / maxK;
    state.conversionRate = Math.min(0.98, normalizedK * (1 - Math.exp(-state.residenceTime / 2)));
    
    // ─────────────────────────────────────────────────
    // Basınç Dinamikleri
    // ─────────────────────────────────────────────────
    if (state.conversionRate > 0.1) {
        const n_products = 2 * state.conversionRate;
        state.reactorPressure = (n_products * PHYSICS.R * T_kelvin) / (0.05 * 1e6);
        state.reactorPressure = Math.min(PHYSICS.MAX_PRESSURE, Math.max(5, state.reactorPressure));
        // Dalgalanma ekle
        state.reactorPressure += Math.sin(state.t * 3) * 1.5;
    }
    
    // ─────────────────────────────────────────────────
    // Motor Gücü
    // ─────────────────────────────────────────────────
    const strokeVolume = Math.PI * Math.pow(0.4 / 2, 2) * 0.5;
    const workPerStroke = state.reactorPressure * 1e6 * strokeVolume * 0.35;
    state.motorPower = (workPerStroke * (state.motorLoad / 50)) / 1000;
    
    // ─────────────────────────────────────────────────
    // Batarya Dinamikleri
    // ─────────────────────────────────────────────────
    if (state.sofcElectric > state.motorPower * 0.2) {
        state.batteryPower = Math.min(100, state.sofcElectric * 0.2);
        state.batterySOC = Math.min(100, state.batterySOC + state.batteryPower * 0.0005 * dt);
    } else {
        state.batteryPower = 0;
    }
    
    // ─────────────────────────────────────────────────
    // NH3 Tüketimi
    // ─────────────────────────────────────────────────
    state.nh3Level = Math.max(0, state.nh3Level - 0.008 * (state.motorLoad / 100) * dt);
}

function cooldownPhysics(dt) {
    state.reactorTemp = Math.max(25, state.reactorTemp - 15 * dt);
    state.sofcTemp = Math.max(25, state.sofcTemp - 10 * dt);
    state.reactorPressure = Math.max(0.1, state.reactorPressure - 2 * dt);
    state.sofcElectric = Math.max(0, state.sofcElectric - 30 * dt);
    state.sofcThermal = Math.max(0, state.sofcThermal - 20 * dt);
    state.motorPower = Math.max(0, state.motorPower - 80 * dt);
    state.conversionRate = Math.max(0, state.conversionRate - 0.08 * dt);
}

// ─────────────────────────────────────────────────────────────────────────────────
// UI GÜNCELLEME
// ─────────────────────────────────────────────────────────────────────────────────

function updateUI() {
    // LED'ler
    updateLED('led-sofc', state.sofcEnabled && state.sofcTemp > 600);
    updateLED('led-reactor', state.reactorTemp > 400);
    updateLED('led-motor', state.motorPower > 10);
    updateLED('led-battery', state.batteryPower > 0, state.batterySOC < 30);
    
    // SVG P&ID
    updatePID();
    
    // Sağ panel verileri
    updateDataPanel();
    
    // Formül sonuçları
    document.getElementById('result-x').innerText = 'X = ' + (state.conversionRate * 100).toFixed(1) + '%';
}

function updateLED(id, active, warning = false) {
    const led = document.getElementById(id);
    led.classList.remove('active', 'warning');
    if (warning) {
        led.classList.add('warning');
    } else if (active) {
        led.classList.add('active');
    }
}

function updatePID() {
    // Flow animasyonları
    updateFlow('flow-nh3', state.running && state.nh3Level > 0);
    updateFlow('flow-heat', state.running && state.whrEnabled && state.sofcThermal > 10);
    updateFlow('flow-product', state.running && state.conversionRate > 0.1);
    updateFlow('flow-output', state.running && state.motorPower > 10);
    updateFlow('flow-electric', state.running && state.batteryPower > 0);
    
    // Tank seviyesi
    const tankLevel = document.getElementById('tank-level');
    tankLevel.setAttribute('y', 200 + (1 - state.nh3Level / 100) * 37);
    tankLevel.setAttribute('height', (state.nh3Level / 100) * 37);
    document.getElementById('tank-percent').textContent = Math.round(state.nh3Level) + '%';
    
    // SOFC
    document.getElementById('sofc-power').textContent = Math.round(state.sofcElectric) + ' kW';
    document.getElementById('sofc-temp').textContent = Math.round(state.sofcTemp) + '°C';
    const sofcGlow = document.getElementById('sofc-glow');
    sofcGlow.setAttribute('opacity', state.sofcTemp > 600 ? 0.3 : 0);
    
    // SOFC hücre renkleri
    document.querySelectorAll('.sofc-cell').forEach((cell, i) => {
        if (state.sofcTemp > 600) {
            cell.style.fill = '#ffaa00';
            cell.style.opacity = 0.3 + (i % 2) * 0.2;
        } else {
            cell.style.fill = '#1a1a00';
            cell.style.opacity = 1;
        }
    });
    
    // Reaktör
    document.getElementById('reactor-temp').textContent = Math.round(state.reactorTemp) + '°C';
    document.getElementById('reactor-pressure').textContent = state.reactorPressure.toFixed(1) + ' MPa';
    document.getElementById('reactor-conv').textContent = 'X = ' + (state.conversionRate * 100).toFixed(0) + '%';
    const reactorGlow = document.getElementById('reactor-glow');
    const glowOpacity = Math.min(0.5, (state.reactorTemp - 400) / 800);
    reactorGlow.setAttribute('opacity', Math.max(0, glowOpacity));
    
    // Batarya
    document.getElementById('battery-soc').textContent = Math.round(state.batterySOC) + '%';
    document.getElementById('battery-power').textContent = (state.batteryPower > 0 ? '+' : '') + Math.round(state.batteryPower) + ' kW';
    const batteryLevel = document.getElementById('battery-level');
    batteryLevel.setAttribute('y', 170 + (1 - state.batterySOC / 100) * 35);
    batteryLevel.setAttribute('height', (state.batterySOC / 100) * 35);
    
    // Motor
    document.getElementById('motor-power').textContent = Math.round(state.motorPower) + ' kW';
    const rotor = document.getElementById('motor-rotor');
    if (state.motorPower > 10) {
        rotor.classList.add('spinning');
    } else {
        rotor.classList.remove('spinning');
    }
    
    // Çıkış ok
    const outputIndicator = document.getElementById('output-indicator');
    outputIndicator.style.fill = state.motorPower > 10 ? '#d1ff00' : '#333300';
    
    // Valfler
    document.getElementById('valve-1').style.fill = state.running ? '#00ff88' : '#333300';
    document.getElementById('valve-2').style.fill = state.conversionRate > 0.1 ? '#00ff88' : '#333300';
}

function updateFlow(id, active) {
    const el = document.getElementById(id);
    if (active) {
        el.classList.add('active');
    } else {
        el.classList.remove('active');
    }
}

function updateDataPanel() {
    // Sıcaklık
    document.getElementById('data-temp').textContent = Math.round(state.reactorTemp);
    document.getElementById('bar-temp').style.width = (state.reactorTemp / 900 * 100) + '%';
    
    // Basınç
    document.getElementById('data-pressure').textContent = state.reactorPressure.toFixed(1);
    document.getElementById('bar-pressure').style.width = (state.reactorPressure / PHYSICS.MAX_PRESSURE * 100) + '%';
    
    // Dönüşüm
    document.getElementById('data-conv').textContent = (state.conversionRate * 100).toFixed(1);
    document.getElementById('bar-conv').style.width = (state.conversionRate * 100) + '%';
    
    // Motor gücü
    document.getElementById('data-power').textContent = Math.round(state.motorPower);
    document.getElementById('bar-power').style.width = Math.min(100, state.motorPower / 500 * 100) + '%';
    
    // SOFC
    document.getElementById('data-sofc').textContent = Math.round(state.sofcElectric);
    document.getElementById('bar-sofc').style.width = Math.min(100, state.sofcElectric / 300 * 100) + '%';
    
    // WtW Verimlilik
    const totalInput = state.sofcElectric + state.sofcThermal + 0.01;
    const wtw = (state.motorPower / totalInput) * 100;
    document.getElementById('data-wtw').textContent = Math.max(0, wtw).toFixed(1);
    document.getElementById('bar-wtw').style.width = Math.min(100, wtw) + '%';
}

// ─────────────────────────────────────────────────────────────────────────────────
// DCE TUTORIAL SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

let dceTutorialStep = 1;
const dceTotalSteps = 5;

document.addEventListener('DOMContentLoaded', () => {
    initDCETutorial();
});

function initDCETutorial() {
    const hasSeenTutorial = localStorage.getItem('dce-tutorial-seen');
    
    if (!hasSeenTutorial) {
        showDCETutorial();
    } else {
        const overlay = document.getElementById('dce-tutorial-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
    
    // Create dots
    const dotsContainer = document.getElementById('dce-tutorial-dots');
    if (dotsContainer) {
        for (let i = 1; i <= dceTotalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'tutorial-dot' + (i === 1 ? ' active' : '');
            dot.onclick = () => goToDCEStep(i);
            dotsContainer.appendChild(dot);
        }
    }
}

function showDCETutorial() {
    const overlay = document.getElementById('dce-tutorial-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        dceTutorialStep = 1;
        updateDCETutorialUI();
    }
}

function skipDCETutorial() {
    localStorage.setItem('dce-tutorial-seen', 'true');
    const overlay = document.getElementById('dce-tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function reopenDCETutorial() {
    showDCETutorial();
}

function nextDCEStep() {
    if (dceTutorialStep < dceTotalSteps) {
        dceTutorialStep++;
        updateDCETutorialUI();
    } else {
        skipDCETutorial();
    }
}

function prevDCEStep() {
    if (dceTutorialStep > 1) {
        dceTutorialStep--;
        updateDCETutorialUI();
    }
}

function goToDCEStep(step) {
    dceTutorialStep = step;
    updateDCETutorialUI();
}

function updateDCETutorialUI() {
    // Update steps
    document.querySelectorAll('#dce-tutorial-overlay .tutorial-step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === dceTutorialStep) {
            step.classList.add('active');
        }
    });
    
    // Update dots
    document.querySelectorAll('#dce-tutorial-dots .tutorial-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === dceTutorialStep);
    });
    
    // Update buttons
    const prevBtn = document.getElementById('dce-prev-btn');
    const nextBtn = document.getElementById('dce-next-btn');
    if (prevBtn) prevBtn.disabled = dceTutorialStep === 1;
    if (nextBtn) nextBtn.textContent = dceTutorialStep === dceTotalSteps ? '[BAŞLA →]' : '[İLERİ →]';
}

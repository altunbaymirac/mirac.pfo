// Saat Güncelleme
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Bölüm Değiştirme
function showSection(sectionId) {
    document.querySelectorAll('.content-block').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Telsiz Sistemi (Yorumlar)
function sendSignal() {
    const callsign = document.getElementById('callsign').value || "ANONYMOUS";
    const signal = document.getElementById('signal').value;
    const log = document.getElementById('comms-log');

    if (signal.trim() === "") return;

    const time = new Date().toLocaleTimeString();
    const entry = `<div style="margin-bottom:8px">
        <span style="color:var(--alert-orange)">[${time}]</span> 
        <span style="color:var(--neon-green)">${callsign}:</span> ${signal}
    </div>`;

    log.innerHTML += entry;
    log.scrollTop = log.scrollHeight; // Otomatik aşağı kaydır
    document.getElementById('signal').value = ""; // Temizle
}
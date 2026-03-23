# 🤖 TERMINAL CHATBOT

## ✨ ÖZELLİKLER:

### ÖZGÜN TASARIM - AI-GENERATED DEĞİL!
- ✅ Retro terminal aesthetic (cyan glow)
- ✅ Floating button (sağ alt köşe)
- ✅ Sliding chat window
- ✅ Mono font, pixel-perfect
- ✅ Pattern matching (basit, hızlı)
- ✅ API'ye bağlı değil (offline çalışır)

---

## 💬 NE YAPAR?

Mirac hakkında bilgi verir:
- ✅ Projeler (FLARE, DCE-SOFC, GeoSocial)
- ✅ Eğitim bilgileri (AGÜ, Mechanical Eng)
- ✅ İletişim (Email, GitHub, LinkedIn, Instagram)
- ✅ Beceriler (React, LoRa, Firebase, etc.)
- ✅ CV indirme yönlendirmesi
- ✅ Mini games bilgilendirmesi

---

## 🎮 NASIL KULLANILIR?

### Kullanıcı Tarafı:
1. Sağ alt köşedeki **mavi buton**a tıkla
2. Chat penceresi açılır
3. Soru sor veya **quick chips**lere tıkla
4. Bot anında cevap verir

### Örnek Sorular:
```
"projeler"          → Tüm projeler hakkında bilgi
"flare nedir?"      → FLARE detayları
"iletişim"          → Email, sosyal medya
"cv"                → CV indirme linki
"oyunlar"           → Mini games bilgisi
"help"              → Tüm komutlar
```

---

## 🧠 PATTERN MATCHING:

**Basit keyword detection:**

```javascript
// Greetings
/(merhaba|selam|hey|hi|hello)/i

// Projects
/(flare|lora|deprem)/i          → FLARE info
/(dce|sofc|amonyak)/i           → DCE-SOFC info
/(geosocial|gps|lokasyon)/i     → GeoSocial info

// Education
/(eğitim|okul|üniversite)/i

// Contact
/(iletişim|contact|email)/i

// Skills
/(beceri|skill|teknoloji)/i
```

**AVANTAJLAR:**
- ⚡ Anında cevap (API delay yok)
- 🔒 Privacy (data göndermiyor)
- 💰 Ücretsiz (API key gerekmiyor)
- 🌐 Offline çalışır

---

## 🎨 UI DETAYLARI:

### Floating Button:
- Sağ alt köşe
- Cyan glow effect
- Kırmızı notification dot (pulse animasyonu)
- Hover: Scale 1.1
- Click: Chat window açılır

### Chat Window:
- 400px genişlik, 600px yükseklik
- Terminal-style header (MIRAC.AI)
- Scrollable message area
- User messages: Purple (sağda)
- Bot messages: Cyan border (solda)
- Typing indicator: "Yazıyor..."
- Quick suggestion chips (ilk mesajda)

### Input:
- Mono font
- Cyan border on focus
- Send button (disabled if empty)
- Enter tuşu ile gönder
- Help text: "'help' yazarak komutları görebilirsin"

---

## 🔧 DEVELOPER NOTU:

### Keyword Ekleme:
`RESPONSES` objesine yeni pattern ekle:

```javascript
const RESPONSES = {
  newTopic: "Cevap buraya",
  // ...
}

// Pattern matcher'a ekle:
if (/(keyword|pattern)/i.test(msg)) {
  return RESPONSES.newTopic
}
```

### Yeni Soru/Cevap:
```javascript
// RESPONSES objesine ekle
hobby: "🎸 Hobiler: Müzik, coding, robotik..."

// Pattern'e ekle
if (/(hobi|hobby|ilgi)/i.test(msg)) {
  return RESPONSES.hobby
}
```

---

## ✅ AVANTAJLAR vs TAWK.TO:

| Özellik | Tawk.to | TerminalChatbot |
|---------|---------|-----------------|
| **Tasarım** | Generic | ÖZGÜN terminal |
| **Hız** | API delay | Anında |
| **Privacy** | Data gönderir | Tamamen local |
| **Offline** | Çalışmaz | Çalışır |
| **Özelleştirme** | Sınırlı | Tam kontrol |
| **Cost** | Ücretsiz (ama limit var) | Tamamen ücretsiz |

---

## 🎯 SONUÇ:

**API Playground'u SİLDİK** - Gereksizdi
**ChatWidget'ı DEĞİŞTİRDİK** - Terminal chatbot oldu

**YENİ:**
- ✅ Özgün terminal chatbot
- ✅ Pattern matching (hızlı, offline)
- ✅ Retro aesthetic
- ✅ Quick command chips
- ✅ Typing animation
- ✅ Responsive design

**KULLANIM:**
- Kullanıcılar projeleri öğrenebilir
- İletişim bilgilerini alabilir
- CV'yi nerede bulacağını sorar
- Oyunları keşfedebilir

---

**CHATBOT HAZIR! DEPLOY ET!** 🚀

# 🚀 SETUP TALİMATLARI

## ⚡ Hızlı Başlangıç

### 1️⃣ GitHub'a Yükle

```bash
cd portfolio-v2

# Git init
git init
git add .
git commit -m "Portfolio v2.0 - Chat + Real Analytics"

# GitHub repo'na push
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**ÖNEMLİ:** `src/` klasörünün yüklendiğinden emin ol!

Kontrol et:
```bash
git status  # src/ görünüyor mu?
git ls-files src/  # src/ içindeki dosyalar listeleniyor mu?
```

### 2️⃣ Vercel Deploy

1. https://vercel.com/login
2. "Import Project" → GitHub repo seç
3. Deploy!

---

## 💬 Chat Widget Kurulumu (Ücretsiz)

### Tawk.to ile Chat Ekleme

**1. Tawk.to Hesabı Aç:**
- https://tawk.to
- Sign up (ücretsiz)

**2. Widget Oluştur:**
- Dashboard → "Property" oluştur
- Widget ID'ni kopyala (örn: `6123abc456def789`)

**3. Kodu Güncelle:**

`src/components/ChatWidget.jsx` dosyasını aç:

```javascript
// ❌ Bu satırı bul:
s1.src = 'https://embed.tawk.to/YOUR_TAWK_ID/default';

// ✅ Bununla değiştir (kendi ID'ni koy):
s1.src = 'https://embed.tawk.to/6123abc456def789/default';
```

**4. GitHub'a Push:**
```bash
git add src/components/ChatWidget.jsx
git commit -m "Add Tawk.to chat widget"
git push
```

Vercel otomatik deploy yapacak, sağ altta chat bubble görünecek! 🎉

---

## 📊 Gerçek Analytics Kurulumu

### Opsyon 1: Vercel Analytics (Önerilen - Kolay)

**1. Vercel Dashboard:**
- Project → Settings → Analytics
- "Enable Analytics" tıkla
- ✅ Bitti!

**2. (Opsiyonel) Advanced Analytics:**

`package.json`'a ekle:
```json
"dependencies": {
  "@vercel/analytics": "^1.1.1"
}
```

`src/main.jsx`'e ekle:
```javascript
import { Analytics } from '@vercel/analytics/react'

// <App /> altına ekle:
<Analytics />
```

### Opsyon 2: Google Analytics (Daha Detaylı)

**1. Google Analytics Hesabı:**
- https://analytics.google.com
- Property oluştur
- Measurement ID al (örn: `G-XXXXXXXXXX`)

**2. index.html'i Güncelle:**

`index.html` dosyasını aç, `<!-- Google Analytics -->` yorumunu kaldır:

```html
<!-- ÖNCEDEN (yorum satırı): -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
...
-->

<!-- SONRA (aktif): -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF456"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF456');
</script>
```

**3. Push:**
```bash
git add index.html
git commit -m "Add Google Analytics"
git push
```

24 saat sonra Google Analytics'te veri göreceksin!

---

## 🐛 Build Hatası Çözümü

### Eğer "src/main.jsx not found" hatası alırsan:

**1. GitHub'da kontrol et:**
- Repo'ya git → `src/` klasörü var mı?
- Yoksa:

```bash
git add src/
git commit -m "Add src folder"
git push
```

**2. Vercel'de Redeploy:**
- Vercel Dashboard → Deployments
- En son deployment → "..." → "Redeploy"

---

## ✅ Çalışıyor mu Kontrol

### Test Checklist:

- [ ] Site açılıyor mu? (https://YOUR-SITE.vercel.app)
- [ ] Matrix rain görünüyor mu?
- [ ] Blog yazıları açılıyor mu?
- [ ] 3D beacon dönüyor mu?
- [ ] Chat bubble görünüyor mu? (sağ alt köşe)
- [ ] Analytics sayfa görüntüleme sayıyor mu?

---

## 🎯 Production Checklist

Deploy etmeden önce:

- [ ] `ChatWidget.jsx` → Tawk.to ID güncelle
- [ ] `index.html` → Google Analytics ID ekle
- [ ] `README.md` → Kendi bilgilerini yaz
- [ ] Social media linkleri doğru mu?
- [ ] CV PDF dosyası var mı?

---

## 💡 İpuçları

**Analytics:**
- İlk 24 saat veri görmeyebilirsin (Google Analytics için)
- Vercel Analytics anında çalışır
- localStorage tracking tarayıcı bazlı

**Chat:**
- Tawk.to mobil app'ten cevap verebilirsin
- Offline mesajları email'e gelir
- Ücretsiz sınırsız chat!

**Performance:**
- Matrix rain CPU kullanır, gerekirse kapat
- 3D beacon mobile'da yavaş olabilir
- Analytics chart'ları lazy load et

---

## 🆘 Sorun mu var?

1. **Build fail:** `src/` klasörü GitHub'da var mı kontrol et
2. **Chat görünmüyor:** Tawk.to ID'yi doğru kopyaladın mı?
3. **Analytics çalışmıyor:** Google Analytics ID format: `G-XXXXXXXXXX`

---

**Başarılar! 🚀**

Sorular için: mirac.altunbay@agu.edu.tr

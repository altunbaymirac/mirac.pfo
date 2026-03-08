export const blogPosts = [
  {
    slug: 'flare-6-subat',
    title: 'FLARE: 6 Şubat\'tan Doğan Fikir',
    date: '2025-01-10',
    readTime: '8 min',
    tags: ['FLARE', 'Engineering', 'Disaster Response'],
    excerpt: '6 Şubat depremini yaşadım. Enkaz altında ses dinlemenin ne kadar yetersiz olduğunu gördüm. İşte FLARE böyle doğdu.',
    content: `
# FLARE: 6 Şubat'tan Doğan Fikir

6 Şubat 2023. Hatay, Kahramanmaraş, ve onlarca şehir binlerce ton betonun altında kaldı. Ben de o sabah Kayseri'de depremi yaşadım.

## Sorun: Ses Dinlemek Yetmez

Arama-kurtarma ekiplerini izledim. Yaptıkları tek şey **ses dinlemekti**. Enkaz altında:
- İnsan şokta, baygın, ya da bilinçsiz olabilir
- Sesini çıkaramayacak kadar yaralı olabilir
- Düdük çalmak için bile nefesi olmayabilir
- Çığlık atsa da **beton bloklar sesi absorbe eder**

## Çözüm: Dijital Çığlık

FLARE'in pasif kurtarma özelliği tam da bu problemi çözüyor:

\`\`\`javascript
// Otomatik deprem algılama
if (accelerometer.detectEarthquake()) {
  beacon.wakeUp();
  beacon.transmit({
    status: 'SOS',
    location: GPS.getPosition(),
    signal: 'ENCRYPTED_LORA_PACKET'
  });
}
\`\`\`

İnsan **hiçbir şey yapmasa bile**, cihaz otomatik olarak:
1. Depremi algılar (MPU6050 ivmeölçer)
2. Kendini uyandırır (deep sleep'ten)
3. GPS konumunu yayar (LoRa mesh ağı ile)
4. SOS sinyali gönderir (1-3 km menzil)

## Teknik Detaylar

- **Teknoloji:** LoRa 868 MHz (beton delici)
- **Menzil:** Şehir içi 1-3 km, açık alan 10+ km
- **Pil Ömrü:** Pasif modda yıllarca
- **Maliyet:** ~$50 per beacon

## Sonraki Adımlar

1. ✅ Simülasyon tamamlandı
2. 🔄 Prototip geliştirme (ESP32 + LoRa)
3. ⏳ AGÜ kampüsünde menzil testi
4. ⏳ TTO başvurusu

Bu proje hayat kurtarabilir. Bir sonraki depremde hazır olalım.

---

**Mirac Altunbay**  
Mühendislik Öğrencisi, AGÜ
`
  },
  {
    slug: 'dce-sofc-neden-amonyak',
    title: 'DCE-SOFC: Neden Amonyak Yakıt?',
    date: '2025-01-05',
    readTime: '6 min',
    tags: ['DCE-SOFC', 'Marine', 'Green Energy'],
    excerpt: 'Amonyak (NH3) yakıtlı hibrit gemi tahrik sistemi neden gelecek? Termodinamik ve çevre açısından analiz.',
    content: `
# DCE-SOFC: Neden Amonyak Yakıt?

Gemi tahrik sistemlerinde devrim: Amonyak (NH₃) yakıtlı hibrit propulsion.

## Mevcut Problemler

**Deniz taşımacılığı** dünya CO₂ emisyonlarının %3'ünden sorumlu. Bunalık fuel oil (HFO):
- Yüksek SOx emisyonu
- Pahalı yakıt
- Karbon ayak izi yüksek

## Amonyak Neden İyi?

### 1. Karbon İçermiyor
NH₃ molekülünde karbon yok → **Sıfır CO₂ emisyonu**

### 2. Yüksek Enerji Yoğunluğu
\`\`\`
NH₃ HHV: 382.8 kJ/mol
Hidrojen HHV: 286 kJ/mol
\`\`\`

### 3. Kolay Depolama
- Sıvılaşma: -33°C veya 8.6 bar
- Hidrojen: -253°C veya 700 bar (çok zor!)

## DCE-SOFC Hibrit Sistem

Amonyak önce **cracker**'da parçalanır:

\`\`\`
2NH₃ → N₂ + 3H₂  (850°C, catalyst)
\`\`\`

Sonra:
1. **H₂ → SOFC** (yakıt pili, sessiz, verimli)
2. **Artık NH₃ → DCE** (dizel motor, yedek güç)

## Termodinamik Hesaplamalar

Arrhenius denklemi ile cracking oranı:

\`\`\`javascript
k = A * exp(-Ea / RT)
// k: reaction rate
// Ea: 170 kJ/mol (activation energy)
// R: 8.314 J/(mol·K)
// T: 850°C (1123 K)
\`\`\`

Sistem verimi: **%65-70** (diesel: %45-50)

## Zorluklar

- NOx emisyonu (N₂ oksidasyon riski)
- SOFC maliyeti yüksek
- Amonyak toksik (güvenlik protokolleri gerekli)

Ama bu zorluklar çözülebilir. Gelecek yeşil denizcilik bu yönde.

---

**Mirac Altunbay**  
Marine Propulsion Research
`
  },
  {
    slug: 'react-native-vs-flutter',
    title: 'React Native vs Flutter: GeoSocial Tecrübem',
    date: '2024-12-28',
    readTime: '5 min',
    tags: ['React Native', 'Flutter', 'Mobile Dev'],
    excerpt: 'GeoSocial uygulamasını hem React Native hem Flutter ile yazdım. İşte karşılaştırma.',
    content: `
# React Native vs Flutter: GeoSocial Tecrübem

GeoSocial location-based sosyal ağ uygulamasını **iki kere** yazdım:
1. İlk deneme: React + Expo
2. İkinci deneme: React Native (pure)
3. Deneysel: Flutter (10 günlük sprint)

## React Native ✅

**Artıları:**
- JavaScript biliyorsan hemen başlarsın
- Hot reload süper hızlı
- Expo ile deploy kolay
- Firebase entegrasyonu native kadar iyi

**Eksileri:**
- Android-specific bug'lar çok (GPS tracking'de çıldırdım)
- Performance kritik işlerde yetersiz
- Native modül yazmak gerekebilir

\`\`\`javascript
// React Native GPS tracking
useEffect(() => {
  const subscription = Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High },
    (location) => updateUserPosition(location)
  );
  return () => subscription.remove();
}, []);
\`\`\`

## Flutter 🚀

**Artıları:**
- **Performance inanılmaz** (60 FPS garanti)
- Material Design out-of-the-box
- Hot reload + Dart strong typing
- Android/iOS arası consistency

**Eksileri:**
- Dart öğrenme eğrisi (ama kolay)
- Package ecosystem React Native'den küçük
- Firebase setup biraz zahmetli

\`\`\`dart
// Flutter GPS tracking
StreamSubscription<Position>? positionStream;

positionStream = Geolocator.getPositionStream(
  locationSettings: LocationSettings(accuracy: LocationAccuracy.high)
).listen((Position position) {
  updateUserPosition(position);
});
\`\`\`

## Sonuç

**Startup MVP için:** React Native (hızlı prototip)  
**Production app:** Flutter (performans + stability)  
**Web desteği önemliyse:** React Native (kod paylaşımı)

GeoSocial'i sonunda **React Native** ile ship ettim çünkü Firebase entegrasyonu zaten hazırdı. Ama bir dahaki projem kesin Flutter.

---

**Mirac Altunbay**  
Full-Stack Mobile Developer
`
  }
]

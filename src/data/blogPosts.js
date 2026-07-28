export const blogPosts = [
  {
    slug: 'geosocial-interaktif-demo',
    title: 'GeoSocial: Uygulamayı Tarayıcıda Canlandırmak',
    date: '2026-07-28',
    readTime: '5 min',
    tags: ['GeoSocial', 'React', 'Framer Motion', 'Demo'],
    excerpt: 'GeoSocial mobil uygulamasını kimseye APK göndermeden anlatabilmek için portfolyoya çalışan bir telefon mockup demosu ekledim.',
    projectLinks: [
      { label: 'Canlı Demo', href: '/demos/geosocial' }
    ],
    content: `
# GeoSocial: Uygulamayı Tarayıcıda Canlandırmak

GeoSocial, React Native + Firebase ile yazdığım konum tabanlı bir sosyal ağ uygulaması. Sorun şuydu: mobil bir projeyi portfolyoda anlatmak zor. Ekran görüntüsü ölü duruyor, APK göndermek kimsenin yapmak istemediği bir iş.

Çözüm: uygulamanın kendisini tarayıcıda çalışır hale getirmek.

## Ne Yaptık?

Portfolyoya \`/demos/geosocial\` altında interaktif bir demo ekledim. Ziyaretçi hiçbir şey kurmadan uygulamayı deneyebiliyor.

- **Telefon mockup'ı** — notch, status bar, alt navigasyon çubuğu dahil gerçek bir Android çerçevesi
- **GPS tracking toggle** — açtığında konum koordinatları canlı olarak oynamaya başlıyor
- **Check-in sistemi** — butona bastığında sayaç artıyor ve akışın en üstüne senin girişin düşüyor
- **Yakındaki kullanıcılar** — haritada nabız gibi yanıp sönen mavi noktalar
- **Üç sekme** — Map, Feed, Profile; aralarında geçiş animasyonlu
- **Yan panel** — tech stack ve özellik listesi, demoyu izlerken okunacak bağlam

## Teknik Tarafta İlginç Olan Kısımlar

**Sahte GPS.** Gerçek konum izni istemek yerine \`setInterval\` ile koordinatlara küçük rastgele sapmalar ekledim. Tracking kapalıyken interval hiç kurulmuyor, açıldığında 3 saniyede bir güncelleniyor:

\`\`\`javascript
useEffect(() => {
  if (!isTracking) return

  const interval = setInterval(() => {
    setCurrentLocation(prev => ({
      ...prev,
      lat: prev.lat + (Math.random() - 0.5) * 0.0001,
      lng: prev.lng + (Math.random() - 0.5) * 0.0001
    }))
    setNearbyUsers(Math.floor(Math.random() * 15) + 3)
  }, 3000)

  return () => clearInterval(interval)
}, [isTracking])
\`\`\`

Sapma değeri önemliydi: çok büyük olunca pin zıplıyor, çok küçük olunca hiçbir şey olmuyormuş gibi duruyor. \`0.0001\` derecelik oynama "cihaz gerçekten konumu dinliyor" hissini veriyor.

**Sekme geçişleri.** Framer Motion'ın \`AnimatePresence\` bileşeni ile sekmeler soldan kayarak giriyor, sağdan çıkıyor. \`mode="wait"\` sayesinde iki sekme aynı anda ekranda olmuyor.

**Akış her zaman dolu.** Check-in yaptığında yeni kayıt başa ekleniyor ve liste \`slice(0, 4)\` ile kırpılıyor. Böylece demo ne kadar kurcalanırsa kurcalansın telefon ekranı taşmıyor.

## Ne Öğrendim?

Demo yazarken en çok vakit alan şey mantık değil, **inandırıcılık** oldu. Sayılar durağan kalınca ekran ölü görünüyor; her şey aynı anda oynayınca gürültü oluyor. Aradaki dengeyi bulmak — hangi değer ne sıklıkla değişecek — asıl işin kendisiydi.

Bir de şunu gördüm: bir projeyi anlatmanın en iyi yolu onu anlatmamak. Ziyaretçi "Check In" butonuna bir kez basınca uygulamanın ne yaptığını zaten anlıyor.

## Sırada Ne Var?

- Gerçek harita katmanı (şu an CSS grid ile çizilmiş bir mock)
- Feed öğelerine yorum akışı
- Demoyu React Native tarafındaki gerçek Firebase şemasıyla hizalamak

React Native ve Flutter tarafındaki karşılaştırmam için [React Native vs Flutter yazıma](/blog/react-native-vs-flutter) bakabilirsin.

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'concreteweb-triage-demo',
    title: 'ConcreteWeb: Haritadan Triyaj Ekranına',
    date: '2026-07-28',
    readTime: '6 min',
    tags: ['ConcreteWeb', 'Disaster Response', 'LoRa', 'Demo'],
    excerpt: 'FLARE adını ConcreteWeb yaptık ve demoyu "sinyal var mı" ekranından kurtarma ekibinin kime önce gideceğini söyleyen bir triyaj ekranına çevirdik.',
    projectLinks: [
      { label: 'Canlı Demo', href: '/demos/concreteweb' }
    ],
    content: `
# ConcreteWeb: Haritadan Triyaj Ekranına

ConcreteWeb'in çıkış hikâyesini [6 Şubat yazısında](/blog/concreteweb-6-subat) anlatmıştım. Bu yazı fikrin değil, **demonun** hikâyesi: son turda projeyi baştan aşağı elden geçirdik.

## Önce İsim: FLARE → ConcreteWeb

Proje eskiden FLARE'di. Sorun şuydu: "flare" kelimesi işaret fişeği çağrıştırıyor — yani birinin bilinçli olarak ateşlediği bir şey. Halbuki bu sistemin bütün fikri, **enkaz altındaki kişi hiçbir şey yapamasa bile** cihazın konuşması. İsim mesajın tam tersini söylüyordu.

ConcreteWeb ise ne yaptığını anlatıyor: betonun içine gömülü bir ağ. Kod tabanının tamamında, chatbot cevaplarında, CV'de ve demo sayfasında isim değiştirildi; eski \`/demos/flare\` adresi yeni adrese yönlendiriliyor ki paylaşılmış linkler kırılmasın.

## Asıl Değişiklik: Triyaj

Eski demo ikili düşünüyordu — sinyal var ya da yok. Ama kurtarma ekibinin ihtiyacı bu değil. Onların sorusu şu: **hangi binaya, hangi kata önce gideyim?**

Yeni demoda her beacon raporu beş durumdan birinde:

- **Confirmed alive** (öncelik 1, kırmızı) — cihaz canlılık teyidi aldı
- **Vibration detected** (öncelik 2, turuncu) — titreşim var ama teyit yok
- **Broadcast only** (öncelik 3, gri) — cihaz yayında, canlılık verisi yok
- **Safe** (temizlendi, yeşil) — kişi güvende olarak işaretlenmiş
- **Silent node** (incelenmeli) — HUB'dan hiç paket gelmiyor

Rapor listesi bu önceliğe göre sıralanıyor, harita pinleri duruma göre renkleniyor (kırmızı → turuncu → gri → yeşil), ve üstteki sayaç kartları her durumdan kaç tane olduğunu canlı gösteriyor.

En kritik nokta **silent node**. Sessizlik "kimse yok" demek değil — HUB'ın ezilmiş, pilinin bitmiş ya da menzil dışında kalmış olması demek olabilir. Bu yüzden sessiz düğümler listeden düşmüyor, ayrı bir "incelenmeli" kutusunda duruyor.

## Tier 3: Raporun İstasyona Varışı

Sistem üç katmanlı çalışıyor ve demo artık üçünü de gösteriyor:

1. **Beacon** (oda içi) — deprem algılar, uyanır, kayıtlı bina/kat/oda bilgisiyle rapor üretir
2. **HUB** (bina başına bir tane) — raporu alır, komşu HUB'lara 868 MHz store-and-forward mesh üzerinden aktarır
3. **Station** — raporların toplandığı komuta noktası

Her raporun bir **relay path**'i var ve seçtiğinde detay panelinde görünüyor:

\`\`\`
HUB-04 -> HUB-07 -> STATION-01
\`\`\`

İstasyonun işi sadece toplamak değil, **tekilleştirmek**. Aynı beacon aynı raporu defalarca yayınlıyor (mesh'te paket kaybı normal); istasyon bunları Beacon ID'ye göre birleştirip tek satır gösteriyor. Yoksa ekran aynı kişinin yüzlerce kopyasıyla dolardı.

## GPS Yok, Kurulum Kaydı Var

Demoda sık gelen soruyu baştan kesmek için haritayı da değiştirdik: **beacon'lar haritada nokta üretmiyor.** Haritada sadece binalar ve HUB'ları var.

Sebep basit — enkaz altında GPS zaten çalışmaz, ve her beacon'a GPS koymak hem maliyeti hem pil tüketimini uçurur. Bunun yerine konum **kurulum anında** kaydediliyor: bina, kat, oda. Rapor geldiğinde ekip "BLD-04, 3. kat, yatak odası" görüyor; bu enkazda bir koordinattan çok daha kullanışlı.

## Demoyu Kendi Kendini Anlatır Hale Getirmek

Son eklenen şey sağ üstteki **info butonu**. Basınca simülasyonun nasıl çalıştığını dört adımda açıklayan bir panel açılıyor: kayıtlı beacon'lar → bina başına bir HUB → HUB mesh aktarımı → istasyon triyajı.

Bunu eklememizin sebebi şuydu: demoyu yanında durup anlatmadığın zaman ekran sadece yanıp sönen renkli kutulara benziyordu. Artık link tek başına gönderilebiliyor.

## Ne Öğrendim?

Teknik olarak en zor kısım mesh simülasyonu değildi — **neyi göstermemek gerektiğine karar vermekti**. Her beacon'ı haritaya nokta olarak basmak teknik olarak kolay ve görsel olarak etkileyici olurdu, ama sistemin nasıl çalıştığı hakkında yalan söylerdi.

Bir de şunu gördüm: acil durum arayüzünde "veri göstermek" yetmiyor. Ekranın cevaplaması gereken tek bir soru var — **şimdi nereye koşayım?** Geri kalan her şey o sorunun önünde duran gürültü.

## Sırada Ne Var?

- ESP32 + LoRa ile fiziksel prototip
- AGÜ kampüsünde gerçek menzil testi
- Bina içi kat planı görünümü (harita pini yerine kat şeması)

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'fedagrup-insaat-web-sitesi',
    title: 'FedaGrup: Kurumsal İnşaat Web Sitesi',
    date: '2026-05-20',
    readTime: '4 min',
    tags: ['FedaGrup', 'Web Design', 'Client Project'],
    excerpt: 'FedaGrup İnşaat için hazırlanan kurumsal web sitesi: güven veren ilk izlenim, mobil uyum ve net hizmet sunumu.',
    projectLinks: [
      { label: 'Canlı Site', href: 'https://www.fedagrupinsaat.com', external: true }
    ],
    content: `
# FedaGrup: Kurumsal İnşaat Web Sitesi

FedaGrup İnşaat projesinde amaç basitti: şirketin dijitalde güven veren, hızlı açılan ve hizmetlerini net anlatan bir web yüzüne sahip olması.

## Odak Noktaları

- Kurumsal ilk izlenim
- Mobil uyumlu sayfa yapısı
- Hizmetleri kolay taranır hale getirme
- Ziyaretçiyi hızlıca iletişime yönlendirme

## Ne Öğrendim?

Bu proje bana teknik taraftan çok ürün tarafını öğretti. Bir firma sitesinde fazla efekt değil, güven veren düzen, okunabilir metin ve doğru bilgi mimarisi daha önemli.

## Link

[FedaGrup İnşaat canlı sitesi](https://www.fedagrupinsaat.com)
`
  },
  {
    slug: 'takaslat-marketplace',
    title: 'Takaslat: Takas Odaklı Marketplace',
    date: '2026-05-20',
    readTime: '5 min',
    tags: ['Takaslat', 'Marketplace', 'React', 'Full-Stack'],
    excerpt: 'Takaslat, para kullanmadan eşya takası yapabileceğin, AI destekli öneri ve müzakere sistemi olan bir marketplace platformu.',
    projectLinks: [
      { label: 'Önizlemeyi Aç', href: '/demos/takasla' }
    ],
    content: `
# Takaslat: Takas Odaklı Marketplace

Takaslat, para kullanmadan eşya, kitap veya ekipman takası yapabileceğin bir marketplace. Özellikle öğrenciler için tasarlandı ama her yaşa hitap ediyor.

## Problem

İkinci el platformlarda herkes fiyat konuşuyor. Ama çoğu insanın ihtiyacı para değil — elindekini vermek, karşılığında başka bir şey almak.

## Ne Yaptık?

Takaslat'ın öne çıkan özellikleri:

- **İlan listeleme** — fotoğraf, açıklama, takas tercihi
- **AI Asistan** — ilan için otomatik açıklama önerisi, fiyat tahmini
- **Takas Teklifi Sistemi** — karşı tarafa doğrudan takas öner
- **Müzakere Simülatörü** — teklifleri kabul/ret/karşı teklif döngüsü
- **Harita Görünümü** — yakındaki ilanları göster
- **Güven Puanı** — kullanıcı değerlendirme ve rozet sistemi
- **Paket Teklifi** — birden fazla ürünü tek teklife ekle
- **Karşılaştırma** — iki ilanı yan yana değerlendir

## Teknik Stack

\`\`\`
Frontend: React + TypeScript + Vite
State:    Zustand
Styling:  Tailwind CSS
Backend:  Node.js + Express
Deploy:   Vercel
\`\`\`

## Ne Öğrendim?

Bu proje bana product thinking'i öğretti. Bir marketplace'te kullanıcı güveni, UX akışından daha önemli. Takas sisteminde "kim ne zaman teslim eder?" sorusunu çözmeden hiçbir şey çalışmıyor.

[Takaslat önizlemesini aç](/demos/takasla)
`
  },
  {
    slug: 'concreteweb-6-subat',
    title: 'ConcreteWeb: 6 Şubat\'tan Doğan Fikir',
    date: '2025-01-10',
    readTime: '8 min',
    tags: ['ConcreteWeb', 'Engineering', 'Disaster Response'],
    excerpt: '6 Şubat depremini Malatya\'da yaşadım. Enkaz altında ses dinlemenin ne kadar yetersiz olduğunu gördüm. İşte ConcreteWeb böyle doğdu.',
    projectLinks: [
      { label: 'Canlı Demo', href: '/demos/concreteweb' }
    ],
    content: `
# ConcreteWeb: 6 Şubat'tan Doğan Fikir

6 Şubat 2023. Hatay, Kahramanmaraş, Malatya ve onlarca şehir binlerce ton betonun altında kaldı. Ben de o sabah Malatya'da depremi yaşadım.

## Sorun: Ses Dinlemek Yetmez

Arama-kurtarma ekiplerini izledim. Yaptıkları tek şey **ses dinlemekti**. Enkaz altında:
- İnsan şokta, baygın, ya da bilinçsiz olabilir
- Sesini çıkaramayacak kadar yaralı olabilir
- Düdük çalmak için bile nefesi olmayabilir
- Çığlık atsa da **beton bloklar sesi absorbe eder**

## Çözüm: Dijital Çığlık

ConcreteWeb'in pasif kurtarma özelliği tam da bu problemi çözüyor:

\`\`\`javascript
// Otomatik deprem algılama
if (accelerometer.detectEarthquake()) {
  beacon.wakeUp();
  beacon.transmit({
    status: 'broadcast_only',
    beaconId: registry.beaconId,
    buildingId: registry.buildingId,
    installedLocation: registry.installedLocation,
    signal: 'LORA_REPORT_PACKET'
  });
}
\`\`\`

İnsan **hiçbir şey yapmasa bile**, cihaz otomatik olarak:
1. Depremi algılar (MPU6050 ivmeölçer)
2. Kendini uyandırır (deep sleep'ten)
3. Kurulumda kaydedilen bina, kat ve oda bilgisini rapora ekler
4. Beacon raporunu binadaki tek HUB'a iletir

## Teknik Detaylar

- **Teknoloji:** 868 MHz LoRa tabanlı HUB store-and-forward mesh
- **Konum modeli:** Beacon GPS kullanmaz; kurulum kaydı bina, kat ve oda konumunu tutar
- **Pil Ömrü:** Pasif modda yıllarca
- **Maliyet:** ~$50 per beacon

## Sonraki Adımlar

1. ✅ Simülasyon tamamlandı
2. 🔄 Prototip geliştirme (ESP32 + LoRa)
3. ⏳ AGÜ kampüsünde menzil testi
4. ⏳ TTO başvurusu

Bu proje bir fikir olarak başladı, ama gerçek hayatta işe yarayabileceğine inanıyorum. Bir sonraki depremde hazır olalım.

---

**Mirac Altunbay**  
1. Sınıf Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'dce-sofc-neden-amonyak',
    title: 'DCE-SOFC: Neden Amonyak Yakıt?',
    date: '2025-01-05',
    readTime: '6 min',
    tags: ['DCE-SOFC', 'Marine', 'Green Energy'],
    excerpt: 'Amonyak (NH3) yakıtlı hibrit gemi tahrik sistemi neden gelecek? Termodinamik ve çevre açısından analiz.',
    projectLinks: [
      { label: 'Canlı Simülasyon', href: '/demos/dce-sofc' }
    ],
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

Bu zorluklar çözülebilir. Yeşil denizcilik geleceği bu yönde gidiyor, en azından ben öyle düşünüyorum.

---

**Mirac Altunbay**  
1. Sınıf Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'react-native-vs-flutter',
    title: 'React Native vs Flutter: GeoSocial Tecrübem',
    date: '2024-12-28',
    readTime: '5 min',
    tags: ['React Native', 'Flutter', 'Mobile Dev'],
    excerpt: 'GeoSocial uygulamasını hem React Native hem Flutter ile yazdım. İşte karşılaştırma.',
    projectLinks: [
      { label: 'Canlı Demo', href: '/demos/geosocial' }
    ],
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

GeoSocial'i sonunda **React Native** ile yaptım çünkü Firebase entegrasyonu hazırdı ve öğrenmesi daha kolaydı. Ama bir sonraki büyük projem için Flutter'ı denemek istiyorum.

---

**Mirac Altunbay**  
1. Sınıf Makine Mühendisliği, AGÜ
`
  }
]

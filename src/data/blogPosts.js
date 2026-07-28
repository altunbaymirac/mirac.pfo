export const blogPosts = [
  {
    slug: 'geosocial-interaktif-demo',
    title: 'GeoSocial: Uygulamayı Tarayıcıda Canlandırmak',
    date: '2026-07-28',
    readTime: '5 min',
    tags: ['GeoSocial', 'React', 'Framer Motion', 'Demo'],
    excerpt: 'GeoSocial mobil uygulamasını kimseye APK göndermeden anlatabilmek için portfolyoya çalışan bir telefon mockup demosu ekledim.',
    projectLinks: [
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/geosocial' }
    ],
    en: {
      title: 'GeoSocial: Bringing the App to Life in a Browser',
      excerpt: 'To explain the GeoSocial mobile app without sending anyone an APK, I added a working phone mockup demo to the portfolio.',
      content: `
# GeoSocial: Bringing the App to Life in a Browser

GeoSocial is a location-based social network I built with React Native and Firebase. The problem: a mobile project is hard to present in a portfolio. A screenshot looks dead, and sending someone an APK is a favour nobody wants to do.

The fix: make the app itself run in a browser.

## What We Built

I added an interactive demo under \`/demos/geosocial\`. Visitors can try the app without installing anything.

- **Phone mockup** — a real Android frame, notch, status bar and bottom navigation included
- **GPS tracking toggle** — flip it on and the coordinates start drifting live
- **Check-in system** — the counter goes up and your entry lands at the top of the feed
- **Nearby users** — blue dots pulsing on the map
- **Three tabs** — Map, Feed, Profile, with animated transitions
- **Side panel** — tech stack and feature list, context to read while watching the demo

## The Interesting Technical Bits

**Fake GPS.** Instead of asking for real location permission, I nudge the coordinates with small random offsets on an interval. While tracking is off the interval is never created; once on, it updates every 3 seconds:

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

The offset value mattered more than I expected: too large and the pin jumps around, too small and nothing appears to happen. A drift of \`0.0001\` degrees gives the feeling that a device is genuinely listening to its position.

**Tab transitions.** Framer Motion's \`AnimatePresence\` slides tabs in from the left and out to the right. \`mode="wait"\` keeps two tabs from ever being on screen at once.

**The feed never overflows.** A check-in prepends a new entry and the list is trimmed with \`slice(0, 4)\`. No matter how much someone plays with the demo, the phone screen stays intact.

## What I Learned

The slow part of writing a demo wasn't the logic — it was **believability**. Static numbers make a screen look dead; everything moving at once turns into noise. Finding the balance — which value changes how often — was the actual work.

I also learned this: the best way to explain a project is not to explain it. One tap on "Check In" and the visitor already understands what the app does.

## What's Next

- A real map layer (right now it's a mock drawn with CSS grid lines)
- Comment threads on feed items
- Aligning the demo with the actual Firebase schema on the React Native side

For my comparison of the two mobile frameworks, see [my React Native vs Flutter post](/blog/react-native-vs-flutter).

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
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
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/concreteweb' },
      {
        label: 'James Dyson Award 2026',
        href: 'https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb',
        external: true
      }
    ],
    en: {
      title: 'ConcreteWeb: From a Map to a Triage Screen',
      excerpt: 'We renamed FLARE to ConcreteWeb and turned the demo from a "is there a signal?" screen into a triage screen that tells a rescue team who to reach first.',
      content: `
# ConcreteWeb: From a Map to a Triage Screen

I told the origin story of ConcreteWeb in the [February 6th post](/blog/concreteweb-6-subat). This post isn't about the idea — it's about the **demo**: in the last round we reworked the project from top to bottom.

## First, the Name: FLARE → ConcreteWeb

The project used to be called FLARE. The problem: a flare is something a person deliberately fires. But the whole point of this system is that the device speaks **even when the person under the rubble can do nothing at all**. The name said the opposite of the message.

ConcreteWeb describes what it actually is: a network embedded in concrete. The name was changed across the entire codebase, in the chatbot answers, on the CV and on the demo page; the old \`/demos/flare\` address redirects to the new one so shared links don't break.

## The Real Change: Triage

The old demo thought in binary — signal or no signal. That isn't what a rescue team needs. Their question is: **which building, which floor do I go to first?**

In the new demo every beacon report sits in one of five states:

- **Confirmed alive** (priority 1, red) — the device picked up a confirmed life sign
- **Vibration detected** (priority 2, orange) — vibration, but no confirmation
- **Broadcast only** (priority 3, grey) — the device is transmitting, no life-sign data
- **Safe** (cleared, green) — the person has been marked safe
- **Silent node** (needs review) — no packets arriving from the HUB at all

The report list is sorted by that priority, map pins are coloured by state (red → orange → grey → green), and the counter cards at the top show live totals for each state.

The most critical one is **silent node**. Silence does not mean "nobody is there" — it can mean the HUB was crushed, its battery died, or it fell out of range. So silent nodes never drop off the list; they sit in a separate "needs review" box.

## Tier 3: The Report Reaching the Station

The system works in three tiers, and the demo now shows all three:

1. **Beacon** (inside the room) — detects the quake, wakes up, produces a report with its registered building/floor/room
2. **HUB** (one per building) — receives the report and passes it to neighbouring HUBs over an 868 MHz store-and-forward mesh
3. **Station** — the command point where reports collect

Every report has a **relay path**, visible in the detail panel when you select it:

\`\`\`
HUB-04 -> HUB-07 -> STATION-01
\`\`\`

The station's job isn't only to collect but to **deduplicate**. The same beacon broadcasts the same report many times over (packet loss is normal in a mesh); the station merges them by Beacon ID into a single row. Otherwise the screen would fill with hundreds of copies of the same person.

## No GPS — an Installation Record Instead

To head off the question the demo always gets, we changed the map too: **beacons do not produce points on the map.** The map only shows buildings and their HUBs.

The reason is simple — GPS doesn't work under rubble anyway, and putting GPS in every beacon would blow up both cost and battery drain. Instead the location is recorded **at installation time**: building, floor, room. When a report arrives the team sees "BLD-04, 3rd floor, bedroom", which is far more useful in rubble than a coordinate.

## Making the Demo Explain Itself

The last addition is the **info button** in the top right. It opens a panel explaining how the simulation works in four steps: registered beacons → one HUB per building → HUB mesh relay → station triage.

We added it because without someone standing next to it narrating, the screen just looked like blinking coloured boxes. Now the link can be sent on its own.

## James Dyson Award 2026

There was a reason behind this round of work: we submitted ConcreteWeb to the **James Dyson Award 2026**. The triage screen, the three-tier relay view and the info panel are largely for that submission — the jury will judge the project from a single link, without me there to explain it.

Submission page: [jamesdysonaward.org/tr-TR/2026/project/concreteweb](https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb)

## What I Learned

The hardest part technically wasn't the mesh simulation — it was **deciding what not to show**. Dropping every beacon onto the map as a point would have been easy to build and visually impressive, but it would have lied about how the system works.

I also saw this: in an emergency interface, "showing data" isn't enough. The screen has exactly one question to answer — **where do I run right now?** Everything else is noise standing in front of that question.

## What's Next

- A physical prototype with ESP32 + LoRa
- A real range test on the AGÜ campus
- An in-building floor plan view (a floor schematic instead of a map pin)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
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

## James Dyson Award 2026

Bu turdaki işlerin bir sebebi de vardı: ConcreteWeb'i **James Dyson Award 2026**'ya başvurduk. Triyaj ekranı, üç katmanlı relay görünümü ve info paneli büyük ölçüde bu başvuru için — jüri projeyi ben yanında anlatmadan, tek bir linke tıklayarak değerlendirecek.

Başvuru sayfası: [jamesdysonaward.org/tr-TR/2026/project/concreteweb](https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb)

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
    slug: 'fedagrup-nedir',
    title: 'FedaGrup Nedir? Bir Firmanın Dijital Vitrini',
    date: '2026-06-30',
    readTime: '3 min',
    tags: ['FedaGrup', 'Web Design', 'Client Project'],
    excerpt: 'FedaGrup İnşaat için yapılan kurumsal site ne işe yarar? Kısaca: firmayı aramadan önce insanların baktığı yer.',
    projectLinks: [
      { label: 'Canlı Site', labelEn: 'Live Site', href: 'https://www.fedagrupinsaat.com', external: true }
    ],
    en: {
      title: 'What Is FedaGrup? A Company\'s Digital Storefront',
      excerpt: 'What does the corporate site built for FedaGrup İnşaat actually do? In short: it is where people look before they pick up the phone.',
      content: `
# What Is FedaGrup? A Company's Digital Storefront

**In one sentence:** FedaGrup is the live corporate website of a construction company — the page people land on before deciding whether to call.

## What Problem Does It Solve?

A construction company's work is physical: buildings, sites, machinery. But the first contact is almost never physical. Someone hears the name, searches for it, and forms an opinion in a few seconds.

Without a site, that opinion forms out of nothing. With a bad site, it forms badly.

## What Does It Do?

- Introduces the company and what it does
- Lists the services in scannable form
- Presents completed work as evidence
- Puts the contact route within reach on every page
- Works properly on a phone, because most visitors arrive on one

## What Makes It Different from My Other Projects?

Every other project on this site is my own idea. This one has a client, and the measure of success is not technical: it is whether the phone rings.

That changes the priorities. No animations, no interactive simulations — clear text, fast loading, an obvious contact button.

## Link

[fedagrupinsaat.com](https://www.fedagrupinsaat.com)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
    content: `
# FedaGrup Nedir? Bir Firmanın Dijital Vitrini

**Tek cümleyle:** FedaGrup, bir inşaat firmasının canlı kurumsal web sitesi — insanların firmayı arayıp aramamaya karar vermeden önce indiği sayfa.

## Hangi Problemi Çözüyor?

Bir inşaat firmasının işi fiziksel: binalar, şantiyeler, makineler. Ama ilk temas neredeyse hiç fiziksel değil. Biri firmanın adını duyuyor, aratıyor ve birkaç saniyede bir kanaat oluşturuyor.

Site yoksa o kanaat yoktan oluşuyor. Kötü bir site varsa, kötü oluşuyor.

## Ne Yapıyor?

- Firmayı ve ne iş yaptığını tanıtıyor
- Hizmetleri taranabilir şekilde listeliyor
- Tamamlanan işleri kanıt olarak sunuyor
- İletişim yolunu her sayfada elin altında tutuyor
- Telefonda düzgün çalışıyor, çünkü ziyaretçilerin çoğu telefondan geliyor

## Diğer Projelerimden Farkı Ne?

Bu sitedeki diğer bütün projeler benim kendi fikrim. Bunun bir müşterisi var ve başarı ölçütü teknik değil: telefonun çalıp çalmaması.

Bu, öncelikleri değiştiriyor. Animasyon yok, interaktif simülasyon yok — net metin, hızlı açılış, göze batan bir iletişim butonu.

## Link

[fedagrupinsaat.com](https://www.fedagrupinsaat.com)

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'takaslat-nedir',
    title: 'Takaslat Nedir? Parasız Alışverişin Altyapısı',
    date: '2026-06-23',
    readTime: '4 min',
    tags: ['Takaslat', 'Marketplace', 'Product'],
    excerpt: 'Takaslat ne işe yarar? Elindeki eşyayı satmadan, doğrudan başka bir eşyayla değiştirmeni sağlayan bir platform.',
    projectLinks: [
      { label: 'Önizlemeyi Aç', labelEn: 'Open Preview', href: '/demos/takasla' }
    ],
    en: {
      title: 'What Is Takaslat? Infrastructure for Shopping Without Money',
      excerpt: 'What is Takaslat for? A platform that lets you swap an item directly for another one instead of selling it.',
      content: `
# What Is Takaslat? Infrastructure for Shopping Without Money

**In one sentence:** Takaslat is a marketplace where you swap an item directly for another item, without money changing hands.

## What Problem Does It Solve?

A student has last year's textbooks and needs this year's. Someone has a guitar they never play and wants a bicycle. On a normal second-hand site both of them have to do this:

1. List the item
2. Wait for it to sell
3. Take the money
4. Search for the thing they actually wanted
5. Spend that money

Four of those five steps exist only because money sits in the middle. Takaslat removes the middle.

## What Does It Do?

- **Listings** — photo, description, and what you would accept in return
- **Direct swap offers** — propose your item against theirs
- **Negotiation loop** — accept, reject, or counter-offer
- **Bundle offers** — combine several items into one offer when values don't match
- **Comparison view** — put two listings side by side
- **Map view** — see nearby listings, because a swap usually means meeting in person
- **Trust score** — ratings and badges, so you know who you're meeting
- **AI assistant** — writes a description for your listing and estimates its value

## The Hard Part

The hard part of a barter platform isn't the listings — it's **value matching**. In a sale, price settles the question. In a swap, both sides have to agree that a guitar is worth a bicycle, and there is no number to appeal to.

That's why the bundle offer and comparison features exist. They give people a way to close the gap rather than abandon the trade.

## Tech Stack

React + TypeScript on the front, Zustand for state, Tailwind for styling, Node.js + Express on the back, deployed on Vercel.

[Open the preview](/demos/takasla)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
    content: `
# Takaslat Nedir? Parasız Alışverişin Altyapısı

**Tek cümleyle:** Takaslat, elindeki eşyayı para girmeden doğrudan başka bir eşyayla değiştirebildiğin bir marketplace.

## Hangi Problemi Çözüyor?

Bir öğrencinin elinde geçen senenin kitapları var, bu senenin kitaplarına ihtiyacı var. Birinin hiç çalmadığı bir gitarı var, bisiklet istiyor. Normal bir ikinci el sitesinde ikisinin de şunu yapması gerekiyor:

1. İlanı koy
2. Satılmasını bekle
3. Parayı al
4. Asıl istediğin şeyi ara
5. O parayı harca

Bu beş adımın dördü sırf araya para girdiği için var. Takaslat aradakini çıkarıyor.

## Ne Yapıyor?

- **İlan listeleme** — fotoğraf, açıklama ve karşılığında ne kabul edeceğin
- **Doğrudan takas teklifi** — kendi eşyanı onunkine karşı öner
- **Müzakere döngüsü** — kabul, ret veya karşı teklif
- **Paket teklifi** — değerler tutmayınca birden fazla ürünü tek teklife ekle
- **Karşılaştırma** — iki ilanı yan yana koy
- **Harita görünümü** — yakındaki ilanlar, çünkü takas genelde yüz yüze buluşmak demek
- **Güven puanı** — değerlendirme ve rozetler, kiminle buluştuğunu bilesin diye
- **AI asistan** — ilanın için açıklama yazıyor ve değer tahmini yapıyor

## Zor Kısım

Takas platformunun zor kısmı ilanlar değil, **değer eşleştirme**. Satışta fiyat meseleyi çözüyor. Takasta iki tarafın da bir gitarın bir bisiklet ettiğinde anlaşması gerekiyor ve başvurulacak bir sayı yok.

Paket teklifi ve karşılaştırma özellikleri tam da bunun için var. İnsanlara aradaki farkı kapatmanın bir yolunu veriyor, takası terk etmenin yerine.

## Teknik Stack

Önde React + TypeScript, state için Zustand, stil için Tailwind, arkada Node.js + Express, Vercel'de yayında.

[Önizlemeyi aç](/demos/takasla)

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'geosocial-nedir',
    title: 'GeoSocial Nedir? Konuma Bağlı Sosyal Ağ',
    date: '2026-06-16',
    readTime: '4 min',
    tags: ['GeoSocial', 'Mobile Dev', 'Product'],
    excerpt: 'GeoSocial ne işe yarar? Takip ettiğin insanları değil, şu anda yakınında olanları gösteren bir sosyal ağ.',
    projectLinks: [
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/geosocial' }
    ],
    en: {
      title: 'What Is GeoSocial? A Social Network Tied to Place',
      excerpt: 'What is GeoSocial for? A social network that shows you who is nearby right now, instead of whoever you follow.',
      content: `
# What Is GeoSocial? A Social Network Tied to Place

**In one sentence:** GeoSocial is a mobile app whose feed is built from where you are, not from who you follow.

## What Problem Does It Solve?

Ordinary social networks are organised around a follow list. Whatever you see was posted by someone you chose at some point, and it could have been posted from anywhere on earth.

That's useless for a question like "is anyone from my department in the library right now?" or "which café near campus is busy?" Those questions are about **place and the present moment**, and a follow list answers neither.

## What Does It Do?

- **Check-in** — mark that you are at a place; it goes to the top of the local feed
- **Nearby users** — see how many people are around you right now
- **Location-based feed** — posts sorted by distance, not by who posted them
- **Map view** — your own pin plus the activity around it
- **Profile stats** — check-in count, friends, points
- **Gamification** — points and repeat-visit history for places you go often

## The Hard Part

Two things, and neither is the feed.

**GPS accuracy.** Indoors, a phone's location can drift by tens of metres. "Who is nearby" gets shaky exactly where people actually gather — inside a library, a café, a lecture hall.

**Privacy.** Broadcasting your location is a serious thing. The design answer is that a check-in is deliberate: nothing is shared unless you press the button. Continuous tracking exists to compute distance, not to publish where you are.

## Tech Stack

React Native and Expo on the app side, Firebase for auth and real-time data, the device GPS API for location.

There's an interactive demo on this site — a phone mockup you can try without installing anything: [Live Demo](/demos/geosocial)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
    content: `
# GeoSocial Nedir? Konuma Bağlı Sosyal Ağ

**Tek cümleyle:** GeoSocial, akışı takip ettiğin kişilere göre değil, bulunduğun yere göre kurulan bir mobil uygulama.

## Hangi Problemi Çözüyor?

Normal sosyal ağlar takip listesi etrafında dönüyor. Gördüğün her şeyi bir zamanlar seçtiğin biri paylaşmış ve dünyanın herhangi bir yerinden paylaşmış olabilir.

Bu, "şu an kütüphanede bölümden kimse var mı?" ya da "kampüse yakın hangi kafe kalabalık?" gibi sorular için işe yaramıyor. Bu sorular **yer ve şu an** ile ilgili; takip listesi ikisini de cevaplamıyor.

## Ne Yapıyor?

- **Check-in** — bir yerde olduğunu işaretliyorsun, yerel akışın en üstüne düşüyor
- **Yakındaki kullanıcılar** — şu anda çevrende kaç kişi var
- **Konum tabanlı akış** — gönderiler kime ait olduğuna göre değil, mesafeye göre sıralı
- **Harita görünümü** — kendi pinin ve etrafındaki hareket
- **Profil istatistikleri** — check-in sayısı, arkadaşlar, puan
- **Oyunlaştırma** — sık gittiğin yerler için puan ve tekrar ziyaret geçmişi

## Zor Kısım

İki şey, ve ikisi de akış değil.

**GPS hassasiyeti.** Kapalı alanda telefonun konumu onlarca metre kayabiliyor. "Kim yakında" sorusu tam da insanların toplandığı yerlerde sallantıya giriyor — kütüphanenin, kafenin, dersliğin içinde.

**Gizlilik.** Konumunu yayınlamak ciddi bir şey. Tasarımdaki cevap şu: check-in bilinçli bir eylem, butona basmadan hiçbir şey paylaşılmıyor. Sürekli takip, nerede olduğunu yayınlamak için değil, mesafe hesaplamak için var.

## Teknik Stack

Uygulama tarafında React Native ve Expo, kimlik doğrulama ve gerçek zamanlı veri için Firebase, konum için cihazın GPS API'si.

Bu sitede interaktif bir demosu var — hiçbir şey kurmadan deneyebileceğin bir telefon mockup'ı: [Canlı Demo](/demos/geosocial)

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'dce-sofc-nedir',
    title: 'DCE-SOFC Nedir? Geminin Dijital İkizi',
    date: '2026-06-09',
    readTime: '5 min',
    tags: ['DCE-SOFC', 'Marine', 'Simulation'],
    excerpt: 'DCE-SOFC ne işe yarar? Amonyak yakıtlı hibrit bir gemi tahrik sistemini, gemiyi inşa etmeden çalıştırıp izleyebildiğin bir simülasyon.',
    projectLinks: [
      { label: 'Canlı Simülasyon', labelEn: 'Live Simulation', href: '/demos/dce-sofc' }
    ],
    en: {
      title: 'What Is DCE-SOFC? A Ship\'s Digital Twin',
      excerpt: 'What is DCE-SOFC for? A simulation that lets you run and watch an ammonia-fuelled hybrid marine propulsion system without building the ship.',
      content: `
# What Is DCE-SOFC? A Ship's Digital Twin

**In one sentence:** DCE-SOFC is a live simulation of an ammonia-fuelled hybrid marine propulsion system — a digital twin that lets you watch the system run without building it.

## What Problem Does It Solve?

Shipping runs on heavy fuel oil and accounts for roughly 3% of global CO₂ emissions. Ammonia is a serious candidate to replace it, because the NH₃ molecule contains no carbon at all: burn it correctly and no CO₂ comes out.

But you cannot test a propulsion idea by building a ship. Building one costs millions and takes years. So the idea gets tested somewhere else first — in a model.

## What Does It Do?

The simulation models the whole chain and shows it running:

1. **Ammonia tank** — stored as a liquid at -33°C or 8.6 bar
2. **Cracker** — splits NH₃ into nitrogen and hydrogen at 850°C over a catalyst
3. **SOFC** — the solid oxide fuel cell turns the hydrogen into electricity, quietly and efficiently
4. **DCE** — the diesel engine burns leftover ammonia as backup power
5. **Output** — the combined electrical and mechanical power driving the ship

You can change the load, watch the temperatures and efficiency respond, and see where the energy actually goes.

## Why "Hybrid"?

Because a fuel cell alone doesn't handle a ship. An SOFC is efficient but slow to respond and expensive; a diesel engine responds instantly and is cheap but dirty.

Pairing them means the fuel cell carries the steady cruising load while the engine covers the peaks. Roughly 65-70% overall efficiency, against 45-50% for diesel alone.

## The Honest Part

This is a model, not a prototype, and it has open problems: NOx emissions from nitrogen oxidation, the cost of SOFC stacks, and ammonia's toxicity, which demands real safety protocols.

I don't think those are unsolvable. But a simulation that hides them would be a worse simulation.

[Open the live simulation](/demos/dce-sofc)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
    content: `
# DCE-SOFC Nedir? Geminin Dijital İkizi

**Tek cümleyle:** DCE-SOFC, amonyak yakıtlı hibrit bir gemi tahrik sisteminin canlı simülasyonu — sistemi inşa etmeden çalışırken izleyebildiğin bir dijital ikiz.

## Hangi Problemi Çözüyor?

Deniz taşımacılığı ağır fuel oil ile çalışıyor ve dünya CO₂ emisyonlarının kabaca %3'ünden sorumlu. Amonyak bunun yerine geçmek için ciddi bir aday, çünkü NH₃ molekülünde hiç karbon yok: doğru yakarsan CO₂ çıkmıyor.

Ama bir tahrik fikrini gemi inşa ederek test edemezsin. Bir gemi milyonlarca dolar ve yıllar demek. O yüzden fikir önce başka bir yerde deneniyor — modelde.

## Ne Yapıyor?

Simülasyon zincirin tamamını modelliyor ve çalışırken gösteriyor:

1. **Amonyak tankı** — -33°C'de veya 8.6 bar'da sıvı olarak depolanıyor
2. **Cracker** — NH₃'ü 850°C'de katalizör üzerinde azot ve hidrojene ayırıyor
3. **SOFC** — katı oksit yakıt pili hidrojeni sessiz ve verimli şekilde elektriğe çeviriyor
4. **DCE** — dizel motor artan amonyağı yedek güç olarak yakıyor
5. **Çıkış** — gemiyi süren birleşik elektrik ve mekanik güç

Yükü değiştirebiliyor, sıcaklıkların ve verimin nasıl tepki verdiğini izleyebiliyor, enerjinin gerçekte nereye gittiğini görebiliyorsun.

## Neden "Hibrit"?

Çünkü tek başına yakıt pili bir gemiyi kaldırmıyor. SOFC verimli ama tepkisi yavaş ve pahalı; dizel motor anında tepki veriyor ve ucuz ama kirli.

İkisini birleştirince yakıt pili sabit seyir yükünü taşıyor, motor tepe yükleri karşılıyor. Toplamda kabaca %65-70 verim, tek başına dizelin %45-50'sine karşı.

## Dürüst Kısım

Bu bir model, prototip değil ve açık problemleri var: azot oksidasyonundan gelen NOx emisyonu, SOFC yığınlarının maliyeti ve amonyağın toksik olması — ki bu gerçek güvenlik protokolleri gerektiriyor.

Bunların çözülemez olduğunu düşünmüyorum. Ama bunları saklayan bir simülasyon, daha kötü bir simülasyon olurdu.

[Canlı simülasyonu aç](/demos/dce-sofc)

---

**Mirac Altunbay**
Makine Mühendisliği, AGÜ
`
  },
  {
    slug: 'concreteweb-nedir',
    title: 'ConcreteWeb Nedir? Enkaz Altından Konuşan Cihaz',
    date: '2026-06-02',
    readTime: '5 min',
    tags: ['ConcreteWeb', 'Disaster Response', 'LoRa'],
    excerpt: 'ConcreteWeb ne işe yarar? Deprem sonrası, enkaz altındaki kişi hiçbir şey yapamasa bile kurtarma ekibine yerini bildiren bir cihaz ağı.',
    projectLinks: [
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/concreteweb' },
      {
        label: 'James Dyson Award 2026',
        href: 'https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb',
        external: true
      }
    ],
    en: {
      title: 'What Is ConcreteWeb? A Device That Speaks from Under Rubble',
      excerpt: 'What is ConcreteWeb for? A network of devices that reports a person\'s location to rescue teams after an earthquake, even if that person can do nothing at all.',
      content: `
# What Is ConcreteWeb? A Device That Speaks from Under Rubble

**In one sentence:** ConcreteWeb is a network of small devices installed in homes that, after an earthquake, tells rescue teams which building, floor and room to search — without the trapped person having to do anything.

## What Problem Does It Solve?

After a collapse, the main search method is listening. Teams call out, wait, and listen for a response.

That method assumes the person under the rubble can answer. Often they cannot: they may be unconscious, too injured to make a sound, or without enough breath to blow a whistle. And even a scream gets absorbed by concrete.

So the search depends on the one thing the victim may be least able to provide.

## What Does It Do?

The system has three tiers:

**1. Beacon** — a small device installed in a room. It sleeps for years drawing almost no power. When its accelerometer detects an earthquake it wakes itself up and starts transmitting a report. The report carries the building, floor and room recorded when it was installed.

**2. HUB** — one per building. It receives the beacon reports and forwards them to neighbouring HUBs over an 868 MHz LoRa store-and-forward mesh. If one path is broken, the packet travels another.

**3. Station** — the command point. Reports collect here, duplicates are merged by Beacon ID, and what the team sees is a prioritised list: which address, which floor, and how strong the life sign is.

## Two Design Decisions Worth Explaining

**No GPS in the beacon.** GPS doesn't work under rubble, and adding it to every unit would wreck both the cost and the battery life. Location comes from the installation record instead — "BLD-04, 3rd floor, bedroom" is more actionable in a collapsed building than a coordinate anyway.

**Silence is not an answer.** A beacon that reports nothing doesn't mean nobody is there. It can mean the HUB was crushed or the battery died. So silent nodes stay on the list, marked for review, rather than quietly disappearing.

## Why I Started It

I lived through the February 6th, 2023 earthquake in Malatya, and watched the search process from close up. The longer story is in [that post](/blog/concreteweb-6-subat).

## Where It Stands

The simulation is finished and you can try it on this site. The physical prototype (ESP32 + LoRa) and a range test on the AGÜ campus are the next steps. The project was submitted to the James Dyson Award 2026.

Estimated cost: around $50 per beacon.

[Open the live demo](/demos/concreteweb)

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
    content: `
# ConcreteWeb Nedir? Enkaz Altından Konuşan Cihaz

**Tek cümleyle:** ConcreteWeb, evlere kurulan küçük cihazlardan oluşan bir ağ; deprem sonrası kurtarma ekibine hangi binayı, hangi katı ve hangi odayı arayacağını söylüyor — enkaz altındaki kişinin hiçbir şey yapmasına gerek kalmadan.

## Hangi Problemi Çözüyor?

Bir çökme sonrası temel arama yöntemi dinlemek. Ekipler sesleniyor, bekliyor ve cevap için kulak veriyor.

Bu yöntem, enkaz altındaki kişinin cevap verebileceğini varsayıyor. Çoğu zaman veremiyor: baygın olabilir, ses çıkaramayacak kadar yaralı olabilir ya da düdük çalacak nefesi olmayabilir. Çığlık atsa bile beton sesi yutuyor.

Yani arama, kazazedenin sağlamakta en zorlanacağı şeye bağlı kalıyor.

## Ne Yapıyor?

Sistem üç katmanlı:

**1. Beacon** — odaya kurulan küçük bir cihaz. Neredeyse hiç güç çekmeden yıllarca uyuyor. İvmeölçeri depremi algılayınca kendini uyandırıp rapor yayınlamaya başlıyor. Rapor, kurulum sırasında kaydedilen bina, kat ve oda bilgisini taşıyor.

**2. HUB** — bina başına bir tane. Beacon raporlarını alıp 868 MHz LoRa store-and-forward mesh üzerinden komşu HUB'lara aktarıyor. Bir yol kırılmışsa paket başka yoldan gidiyor.

**3. Station** — komuta noktası. Raporlar burada toplanıyor, kopyalar Beacon ID'ye göre birleştiriliyor ve ekibin gördüğü şey öncelik sıralı bir liste oluyor: hangi adres, hangi kat ve canlılık sinyali ne kadar güçlü.

## Açıklamaya Değer İki Tasarım Kararı

**Beacon'da GPS yok.** GPS enkaz altında çalışmıyor ve her birime eklemek hem maliyeti hem pil ömrünü mahvederdi. Konum bunun yerine kurulum kaydından geliyor — çöken bir binada "BLD-04, 3. kat, yatak odası" zaten bir koordinattan daha kullanışlı.

**Sessizlik bir cevap değil.** Rapor vermeyen bir beacon, orada kimse yok demek değil. HUB'ın ezilmiş ya da pilinin bitmiş olması demek olabilir. Bu yüzden sessiz düğümler sessizce kaybolmuyor, incelenmek üzere işaretli halde listede kalıyor.

## Neden Başladım?

6 Şubat 2023 depremini Malatya'da yaşadım ve arama sürecini yakından izledim. Uzun hikâye [şu yazıda](/blog/concreteweb-6-subat).

## Nerede?

Simülasyon tamamlandı, bu sitede deneyebilirsin. Fiziksel prototip (ESP32 + LoRa) ve AGÜ kampüsünde menzil testi sıradaki adımlar. Proje James Dyson Award 2026'ya başvuruldu.

Tahmini maliyet: beacon başına yaklaşık $50.

[Canlı demoyu aç](/demos/concreteweb)

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
      { label: 'Canlı Site', labelEn: 'Live Site', href: 'https://www.fedagrupinsaat.com', external: true }
    ],
    en: {
      title: 'FedaGrup: A Corporate Construction Website',
      excerpt: 'The corporate website built for FedaGrup İnşaat: a trustworthy first impression, mobile fit and a clear presentation of services.',
      content: `
# FedaGrup: A Corporate Construction Website

The goal on the FedaGrup İnşaat project was simple: give the company a digital face that inspires trust, loads fast and explains its services clearly.

## Focus Points

- A corporate first impression
- A mobile-friendly page structure
- Making the services easy to scan
- Guiding the visitor to contact quickly

## What I Learned

This project taught me far more about product than about technique. On a company site, effects matter less than a layout that inspires trust, readable text and the right information architecture.

## Link

[FedaGrup İnşaat live site](https://www.fedagrupinsaat.com)
`
    },
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
      { label: 'Önizlemeyi Aç', labelEn: 'Open Preview', href: '/demos/takasla' }
    ],
    en: {
      title: 'Takaslat: A Barter-First Marketplace',
      excerpt: 'Takaslat is a marketplace where you swap items without money, with AI-assisted suggestions and a negotiation system.',
      content: `
# Takaslat: A Barter-First Marketplace

Takaslat is a marketplace for swapping items, books or equipment without money. It was designed with students in mind, but it works for any age.

## The Problem

On second-hand platforms everyone talks about price. But what most people need isn't money — it's to hand over what they have and get something else in return.

## What We Built

Takaslat's main features:

- **Listings** — photo, description, swap preference
- **AI assistant** — automatic description suggestions and price estimates for a listing
- **Swap offer system** — propose a trade directly to the other side
- **Negotiation simulator** — the accept / reject / counter-offer loop
- **Map view** — show nearby listings
- **Trust score** — user ratings and a badge system
- **Bundle offers** — put several items into a single offer
- **Comparison** — evaluate two listings side by side

## Tech Stack

\`\`\`
Frontend: React + TypeScript + Vite
State:    Zustand
Styling:  Tailwind CSS
Backend:  Node.js + Express
Deploy:   Vercel
\`\`\`

## What I Learned

This project taught me product thinking. In a marketplace, user trust matters more than UX flow. In a barter system nothing works until you answer the question "who hands over their item, and when?"

[Open the Takaslat preview](/demos/takasla)
`
    },
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
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/concreteweb' },
      {
        label: 'James Dyson Award 2026',
        href: 'https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb',
        external: true
      }
    ],
    en: {
      title: 'ConcreteWeb: An Idea Born on February 6th',
      excerpt: 'I lived through the February 6th earthquake in Malatya. I saw how inadequate listening for sounds under rubble is. This is how ConcreteWeb was born.',
      content: `
# ConcreteWeb: An Idea Born on February 6th

February 6th, 2023. Hatay, Kahramanmaraş, Malatya and dozens of other cities were buried under thousands of tons of concrete. I lived through the earthquake that morning in Malatya.

## The Problem: Listening Isn't Enough

I watched the search and rescue teams. The only thing they could do was **listen for sounds**. Under rubble:
- A person may be in shock, unconscious or blacked out
- They may be too injured to make a sound
- They may not even have the breath to blow a whistle
- And even if they scream, **concrete blocks absorb the sound**

## The Solution: A Digital Scream

ConcreteWeb's passive rescue feature solves exactly this problem:

\`\`\`javascript
// Automatic earthquake detection
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

Even if the person does **nothing at all**, the device automatically:
1. Detects the earthquake (MPU6050 accelerometer)
2. Wakes itself up (out of deep sleep)
3. Adds the building, floor and room recorded at installation to the report
4. Passes the beacon report to the single HUB in the building

## Technical Details

- **Technology:** 868 MHz LoRa-based HUB store-and-forward mesh
- **Location model:** Beacons use no GPS; the installation record holds the building, floor and room
- **Battery life:** Years in passive mode
- **Cost:** ~$50 per beacon

## Next Steps

1. ✅ Simulation complete
2. 🔄 Prototype development (ESP32 + LoRa)
3. ⏳ Range test on the AGÜ campus
4. ⏳ Technology transfer office application

This project started as an idea, but I believe it could work in real life. Let's be ready for the next earthquake.

---

**Mirac Altunbay**
Mechanical Engineering, AGÜ
`
    },
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
      { label: 'Canlı Simülasyon', labelEn: 'Live Simulation', href: '/demos/dce-sofc' }
    ],
    en: {
      title: 'DCE-SOFC: Why Ammonia Fuel?',
      excerpt: 'Why is an ammonia (NH3) fuelled hybrid marine propulsion system the future? An analysis from a thermodynamic and environmental angle.',
      content: `
# DCE-SOFC: Why Ammonia Fuel?

A shift in marine propulsion: hybrid propulsion running on ammonia (NH₃).

## Current Problems

**Shipping** is responsible for about 3% of global CO₂ emissions. Heavy fuel oil (HFO) means:
- High SOx emissions
- Expensive fuel
- A large carbon footprint

## Why Is Ammonia Good?

### 1. It Contains No Carbon
There is no carbon in the NH₃ molecule → **zero CO₂ emissions**

### 2. High Energy Density
\`\`\`
NH₃ HHV: 382.8 kJ/mol
Hydrogen HHV: 286 kJ/mol
\`\`\`

### 3. Easy Storage
- Liquefies at: -33°C or 8.6 bar
- Hydrogen: -253°C or 700 bar (very hard!)

## The DCE-SOFC Hybrid System

The ammonia is first broken down in a **cracker**:

\`\`\`
2NH₃ → N₂ + 3H₂  (850°C, catalyst)
\`\`\`

Then:
1. **H₂ → SOFC** (fuel cell, quiet, efficient)
2. **Leftover NH₃ → DCE** (diesel engine, backup power)

## Thermodynamic Calculations

The cracking rate via the Arrhenius equation:

\`\`\`javascript
k = A * exp(-Ea / RT)
// k: reaction rate
// Ea: 170 kJ/mol (activation energy)
// R: 8.314 J/(mol·K)
// T: 850°C (1123 K)
\`\`\`

System efficiency: **65-70%** (diesel: 45-50%)

## Challenges

- NOx emissions (risk of N₂ oxidation)
- SOFC cost is high
- Ammonia is toxic (safety protocols required)

These challenges are solvable. The future of green shipping is heading this way — at least that's what I think.

---

**Mirac Altunbay**
1st-year Mechanical Engineering, AGÜ
`
    },
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
      { label: 'Canlı Demo', labelEn: 'Live Demo', href: '/demos/geosocial' }
    ],
    en: {
      title: 'React Native vs Flutter: My GeoSocial Experience',
      excerpt: 'I wrote the GeoSocial app in both React Native and Flutter. Here is the comparison.',
      content: `
# React Native vs Flutter: My GeoSocial Experience

I wrote the GeoSocial location-based social network **twice**:
1. First attempt: React + Expo
2. Second attempt: React Native (pure)
3. Experimental: Flutter (a 10-day sprint)

## React Native ✅

**Pros:**
- If you know JavaScript you start immediately
- Hot reload is very fast
- Deploying with Expo is easy
- Firebase integration is as good as native

**Cons:**
- Lots of Android-specific bugs (GPS tracking drove me crazy)
- Not enough for performance-critical work
- You may need to write native modules

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

**Pros:**
- **Performance is incredible** (60 FPS guaranteed)
- Material Design out of the box
- Hot reload + Dart's strong typing
- Consistency between Android and iOS

**Cons:**
- Dart's learning curve (though it's easy)
- Smaller package ecosystem than React Native
- Firebase setup takes more effort

\`\`\`dart
// Flutter GPS tracking
StreamSubscription<Position>? positionStream;

positionStream = Geolocator.getPositionStream(
  locationSettings: LocationSettings(accuracy: LocationAccuracy.high)
).listen((Position position) {
  updateUserPosition(position);
});
\`\`\`

## Conclusion

**For a startup MVP:** React Native (fast prototyping)
**For a production app:** Flutter (performance + stability)
**If web support matters:** React Native (shared code)

I ended up building GeoSocial in **React Native** because the Firebase integration was ready and it was easier to learn. But for my next big project I want to try Flutter.

---

**Mirac Altunbay**
1st-year Mechanical Engineering, AGÜ
`
    },
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

export function localizePost(post, lang) {
  const source = lang === 'en' && post.en ? post.en : post

  return {
    ...post,
    title: source.title,
    excerpt: source.excerpt,
    content: source.content,
    projectLinks: post.projectLinks?.map((link) => ({
      ...link,
      label: lang === 'en' ? link.labelEn || link.label : link.label
    }))
  }
}

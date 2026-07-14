import { motion } from 'framer-motion'
import { Download, Mail, Github, Linkedin, MapPin, GraduationCap, Briefcase, Code, Award } from 'lucide-react'

export default function CV() {
  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">

        {/* Action bar — hidden on print */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 print:hidden"
        >
          <h1 className="text-4xl font-bold text-terminal-text neon-glow">📄 Curriculum Vitae</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono hover:bg-transparent hover:text-terminal-text transition-all"
          >
            <Download size={18} />
            <span>YAZDIR / İNDİR</span>
          </motion.button>
        </motion.div>

        {/* CV Content */}
        <div className="bg-terminal-darker border-2 border-terminal-text p-8 print:border-0 print:p-0 print:bg-white print:text-black space-y-8">

          {/* Header */}
          <div className="border-b-2 border-terminal-text pb-6 print:border-black">
            <h2 className="text-4xl font-bold text-terminal-text neon-glow print:text-black print:no-underline mb-1">
              Mirac Altunbay
            </h2>
            <p className="text-terminal-secondary font-mono text-lg mb-4 print:text-gray-600">
              Mechanical Engineering Student & Software Developer
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-400 print:text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-terminal-accent print:text-gray-500" />
                mirac.altunbay@agu.edu.tr
              </span>
              <a
                href="https://github.com/altunbaymirac"
                className="flex items-center gap-1.5 hover:text-terminal-text transition-colors print:text-gray-600"
                target="_blank" rel="noopener noreferrer"
              >
                <Github size={14} className="text-terminal-text print:text-gray-500" />
                github.com/altunbaymirac
              </a>
              <a
                href="https://www.linkedin.com/in/miraç-altunbay-104537280/"
                className="flex items-center gap-1.5 hover:text-terminal-secondary transition-colors print:text-gray-600"
                target="_blank" rel="noopener noreferrer"
              >
                <Linkedin size={14} className="text-terminal-secondary print:text-gray-500" />
                linkedin.com/in/miraç-altunbay-104537280
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-terminal-accent print:text-gray-500" />
                Kayseri, Türkiye
              </span>
            </div>
          </div>

          {/* About */}
          <Section icon={<Code size={18} />} title="Hakkımda / About">
            <p className="text-gray-300 leading-relaxed print:text-gray-700">
              Abdullah Gül Üniversitesi Makine Mühendisliği 1. sınıf öğrencisiyim. Yazılım geliştirme ve mühendislik simülasyonlarına ilgi duyuyorum. 6 Şubat depreminden ilham alarak ConcreteWeb adlı enkaz altı LoRa beacon sistemini tasarladım; amonyak yakıtlı gemi tahrik sistemleri için termodinamik simülasyon geliştirdim. Öğrenirken yapmayı, yaparken öğrenmeyi tercih ediyorum.
            </p>
          </Section>

          {/* Education */}
          <Section icon={<GraduationCap size={18} />} title="Eğitim / Education">
            <CVItem
              title="Makine Mühendisliği"
              subtitle="Abdullah Gül Üniversitesi (AGÜ) — Kayseri"
              date="Eyl 2024 – Devam ediyor"
              details={['1. Sınıf öğrencisi', 'Odak: termodinamik simülasyon, IoT ve mühendislik tasarımı']}
            />
          </Section>

          {/* Projects */}
          <Section icon={<Briefcase size={18} />} title="Projeler / Projects">
            <CVItem
              title="ConcreteWeb — Enkaz Altı Acil İletişim Sistemi"
              date="Şub 2025 – Devam ediyor"
              details={[
                'LoRa 868 MHz mesh network ile enkaz altından otomatik SOS sinyali',
                'MPU6050 ivmeölçer ile deprem algılama, GPS konum yayını',
                'React + Leaflet ile canlı beacon tracker simülasyonu',
                'Menzil: şehir içi 1-3 km, açık alan 10+ km'
              ]}
            />
            <CVItem
              title="DCE-SOFC Dijital İkiz — Hibrit Gemi Tahrik Sistemi"
              date="Mar 2025 – Devam ediyor"
              details={[
                'Amonyak (NH₃) yakıtlı SOFC + Dual-Cycle Engine hibrit sistemi',
                'Arrhenius kinetikleri: k = A·exp(-Ea/RT), dönüşüm hesabı',
                'Recharts ile gerçek zamanlı enerji verimliliği ve emisyon grafikleri',
                'Terminal-stil P&ID mühendislik diyagramı (SVG animasyonlu)'
              ]}
            />
            <CVItem
              title="Takaslat — Takas Marketplace"
              date="May 2025"
              details={[
                'React + TypeScript + Vite + Zustand full-stack marketplace',
                'AI destekli ilan açıklaması ve fiyat tahmini',
                'Takas teklifi, müzakere simülatörü, güven puanı sistemi',
                'Harita görünümü, paket teklifi, ürün karşılaştırma'
              ]}
            />
            <CVItem
              title="FedaGrup İnşaat — Kurumsal Web Sitesi"
              date="Nis 2025"
              details={[
                'Müşteri projesi — production\'da canlı: fedagrupinsaat.com',
                'Mobil uyumlu, hızlı yüklenen kurumsal site',
                'Güven odaklı tasarım, net hizmet mimarisi'
              ]}
            />
            <CVItem
              title="GeoSocial — Konuma Dayalı Sosyal Ağ"
              date="2024"
              details={[
                'React Native + Firebase + GPS tracking',
                'Gamification, yakın kullanıcıları bulma, sosyal akış'
              ]}
            />
          </Section>

          {/* Skills */}
          <Section icon={<Code size={18} />} title="Teknik Beceriler / Technical Skills">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkillGroup label="Frontend" items={['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion']} />
              <SkillGroup label="Backend & DB" items={['Node.js', 'Express', 'Firebase', 'Zustand']} />
              <SkillGroup label="Mobile" items={['React Native', 'Expo']} />
              <SkillGroup label="Engineering" items={['Termodinamik', 'LoRa / IoT', 'Arrhenius Kinetik', 'P&ID Diyagram']} />
              <SkillGroup label="Tools" items={['Git', 'Vercel', 'Recharts', 'Leaflet', 'Figma']} />
              <SkillGroup label="Languages" items={['JavaScript', 'TypeScript', 'Python', 'Java', 'Dart (öğreniyorum)']} />
            </div>
          </Section>

          {/* Languages */}
          <Section icon={<Award size={18} />} title="Diller / Languages">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { lang: 'Türkçe', level: 'Anadil' },
                { lang: 'İngilizce', level: 'İyi (B2)' },
              ].map(l => (
                <div key={l.lang} className="bg-terminal-bg border border-terminal-border p-3 print:border-gray-300">
                  <div className="text-terminal-text font-mono font-bold text-sm print:text-black">{l.lang}</div>
                  <div className="text-gray-400 text-xs font-mono print:text-gray-600">{l.level}</div>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:border-black { border-color: black !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .neon-glow { text-shadow: none !important; }
          nav, .terminal-chatbot { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-terminal-secondary font-mono font-bold text-lg mb-4 pb-2 border-b border-terminal-border print:text-gray-800 print:border-gray-300">
        <span className="text-terminal-accent print:text-gray-500">{icon}</span>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function CVItem({ title, subtitle, date, details }) {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <span className="text-terminal-text font-mono font-bold print:text-black">{title}</span>
        <span className="text-terminal-accent text-xs font-mono border border-terminal-accent px-2 py-0.5 print:text-gray-500 print:border-gray-400">
          {date}
        </span>
      </div>
      {subtitle && <p className="text-terminal-secondary text-sm font-mono mb-2 print:text-gray-600">{subtitle}</p>}
      <ul className="space-y-1">
        {details.map((d, i) => (
          <li key={i} className="text-gray-400 text-sm flex items-start gap-2 print:text-gray-700">
            <span className="text-terminal-secondary mt-0.5 print:text-gray-500">›</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SkillGroup({ label, items }) {
  return (
    <div>
      <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="px-2 py-0.5 bg-terminal-bg border border-terminal-border text-terminal-text text-xs font-mono print:border-gray-300 print:text-gray-700">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

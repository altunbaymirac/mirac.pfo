import { motion } from 'framer-motion'
import { Download, Mail, Github, Linkedin, Globe, MapPin, GraduationCap, Briefcase, Code, Award, Trophy, ExternalLink } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const CV_CONTENT = {
  tr: {
    pageTitle: 'Özgeçmiş',
    print: 'YAZDIR / İNDİR',
    role: 'Makine Mühendisliği Öğrencisi ve Yazılım Geliştirici',
    location: 'Kayseri, Türkiye',
    aboutTitle: 'Profesyonel Özet',
    about: 'Makine mühendisliği eğitimiyle yazılım geliştirme deneyimini birleştiriyorum. React, TypeScript, SQL ve gömülü sistemlerle çalışan ürünler geliştiriyor; müşteri sitelerini fikirden canlı yayına kadar yönetiyorum. LoRa tabanlı acil iletişim, yapay zeka destekli platformlar ve termodinamik simülasyonlar üzerine çalışıyorum.',
    educationTitle: 'Eğitim',
    education: [
      {
        title: 'Makine Mühendisliği',
        subtitle: 'Abdullah Gül Üniversitesi (AGÜ), Kayseri',
        date: 'Eyl 2024 - Devam ediyor',
        details: ['İngilizce lisans programı', 'Odak: mühendislik tasarımı, termodinamik, IoT ve yazılım geliştirme']
      },
      {
        title: 'Kerem Aydınlar Fen Lisesi',
        subtitle: 'Fen Bilimleri',
        date: '2023 mezunu',
        details: ['Arapgir, Malatya']
      }
    ],
    experienceTitle: 'Deneyim',
    experience: [
      {
        title: 'Mühendislik Stajyeri',
        subtitle: 'Altuntas Machinery',
        date: 'Ağu 2026 - Devam ediyor',
        details: ['Makine mühendisliği stajı kapsamında üretim ve mühendislik süreçlerinde görev alıyorum.']
      },
      {
        title: 'Web Geliştirici (Serbest)',
        subtitle: 'Adil Usta, gıda üretim ve perakende işletmesi',
        date: '2025 - Devam ediyor',
        details: ['Kurumsal web sitesini sıfırdan geliştirip yayına aldım ve bakımını sürdürüyorum.', 'React, Vite, JavaScript ve Vercel ile üretim ortamını yönetiyorum.']
      },
      {
        title: 'Web Geliştirici (Proje Bazlı)',
        subtitle: 'FedaGrup İnşaat ve diğer müşteriler',
        date: '2025',
        details: ['Kurumsal web sitelerini ihtiyaç analizinden canlı yayına kadar geliştirdim.', 'Mobil uyum, performans ve güven odaklı arayüzler oluşturdum.']
      },
      {
        title: 'Mekanik Tasarım Ekibi Üyesi',
        subtitle: 'ENCELADUS Roket Takımı, TEKNOFEST',
        date: 'Kas 2024 - Mar 2025',
        details: ['Roketin stabilizasyon kanatçıkları ve motor yatağı üzerinde SolidWorks ile çalıştım.']
      }
    ],
    projectsTitle: 'Projeler',
    projects: [
      {
        title: 'ConcreteWeb | Enkaz Altı Acil İletişim Sistemi',
        date: '2024 - Devam ediyor',
        details: [
          'Baz istasyonları çöktüğünde enkaz altındaki cihazlardan arama kurtarma ekiplerine ulaşmayı amaçlayan LoRa haberleşme ağı.',
          'ESP32, LoRa 868 MHz, C/C++, Python, React ve Leaflet.'
        ],
        links: [
          { label: 'Canlı Demo', href: '/demos/concreteweb' },
          { label: 'Proje Yazısı', href: '/blog/concreteweb-nedir' },
          { label: 'James Dyson Award', href: 'https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb', external: true }
        ]
      },
      {
        title: 'DCE-SOFC Dijital İkiz | Hibrit Gemi Tahrik Sistemi',
        date: 'Mar 2025 - Devam ediyor',
        details: [
          'Amonyak (NH₃) yakıtlı SOFC + Dual-Cycle Engine hibrit sistemi',
          'Arrhenius kinetikleri: k = A·exp(-Ea/RT), dönüşüm hesabı',
          'Recharts ile gerçek zamanlı enerji verimliliği ve emisyon grafikleri',
          'Terminal-stil P&ID mühendislik diyagramı (SVG animasyonlu)'
        ]
      },
      {
        title: 'Takaslat | Takas Marketplace',
        date: '2026 - Devam ediyor',
        details: [
          'Araç, elektronik ve gayrimenkul için yapay zeka destekli takas platformunu fikirden canlı ürüne geliştirdim.',
          'React, TypeScript, PostgreSQL, Supabase, Claude API, Docker ve Vercel.'
        ]
      },
      {
        title: 'ArfDAO Topluluk Web Sitesi',
        date: '2026 - Devam ediyor',
        details: [
          'Geliştirici topluluğunun iki dilli kurumsal sitesini tasarımdan yayına kadar geliştirdim ve bakımını sürdürüyorum.',
          'Modern, mobil uyumlu ve performans odaklı web deneyimi.'
        ],
        links: [{ label: 'arfdao.dev', href: 'https://arfdao.dev', external: true }]
      },
      {
        title: 'Puls | Konuma Dayalı Sosyal Ağ',
        date: '2025 - Devam ediyor',
        details: [
          'Konum tabanlı sosyal uygulamanın veri katmanını ve mobil ürün akışlarını geliştirdim.',
          'React Native, Flutter, PostgreSQL, Supabase ve SQL.'
        ]
      }
    ],
    skillsTitle: 'Teknik Beceriler',
    skills: [
      { label: 'Yazılım', items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'React Native', 'Flutter', 'Dart', 'REST API'] },
      { label: 'Veritabanı', items: ['SQL', 'PostgreSQL', 'Supabase', 'Firebase'] },
      { label: 'Gömülü ve Mühendislik', items: ['ESP32', 'Arduino', 'LoRa', 'C/C++', 'SolidWorks', 'MATLAB'] },
      { label: 'Araçlar', items: ['Git', 'GitHub', 'Vercel', 'Claude Code', 'Codex', 'Excel', 'Python', 'Docker'] }
    ],
    achievementsTitle: 'Başarılar',
    achievements: [
      { title: 'James Dyson Award 2026', details: ['ConcreteWeb ile ulusal başvuru ve jüri sunumu; MVP ile tekrar başvuru daveti.'] },
      { title: 'TÜBİTAK 4006 Bilim Fuarları', details: ['2018 ve 2022 yıllarında giyilebilir titreşim sistemi, Arduino tabanlı atık kutusu ve dosya şifreleme projeleri.'] }
    ],
    languagesTitle: 'Diller',
    languages: [
      { lang: 'Türkçe', level: 'Anadil' },
      { lang: 'İngilizce', level: 'İyi (B2)' }
    ]
  },
  en: {
    pageTitle: 'Curriculum Vitae',
    print: 'PRINT / DOWNLOAD',
    role: 'Mechanical Engineering Student and Software Developer',
    location: 'Kayseri, Türkiye',
    aboutTitle: 'Professional Summary',
    about: 'I combine mechanical engineering education with practical software development. I build products with React, TypeScript, SQL and embedded systems, and manage client websites from concept to production. My current work focuses on LoRa emergency communication, AI-assisted platforms and thermodynamic simulation.',
    educationTitle: 'Education',
    education: [
      {
        title: 'Mechanical Engineering',
        subtitle: 'Abdullah Gül University (AGÜ), Kayseri',
        date: 'Sep 2024 - Present',
        details: ['English-medium degree programme', 'Focus: engineering design, thermodynamics, IoT and software development']
      },
      {
        title: 'Kerem Aydınlar Science High School',
        subtitle: 'Science',
        date: 'Graduated 2023',
        details: ['Arapgir, Malatya']
      }
    ],
    experienceTitle: 'Experience',
    experience: [
      {
        title: 'Engineering Intern',
        subtitle: 'Altuntas Machinery',
        date: 'Aug 2026 - Present',
        details: ['Contributing to production and engineering processes as part of my mechanical engineering internship.']
      },
      {
        title: 'Freelance Web Developer',
        subtitle: 'Adil Usta, food production and retail business',
        date: '2025 - Present',
        details: ['Built and launched the corporate website from scratch and continue to maintain it.', 'Manage the production stack with React, Vite, JavaScript and Vercel.']
      },
      {
        title: 'Project-based Web Developer',
        subtitle: 'FedaGrup İnşaat and other clients',
        date: '2025',
        details: ['Delivered corporate websites from requirements analysis to production launch.', 'Created mobile-friendly, performant and trust-focused interfaces.']
      },
      {
        title: 'Mechanical Design Team Member',
        subtitle: 'ENCELADUS Rocket Team, TEKNOFEST',
        date: 'Nov 2024 - Mar 2025',
        details: ['Worked on the rocket stabilisation fins and motor mount using SolidWorks.']
      }
    ],
    projectsTitle: 'Projects',
    projects: [
      {
        title: 'ConcreteWeb | Under-Rubble Emergency Communication System',
        date: '2024 - Present',
        details: [
          'A LoRa communication network designed to connect under-rubble devices with search and rescue teams when base stations fail.',
          'ESP32, 868 MHz LoRa, C/C++, Python, React and Leaflet.'
        ],
        links: [
          { label: 'Live Demo', href: '/demos/concreteweb' },
          { label: 'Project Article', href: '/blog/concreteweb-nedir' },
          { label: 'James Dyson Award', href: 'https://www.jamesdysonaward.org/tr-TR/2026/project/concreteweb', external: true }
        ]
      },
      {
        title: 'DCE-SOFC Digital Twin | Hybrid Marine Propulsion System',
        date: 'Mar 2025 - Present',
        details: [
          'Ammonia (NH₃) fuelled SOFC + Dual-Cycle Engine hybrid system',
          'Arrhenius kinetics: k = A·exp(-Ea/RT), with conversion calculation',
          'Real-time energy efficiency and emission charts with Recharts',
          'Terminal-style P&ID engineering diagram (animated SVG)'
        ]
      },
      {
        title: 'Takaslat | Barter Marketplace',
        date: '2026 - Present',
        details: [
          'Built an AI-assisted barter platform for vehicles, electronics and real estate from concept to live product.',
          'React, TypeScript, PostgreSQL, Supabase, Claude API, Docker and Vercel.'
        ]
      },
      {
        title: 'ArfDAO Community Website',
        date: '2026 - Present',
        details: [
          'Designed, developed and continue to maintain the bilingual corporate website for a developer community.',
          'Modern, mobile-friendly and performance-focused web experience.'
        ],
        links: [{ label: 'arfdao.dev', href: 'https://arfdao.dev', external: true }]
      },
      {
        title: 'Puls | Location-Based Social Network',
        date: '2025 - Present',
        details: [
          'Developed the data layer and mobile product flows for a location-based social application.',
          'React Native, Flutter, PostgreSQL, Supabase and SQL.'
        ]
      }
    ],
    skillsTitle: 'Technical Skills',
    skills: [
      { label: 'Software', items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'React Native', 'Flutter', 'Dart', 'REST API'] },
      { label: 'Databases', items: ['SQL', 'PostgreSQL', 'Supabase', 'Firebase'] },
      { label: 'Embedded and Engineering', items: ['ESP32', 'Arduino', 'LoRa', 'C/C++', 'SolidWorks', 'MATLAB'] },
      { label: 'Tools', items: ['Git', 'GitHub', 'Vercel', 'Claude Code', 'Codex', 'Excel', 'Python', 'Docker'] }
    ],
    achievementsTitle: 'Achievements',
    achievements: [
      { title: 'James Dyson Award 2026', details: ['National submission and jury presentation with ConcreteWeb; invited to apply again with an MVP.'] },
      { title: 'TÜBİTAK 4006 Science Fairs', details: ['Projects in 2018 and 2022 covering wearable vibration, an Arduino-based waste bin and file encryption.'] }
    ],
    languagesTitle: 'Languages',
    languages: [
      { lang: 'Turkish', level: 'Native' },
      { lang: 'English', level: 'Good (B2)' }
    ]
  }
}

export default function CV() {
  const { lang } = useLanguage()
  const cv = CV_CONTENT[lang] || CV_CONTENT.tr
  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">

        {/* Action bar, hidden on print */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 print:hidden"
        >
          <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold text-terminal-text neon-glow">
            <Briefcase size={32} />
            {cv.pageTitle}
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono hover:bg-transparent hover:text-terminal-text transition-all"
          >
            <Download size={18} />
            <span>{cv.print}</span>
          </motion.button>
        </motion.div>

        {/* CV Content */}
        <div className="cv-sheet bg-terminal-darker border-2 border-terminal-text p-8 print:border-0 print:p-0 print:bg-white print:text-black space-y-8">

          {/* Header */}
          <div className="border-b-2 border-terminal-text pb-6 print:border-black">
            <h2 className="text-4xl font-bold text-terminal-text neon-glow print:text-black print:no-underline mb-1">
              Mirac Altunbay
            </h2>
            <p className="text-terminal-secondary font-mono text-lg mb-4 print:text-gray-600">
              {cv.role}
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-400 print:text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-terminal-accent print:text-gray-500" />
                mirac.altunbay@agu.edu.tr
              </span>
              <a href="https://miracaltunbay.com.tr" className="flex items-center gap-1.5 hover:text-terminal-text transition-colors print:text-gray-600" target="_blank" rel="noopener noreferrer">
                <Globe size={14} className="text-terminal-text print:text-gray-500" />
                miracaltunbay.com.tr
              </a>
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
                {cv.location}
              </span>
            </div>
          </div>

          {/* About */}
          <Section icon={<Code size={18} />} title={cv.aboutTitle}>
            <p className="text-gray-300 leading-relaxed print:text-gray-700">
              {cv.about}
            </p>
          </Section>

          {/* Education */}
          <Section icon={<GraduationCap size={18} />} title={cv.educationTitle}>
            {cv.education.map((item) => (
              <CVItem key={item.title} {...item} />
            ))}
          </Section>

          {/* Experience */}
          <Section icon={<Briefcase size={18} />} title={cv.experienceTitle}>
            {cv.experience.map((item) => (
              <CVItem key={item.title} {...item} />
            ))}
          </Section>

          {/* Projects */}
          <Section icon={<Briefcase size={18} />} title={cv.projectsTitle}>
            {cv.projects.map((item) => (
              <CVItem key={item.title} {...item} />
            ))}
          </Section>

          {/* Skills */}
          <Section icon={<Code size={18} />} title={cv.skillsTitle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cv.skills.map((group) => (
                <SkillGroup key={group.label} label={group.label} items={group.items} />
              ))}
            </div>
          </Section>

          {/* Achievements */}
          <Section icon={<Trophy size={18} />} title={cv.achievementsTitle}>
            {cv.achievements.map((item) => (
              <CVItem key={item.title} {...item} />
            ))}
          </Section>

          {/* Languages */}
          <Section icon={<Award size={18} />} title={cv.languagesTitle}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cv.languages.map(l => (
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
        @page { size: A4; margin: 10mm; }
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
          .cv-sheet { font-size: 10px; line-height: 1.32; }
          .cv-sheet > * { margin-bottom: 12px !important; }
          .cv-section { break-inside: avoid; }
          .cv-section h3 { font-size: 13px !important; margin-bottom: 7px !important; padding-bottom: 4px !important; }
          .cv-section > div { gap: 6px !important; }
          .cv-item { break-inside: avoid; margin-bottom: 7px !important; }
          .cv-item li, .cv-item p { font-size: 9px !important; line-height: 1.3 !important; }
          .neon-glow { text-shadow: none !important; }
          nav, .terminal-chatbot, canvas { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function Section({ icon, title, children }) {
  return (
    <div className="cv-section">
      <h3 className="flex items-center gap-2 text-terminal-secondary font-mono font-bold text-lg mb-4 pb-2 border-b border-terminal-border print:text-gray-800 print:border-gray-300">
        <span className="text-terminal-accent print:text-gray-500">{icon}</span>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function CVItem({ title, subtitle, date, details, links = [] }) {
  return (
    <div className="cv-item mb-4">
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
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 print:hidden">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 px-2 py-1 border border-terminal-secondary text-terminal-secondary text-xs font-mono hover:bg-terminal-secondary hover:text-terminal-bg transition-colors"
            >
              {link.label}
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      )}
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

import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    nav: {
      home: 'home', blog: 'blog', projects: 'projects',
      games: 'games', analytics: 'analytics', contact: 'contact', cv: 'cv'
    },
    home: {
      subtitle: 'Engineering Student',
      bio: 'I am a first-year Mechanical Engineering student at AGÜ, building practical web, simulation, and engineering projects while learning through real work.',
      btnProjects: 'VIEW PROJECTS',
      btnContact: 'CONTACT',
      featuredTitle: 'Featured Projects',
      skillsTitle: 'Technical Skills',
      ctaTitle: "Let's Talk Projects",
      ctaDesc: 'Reach out if you want to chat about ConcreteWeb, DCE-SOFC or anything else.',
      ctaBtn: 'GET IN TOUCH',
      cvBtn: 'DOWNLOAD CV',
      stats: [
        { label: 'Projects', value: '6' },
        { label: 'Technologies', value: '15+' },
        { label: 'Lines of Code', value: '10k+' },
        { label: 'Coffee Consumed', value: '∞' }
      ],
      timelineTitle: 'Journey'
    },
    contact: {
      title: 'Get In Touch',
      subtitle: "Let's collaborate on projects, discuss opportunities, or just chat about engineering",
      send: 'Send Message',
      name: 'NAME', email: 'EMAIL', subject: 'SUBJECT', message: 'MESSAGE',
      contactType: 'CONTACT TYPE',
      types: ['Collaboration Inquiry', 'Investor Contact', 'Job Opportunity', 'General Question'],
      submit: 'SEND MESSAGE', submitted: 'MESSAGE SENT!',
      downloadCv: 'Download CV', downloadDesc: 'Get my full resume with project details, technical skills, and academic background',
      downloadBtn: 'DOWNLOAD PDF',
      direct: 'Direct Contact', social: 'Social & Professional',
      response: 'Response time: Usually within 24 hours'
    },
    projects: {
      title: 'Projects',
      subtitle: 'Live demos, 3D visualizations, and interactive APIs',
      currentTitle: 'Current Projects'
    },
    blog: {
      title: 'Blog & Dev Log',
      subtitle: 'Engineering insights, project updates, and technical deep-dives',
      back: 'Back to blog',
      read: 'read',
      share: 'Share',
      copied: 'Copied!',
      notFound: 'Post not found'
    }
  },
  tr: {
    nav: {
      home: 'anasayfa', blog: 'blog', projects: 'projeler',
      games: 'oyunlar', analytics: 'analitik', contact: 'iletişim', cv: 'özgeçmiş'
    },
    home: {
      subtitle: 'Engineering Student',
      bio: 'AGÜ Makine Mühendisliği 1. sınıf öğrencisiyim. Web, simülasyon ve mühendislik projeleri geliştirerek öğreniyor; fikirleri çalışan ürünlere dönüştürmeye odaklanıyorum.',
      btnProjects: 'PROJELERİ GÖR',
      btnContact: 'İLETİŞİM',
      featuredTitle: 'Öne Çıkan Projeler',
      skillsTitle: 'Teknik Beceriler',
      ctaTitle: 'Projeler Hakkında Konuşalım',
      ctaDesc: 'ConcreteWeb, DCE-SOFC veya başka bir proje hakkında sohbet etmek istersen yazabilirsin.',
      ctaBtn: 'İLETİŞİME GEÇ',
      cvBtn: 'CV İNDİR',
      stats: [
        { label: 'Proje', value: '6' },
        { label: 'Teknoloji', value: '15+' },
        { label: 'Kod Satırı', value: '10k+' },
        { label: 'Kahve', value: '∞' }
      ],
      timelineTitle: 'Yolculuk'
    },
    contact: {
      title: 'İletişime Geç',
      subtitle: 'Projeler üzerinde iş birliği, fırsatlar veya mühendislik hakkında sohbet için yaz',
      send: 'Mesaj Gönder',
      name: 'İSİM', email: 'E-POSTA', subject: 'KONU', message: 'MESAJ',
      contactType: 'İLETİŞİM TÜRÜ',
      types: ['İş Birliği', 'Yatırımcı', 'İş Teklifi', 'Genel Soru'],
      submit: 'MESAJ GÖNDER', submitted: 'MESAJ GÖNDERİLDİ!',
      downloadCv: 'CV İndir', downloadDesc: 'Proje detayları, teknik beceriler ve akademik geçmişimle tam özgeçmişimi indir',
      downloadBtn: 'PDF İNDİR',
      direct: 'Direkt İletişim', social: 'Sosyal & Profesyonel',
      response: 'Yanıt süresi: Genellikle 24 saat içinde'
    },
    projects: {
      title: 'Projeler',
      subtitle: 'Canlı demolar, 3D görseller ve interaktif API\'lar',
      currentTitle: 'Mevcut Projeler'
    },
    blog: {
      title: 'Blog & Geliştirme Günlüğü',
      subtitle: 'Mühendislik notları, proje güncellemeleri ve teknik yazılar',
      back: 'Bloga dön',
      read: 'okuma',
      share: 'Paylaş',
      copied: 'Kopyalandı!',
      notFound: 'Yazı bulunamadı'
    }
  }
}

export function LanguageProvider({ children }) {
  // Dil seçimi sayfa yenilendiğinde kaybolmasın
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'tr'
    return window.localStorage.getItem('lang') === 'en' ? 'en' : 'tr'
  })

  const toggle = () => setLang(l => {
    const next = l === 'tr' ? 'en' : 'tr'
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', next)
    return next
  })

  const t = translations[lang]
  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

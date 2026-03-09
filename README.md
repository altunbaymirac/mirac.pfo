# Mirac Altunbay - Engineering Portfolio v2.0

Modern, terminal-themed portfolio website with live project demonstrations.

## 🚀 Features

- ✅ **FLARE Advanced Simulator** - Interactive LoRa beacon tracking with Leaflet maps
- ✅ **DCE-SOFC Digital Twin** - Real thermodynamic simulation with Recharts graphs + P&ID
- ✅ **Firebase Visitor Counter** - Real-time analytics
- ✅ **3D Beacon Model** - Three.js interactive visualization
- ✅ **Mobile Responsive** - Hamburger menu + touch-friendly
- ✅ **Blog System** - Technical articles with syntax highlighting
- ✅ **Projects Showcase** - FLARE, DCE-SOFC, GeoSocial

## 📦 Installation

```bash
# 1. Extract and enter directory
cd portfolio-v2

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

## 🔥 Firebase Setup (IMPORTANT for Visitor Counter)

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable **Realtime Database** (NOT Firestore!)
4. Go to Project Settings → General → Your apps
5. Copy your config
6. Paste into `src/utils/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
}
```

**Without Firebase:** Visitor counter falls back to localStorage (local only).

## 🌐 Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**In Vercel Dashboard:**
1. Import repository
2. Framework Preset: **Vite** ⚠️ (NOT "Other"!)
3. Node.js Version: **20.x** ⚠️ (NOT 24.x!)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy!

## 🛠 Tech Stack

- React 18 + Vite
- TailwindCSS
- Framer Motion
- Three.js + React Three Fiber
- Leaflet + React Leaflet
- Recharts
- Firebase Realtime Database
- React Router
- Lucide React Icons

## 📱 Mobile Responsive Features

- Hamburger menu (☰) on mobile
- Touch-friendly simulators
- Responsive grids (4 columns → 2 columns)
- Full-width buttons
- Optimized font sizes

## 🎨 Customization

### Change Terminal Colors

`tailwind.config.js`:
```javascript
colors: {
  'terminal-accent': '#ff6b35',      // Orange
  'terminal-secondary': '#00d9ff',   // Cyan
}
```

### Add Blog Post

`src/data/blogPosts.js`:
```javascript
{
  slug: 'my-post',
  title: 'My Title',
  date: '2025-03-10',
  readTime: '5 min',
  tags: ['Tag1', 'Tag2'],
  excerpt: 'Short description',
  content: `# Markdown content`
}
```

## 🐛 Common Issues

**Leaflet map not showing:**
```bash
npm install leaflet react-leaflet
```

**Vercel white screen:**
- Check Framework = **Vite** (not Other)
- Check Node = **20.x** (not 24.x)

**Firebase not working:**
- Make sure you enabled **Realtime Database** (not Firestore)
- Check databaseURL format is correct

## 📞 Contact

**Mirac Altunbay**  
1. Sınıf Makine Mühendisliği, AGÜ

- 📧 mirac.altunbay@agu.edu.tr
- 🐙 [github.com/altunbaymirac](https://github.com/altunbaymirac)
- 💼 [linkedin.com/in/miraç-altunbay](https://www.linkedin.com/in/miraç-altunbay)

## 📄 License

MIT

---

**Built with ❤️ by Mirac Altunbay**

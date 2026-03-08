# 🚀 Mirac Altunbay - Portfolio v2.0

Modern, terminal-themed portfolio website with live project demos, 3D visualizations, real-time analytics, and interactive features.

## ✨ Features Implemented

### 1️⃣ Live Project Demos
- **FLARE Emergency System**: Embedded simulation of LoRa-based disaster communication
- **DCE-SOFC Hybrid Propulsion**: Real-time thermodynamic digital twin
- Fullscreen modal viewer
- Direct links to standalone demos

### 2️⃣ Blog System
- Markdown-based posts with syntax highlighting
- Auto-generated post list from data
- Individual post pages with beautiful typography
- Code blocks with language-specific highlighting
- Tags and metadata
- Share functionality

### 3️⃣ 3D Interactive Element
- **FLARE Beacon 3D Model** using Three.js & React Three Fiber
- Interactive orbit controls (drag to rotate)
- Real-time animations (signal rings, LED indicators)
- Toggle transmission mode
- Smooth performance with 60 FPS

### 4️⃣ API Playground
- Live API testing interface
- Multiple endpoints (FLARE, DCE-SOFC)
- Request/response visualization
- Parameter customization
- Copy response functionality
- Simulated latency and status codes

### 5️⃣ Real-Time Analytics Dashboard
- Visitor statistics (total, today, session time)
- 24-hour visitor trend (Line chart)
- Geographic distribution (Doughnut chart)
- Device breakdown (Mobile/Desktop/Tablet)
- Top pages with visual bars
- Live activity feed
- Auto-updating metrics

### 6️⃣ Micro-Interactions (Framer Motion)
- Smooth page transitions
- Hover effects with scale/tilt
- Button press animations
- Card lift on hover
- Icon rotations
- Stagger animations on lists
- Terminal cursor blink
- Matrix rain background

### 7️⃣ Contact Form & CV Download
- Functional contact form with validation
- Contact type selection
- Auto-reply confirmation
- CV download button
- Social media links
- Response time indicator

### 8️⃣ Additional Features
- Terminal-themed design (dark mode)
- Matrix rain background effect
- Neon glow text effects
- Custom scrollbar
- Responsive grid layouts
- SEO-optimized meta tags
- Font optimization (JetBrains Mono)

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Charts**: Chart.js + react-chartjs-2
- **Markdown**: react-markdown + remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
portfolio-v2/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx           # Terminal-themed nav with animations
│   │   ├── MatrixRain.jsx           # Canvas-based background effect
│   │   ├── FlareBeacon3D.jsx        # Three.js 3D beacon model
│   │   ├── LiveProjectDemos.jsx     # Embedded project simulations
│   │   ├── APIPlayground.jsx        # Interactive API testing
│   │   └── AnalyticsDashboard.jsx   # Real-time stats & charts
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page with all features
│   │   ├── Blog.jsx                 # Blog post listing
│   │   ├── BlogPost.jsx             # Individual post viewer
│   │   ├── Projects.jsx             # Projects showcase
│   │   ├── Analytics.jsx            # Analytics page
│   │   └── Contact.jsx              # Contact form & info
│   ├── data/
│   │   └── blogPosts.js             # Markdown blog content
│   ├── App.jsx                      # Router setup
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd portfolio-v2
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

## 🎨 Design Philosophy

### Terminal Theme
- Dark background (#0a0e27)
- Neon green primary (#00ff41)
- Cyan secondary (#00d9ff)
- Orange accent (#ff6b35)
- Monospace fonts (JetBrains Mono)

### Micro-Interactions
- Every clickable element has feedback
- Smooth transitions (0.3s)
- Scale/tilt effects on hover
- Icon rotations and glows

### Performance
- Code splitting with React Router
- Lazy-loaded 3D components
- Optimized animations (GPU-accelerated)
- Efficient canvas rendering

## 📊 Analytics Implementation

The analytics dashboard uses simulated data, but in production you would:

1. **Add Google Analytics:**
```javascript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

2. **Track Events:**
```javascript
gtag('event', 'page_view', {
  page_path: window.location.pathname
});
```

3. **Real-time Data:**
Use Firebase Realtime Database or a custom backend to stream visitor data.

## 🔌 API Integration

The API Playground is currently simulated. To connect to real APIs:

1. **Update endpoint URLs** in `APIPlayground.jsx`
2. **Add axios requests:**
```javascript
const response = await axios.get(`/api/flare/beacon/${id}`);
setResponse(response.data);
```

3. **Handle authentication** if needed

## 📝 Adding Blog Posts

Edit `src/data/blogPosts.js`:

```javascript
export const blogPosts = [
  {
    slug: 'your-post-slug',
    title: 'Your Post Title',
    date: '2025-01-15',
    readTime: '5 min',
    tags: ['React', 'Engineering'],
    excerpt: 'Short description...',
    content: `
# Your Post Title

Your markdown content here with **bold**, *italic*, and \`code\`.

\`\`\`javascript
const example = "code blocks work too";
\`\`\`
    `
  }
]
```

## 🎯 SEO Optimization

### Meta Tags
Update in `index.html`:
```html
<meta name="description" content="Your description">
<meta property="og:title" content="Mirac Altunbay - Portfolio">
<meta property="og:image" content="/og-image.jpg">
```

### Sitemap
Generate with:
```bash
npm install --save-dev vite-plugin-sitemap
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

## 🔧 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  terminal: {
    bg: '#YOUR_COLOR',
    text: '#YOUR_COLOR',
    // ...
  }
}
```

### Fonts
Update in `index.html` and `tailwind.config.js`

### 3D Model
Modify `FlareBeacon3D.jsx` to change beacon appearance

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "framer-motion": "^10.16.16",
  "three": "^0.159.0",
  "@react-three/fiber": "^8.15.12",
  "@react-three/drei": "^9.92.7",
  "react-markdown": "^9.0.1",
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0",
  "lucide-react": "^0.303.0"
}
```

## 🐛 Known Issues

- 3D beacon may lag on low-end devices (consider adding performance mode)
- Matrix rain can be CPU-intensive (toggle off option recommended)
- Some animations may not work on Safari < 14

## 🔮 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Multi-language support (TR/EN)
- [ ] Blog post search
- [ ] Project filtering by tech stack
- [ ] Visitor heatmap
- [ ] Easter eggs (Konami code, hidden games)
- [ ] Resume builder interface
- [ ] Live coding sandbox

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 👨‍💻 Author

**Mirac Altunbay**
- GitHub: [@miracaltunbay](https://github.com/miracaltunbay)
- LinkedIn: [Mirac Altunbay](https://linkedin.com/in/miracaltunbay)
- Email: mirac.altunbay@agu.edu.tr

---

Built with ❤️ using React, Three.js, and way too much coffee ☕

import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    // Tawk.to script injection
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/YOUR_TAWK_ID/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
    })();
  }, [])

  return null // Widget otomatik render olur
}

// KULLANIM:
// 1. https://tawk.to ücretsiz hesap aç
// 2. Widget oluştur, property ID'ni al
// 3. Yukarıdaki 'YOUR_TAWK_ID' yerine koy
// 4. App.jsx'e import et

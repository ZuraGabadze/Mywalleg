import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== 'apple-wallet-pwa-v2') {
        caches.delete(key);
      }
    });
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.update();
      })
      .catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(<App />);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './contxt/ShopContext.jsx';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ShopContextProvider>
  </StrictMode>
);

// In your main HTML/JS file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js?v=6') // 🔥 Add version query param
    .then((registration) => {
      console.log('✅ Service Worker registered');

      // 🔥 Auto-update when new version detected
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            console.log('🔄 New version available! Refreshing...');
            window.location.reload();
          }
        });
      });
    });
}

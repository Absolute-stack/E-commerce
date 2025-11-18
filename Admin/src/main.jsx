import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import AdminContextProvider from './context/Admincontext.jsx';

console.log('🟢 main.jsx is running!');
console.log('🟢 Backend URL:', import.meta.env.VITE_BACKEND_URL);

try {
  const rootElement = document.getElementById('root');
  console.log('🟢 Root element:', rootElement);

  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  const root = createRoot(rootElement);
  console.log('🟢 React root created');

  root.render(
    <StrictMode>
      <AdminContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminContextProvider>
    </StrictMode>
  );

  console.log('🟢 React rendered successfully!');
} catch (error) {
  console.error('❌ FATAL ERROR in main.jsx:', error);
  document.body.innerHTML = `
    <div style="padding: 50px; background: red; color: white;">
      <h1>ERROR</h1>
      <pre>${error.message}</pre>
      <pre>${error.stack}</pre>
    </div>
  `;
}

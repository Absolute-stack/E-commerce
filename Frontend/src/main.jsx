import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ShopContextProvider from './contxt/ShopContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <ShopContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ShopContextProvider>
);

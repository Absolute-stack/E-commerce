import { useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Searchbar from './components/SearchBar';
import Home from './pages/Home';
import Collection from './pages/Collection.jsx';
import Product from './pages/Product';
import Cart from './pages/Cart.jsx';
import PlaceOrders from './pages/placeorder.jsx';
import Orders from './pages/Orders.jsx';
import Verify from './pages/Verify.jsx';
import Login from './pages/Login.jsx';
import { assets } from './assets/assest.js';
import './App.css';

// Move constants outside component - they never change
const PHONE_NUMBER = '233557122327';
const CURRENT_YEAR = new Date().getFullYear();

// Move device detection logic outside - runs once instead of every render
const isPhone = /iPhone|Android.+Mobile/i.test(navigator.userAgent);

function App() {
  // useMemo prevents recalculating on every render
  const contactLink = useMemo(() => {
    return isPhone ? `tel:${PHONE_NUMBER}` : `https://wa.me/${PHONE_NUMBER}`;
  }, []); // Empty array = calculate once

  const contactIcon = isPhone ? assets.call : assets.whatsapp;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add your subscribe logic here
    const phoneNumber = e.target.elements['newsletter-number'].value;
    console.log('Subscribed:', phoneNumber);
  };

  return (
    <>
      <ToastContainer autoClose={3000} position="top-right" />
      <Navbar />
      <Searchbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={<PlaceOrders />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <footer className="footer">
        {/* Footer Top Section */}
        <div className="footer-top">
          <div className="contact">
            <a
              href={contactLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us via phone or WhatsApp"
            >
              <img
                className="footer-icon"
                loading="lazy"
                src={contactIcon}
                alt={isPhone ? 'Call us' : 'WhatsApp us'}
              />
              <p>Make Enquiries</p>
            </a>
          </div>

          <div className="newsletter">
            <label htmlFor="newsletter-number" className="label">
              Subscribe to Get News of New Arrivals and Promotions
            </label>
            <form className="grid-newsletter" onSubmit={handleNewsletterSubmit}>
              <input
                type="tel"
                id="newsletter-number"
                name="newsletter-number"
                placeholder="Enter your number here..."
                pattern="[0-9]*"
                inputMode="numeric"
                required
                aria-label="Phone number for newsletter"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Footer Main Links */}
        <nav className="footer-main" aria-label="Footer navigation">
          <h3>CLIENT SERVICES</h3>
          <div className="footer-item">
            <Link to="/" className="footer-item-link">
              Home
            </Link>
            <Link to="/collection" className="footer-item-link">
              Collection
            </Link>
            <Link to="/cart" className="footer-item-link">
              Cart
            </Link>
            <Link to="/orders" className="footer-item-link">
              Orders
            </Link>
          </div>
        </nav>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {CURRENT_YEAR} DARKAH - All Rights Reserved - Made by
            ABSOLUTE-STACK with Care
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

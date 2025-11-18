import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Searchbar from './components/SearchBar';
import Product from './pages/Product';
import { assets } from './assets/assest.js';
import Collection from './pages/Collection.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import PlaceOrders from './pages/placeorder.jsx';
import Verify from './pages/Verify.jsx';

function App() {
  const phoneNumber = '233557122327';

  // Only iPhone + Android phones
  const isPhone = /iPhone|Android.+Mobile/i.test(navigator.userAgent);

  const link = isPhone
    ? `tel:${phoneNumber}` // 📱 Phone → call
    : `https://wa.me/${phoneNumber}`; // 💻 Desktop & Tablets → WhatsApp

  const icon = isPhone ? assets.call : assets.whatsapp;

  return (
    <>
      <ToastContainer />
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
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                className="footer-icon"
                loading="lazy"
                src={icon}
                alt="Contact Icon"
              />
              <p>Make Enquiries</p>
            </a>
          </div>

          <div className="newsletter">
            <div className="label">
              <label htmlFor="newsletter-number">
                Subscribe to Get News of New Arrivals and Promotions
              </label>
            </div>
            <div className="grid-newsletter">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); /* Add your subscribe logic */
                }}
              >
                <input
                  type="tel"
                  id="newsletter-number"
                  placeholder="Enter your number here..."
                  pattern="[0-9]*"
                  required
                  aria-label="Phone number for newsletter"
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Main Links */}
        <div className="footer-main">
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
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} DARKAH - All Rights Reserved - Made by
            ABSOLUTE-STACK with Care
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

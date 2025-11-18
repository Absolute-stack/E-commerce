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
  const phoneNumber = '233555555555';

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
        <div className="footer-top flex-sb">
          <div className="contact">
            <a href={link} target="_blank" className="flex-sb">
              <img className="footer-icon" loading="lazy" src={icon} alt="" />
              <p>Make Enquires</p>
            </a>
          </div>
          <div className="newsletter">
            <div className="label">
              <label htmlFor="Number">
                Subscribe to Get News of New Arrivals and Promotions
              </label>
            </div>
            <div className="grid-newsletter">
              <form action="#" className="flex">
                <input
                  type="number"
                  id="Number"
                  placeholder="Enter your number here..."
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        <div className="footer-main">
          <h3>CLIENT SERVICES</h3>
          <ul className="footer-item flow">
            <Link to="/" className="footer-item-link">
              Home
            </Link>
            <Link to="/collection" className="footer-item-link">
              Collection
            </Link>
            <Link to="/contact" className="footer-item-link">
              Contact
            </Link>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; DARKAH -All RIGHTS RESERVED-MADE BY ABSOLUTE-STACK WITH CARE
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

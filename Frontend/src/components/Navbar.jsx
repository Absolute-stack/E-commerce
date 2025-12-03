import { useState, useEffect, use } from 'react';
import { assets } from '../assets/assest.js';
import { useContext } from 'react';
import { ShopContext } from '../contxt/ShopContext.jsx';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { showSearchbar, setShowSearchbar, getCartQuantity, cartItems } =
    useContext(ShopContext);
  const [fixed, setFixed] = useState('');

  useEffect(() => {
    function autoadd() {
      if (window.scrollY > 50) {
        setFixed('active');
      } else {
        setFixed('');
      }
    }

    window.addEventListener('scroll', autoadd);

    return () => window.removeEventListener('scroll', autoadd);
  }, []);

  useEffect(() => {
    getCartQuantity();
  }, [cartItems]);

  return (
    <nav className={`prim-nav ${fixed}`}>
      <Link to="/">
        <div className="logo-container">
          <img src={assets.logo} loading="eager" alt="" />
        </div>
      </Link>
      <div className="wrapper flex gap-01">
        <div className="profile-container">
          <img
            src={assets.profie_icon}
            loading="eager"
            alt=""
            className="icon-btn"
          />
          <div className="dropdown-menu">
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">My Cart</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div className="cart-container">
          <Link to="/cart">
            <img className="icon-btn" src={assets.cart} alt="" />
            <p>{`${getCartQuantity()}`}</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

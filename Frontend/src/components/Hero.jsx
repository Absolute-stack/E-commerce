import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import { assets } from '../assets/assest';
import './Hero.css';

function Hero() {
  const { products, setProducts } = useContext(ShopContext);
  const [hero, setHero] = useState('');
  useEffect(() => {
    setHero('active');
  }, []);
  return (
    <>
      <div className={`hero-banner ${hero}`}>
        <img src="/darkah_hero.webp" loading="eager" alt="" />
        <div className="hero-content">
          <h1>Elevate Your Essence with Darkah</h1>
          <h3>Warning May Cause Envy Handle With Style</h3>
          <p>
            Discover handcrafted pieces designed to inspire confidence, grace,
            and individuality. Every detail, every contour, every finish —
            perfected for the woman who defines her own elegance.
          </p>
        </div>
      </div>
    </>
  );
}

export default Hero;

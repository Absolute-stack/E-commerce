import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assest';
import Hero from '../components/Hero';
import LatestArrivals from '../components/LatestArrivals';
import Bestsellers from '../components/BestSellers';
import './Home.css';

function Home() {
  const tickingRef = useRef(false);

  // Extracted reusable component
  function GridItem({ image, title, alt }) {
    return (
      <div className="grid-container-img-holder">
        <img loading="lazy" src={image} alt={alt} />
        <div className="img-holder-content">
          <h3>{title}</h3>
          <Link to="/collection">
            <p className="hero-link">Discover</p>
          </Link>
        </div>
      </div>
    );
  }
  useEffect(function setupScrollAnimation() {
    const gridContainer = document.querySelector('.grid-container');
    const sections = document.querySelectorAll('section');

    function handleAnimation(element) {
      if (!element) return;

      const elementInView =
        element.getBoundingClientRect().top < window.innerHeight / 1.15;

      if (elementInView) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    }

    function handleScroll() {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          handleAnimation(gridContainer);
          sections.forEach((sec) => handleAnimation(sec));
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    }

    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main>
      <Hero />

      <section className="section">
        <LatestArrivals />
      </section>

      <section className="section">
        <Bestsellers />
      </section>

      <section>
        <div className="grid-container">
          <GridItem
            image={assets.hero_1}
            title="New Arrivals"
            alt="New arrivals collection showcase"
          />

          <GridItem
            image={assets.hero_2}
            title="Gift For Women"
            alt="Women's gift collection showcase"
          />

          <section className="section grid-container-third">
            <GridItem
              image={assets.hero_3}
              title="New Collection"
              alt="New collection showcase"
            />
          </section>
        </div>
      </section>
    </main>
  );
}

export default Home;

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assest';
import Hero from '../components/Hero';
import LatestArrivals from '../components/LatestArrivals';
import Bestsellers from '../components/BestSellers';
import './Home.css';

function Home() {
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

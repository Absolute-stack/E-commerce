import { useEffect, useState } from 'react';
import { assets } from '../assets/assest';
import Bestsellers from '../components/BestSellers';
import Hero from '../components/Hero';
import LatestArrrivals from '../components/LatestArrivals';
import './Home.css';
import { Link } from 'react-router-dom';
function Home() {
  const [animate, setAnimate] = useState('');
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    const gridContainer = document.querySelector('.grid-container');
    const sections = document.querySelectorAll('section');
    function animation(element) {
      const elementInView =
        element.getBoundingClientRect().top < window.innerHeight / 1.15;

      if (elementInView) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          animation(gridContainer);
          sections.forEach((sec) => animation(sec));
          setTicking(false);
        });
      }
      setTicking(true);
    });
  }, []);

  return (
    <>
      <main>
        <Hero />
        <section className={`section `}>
          <LatestArrrivals />
        </section>
        <section className={`section `}>
          <Bestsellers />
        </section>
        <section>
          <div className={`grid-container `}>
            <div className="grid-container-img-holder">
              <img loading="lazy" src={assets.hero_1} alt="" />
              <div className="img-holder-content">
                <h3>New Arrivals</h3>
                <Link to="/collection">
                  <p className="hero-link">Discover</p>
                </Link>
              </div>
            </div>
            <div className="grid-container-img-holder">
              <div className="grid-container-img-holder">
                <img loading="lazy" src={assets.hero_2} alt="" />
                <div className="img-holder-content">
                  <h3>Gift For Women</h3>
                  <Link to="/collection">
                    <p className="hero-link">Discover</p>
                  </Link>
                </div>
              </div>
            </div>
            <section className="section grid-container-third">
              <div className="grid-container-img-holder">
                <div className="grid-container-img-holder">
                  <img loading="lazy" src={assets.hero_3} alt="" />
                  <div className="img-holder-content">
                    <h3>New Collection</h3>
                    <Link to="/collection">
                      <p className="hero-link">Discover</p>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;

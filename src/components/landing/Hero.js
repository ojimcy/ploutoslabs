import React from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';

import './Hero.css';
import blueRay from '../../assets/images/blue-ray.png';
import hero1 from '../../assets/images/1.png';
import hero2 from '../../assets/images/2.png';
import hero4 from '../../assets/images/4.png';
import hero6 from '../../assets/images/6.png';
import hero7 from '../../assets/images/7.png';
import hero8 from '../../assets/images/8.png';

export default function Hero() {
  return (
    <>
      <img className="landing-ray" src={blueRay} alt="" />
      <section id="home" className="landing">
        <div className="hero">
          <div className="hero-main">
            <div className="hero-background "></div>
            <div className="hero-content d-flex justify-content-center align-items-center">
              <Container>
                <div className="coins">
                  <img className="img-1 hero-img" src={hero1} alt="" />
                  <img className="img-2 hero-img" src={hero2} alt="" />
                  <img className="img-3 hero-img" src={hero1} alt="" />
                  <img className="img-4 hero-img" src={hero4} alt="" />
                  <img className="img-5 hero-img" src={hero1} alt="" />
                  <img className="img-6 hero-img" src={hero6} alt="" />
                  <img className="img-7 hero-img" src={hero7} alt="" />
                  <img className="img-8 hero-img" src={hero8} alt="" />
                </div>
                <div className="content-title">
                  <h1
                    className="wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <span>Ploutos</span> <br /> Redefining Cryptocurrency.
                  </h1>
                  <p
                    className="wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="1s"
                  >
                    With a limited supply released gradually over 8 years,
                    PLOUTOS ensures stability. Partnering with celebrities and
                    companies worldwide, we offer diverse utilities. Join us in
                    revolutionizing the crypto space.
                  </p>
                  <div className="hero-actions">
                    <Link className="btn btn-primary hero-btn" to="/">
                      Buy
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { FaTwitter, FaTelegram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import './Footer.css';

import logo from '../../../assets/images/ploutos-logo 3.png';

function Footer() {
  return (
    <footer>
      <div className="footer-area">
        <Container> 
          <div className="footer-top d-flex align-items-center justify-content-center">
            <Row>
              <Col className="footer-widget" data-wow-delay=".2s">
                <div className="news-letter ">
                  <h3>Get notified of upcoming drops</h3>

                  <form className="subscription-form">
                    <input type="email" placeholder="Enter your email" />
                    <Button type="submit">Subscribe</Button>
                  </form>
                </div>
              </Col>
            </Row>
          </div>
          <div className="footer-bottom">
            <Row className=" justify-content-end">
              <Col md="2" className="d-flex flex-column align-items-center">
                <Link to="/" className="footer-logo">
                  <img src={logo} alt="logo" />
                  <span>PLOUTOS</span>
                </Link>
                <div className="footer-content">
                  <ul className="footer-social">
                    <li>
                      <Link
                        to="https://twitter.com/ploutoslabs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTwitter />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://t.me/ploutoslab"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTelegram />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin />
                      </Link>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md="2"></Col>
              <Col md="8" className="footer-right">
                <Row className="flex-end mt-5">
                  {/* Marketplace Column */}
                  <Col md="4">
                    <h4>Marketplace</h4>
                    <ul>
                      <li>
                        <Link to="/#tokenomics">Tokenomics</Link>
                      </li>
                      <li>
                        <Link to="https://ploutoslabs.gitbook.io/ploutos-white-paper">
                          Whitepaper
                        </Link>
                      </li>
                      <li>
                        <Link to="/#airdrop">Airdrop</Link>
                      </li>
                    </ul>
                  </Col>
                  {/* Company Column */}
                  <Col md="4">
                    <h4>Company</h4>
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/#about">About</Link>
                      </li>
                    </ul>
                  </Col>
                  {/* Contact Column */}
                  <Col md="4">
                    <h4>Contact</h4>
                    <ul>
                      <li>
                        <Link to="/#support">Support</Link>
                      </li>
                      <li>
                        <Link to="/#faq">FAQ</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;

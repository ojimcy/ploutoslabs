import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUsers, FaGem, FaHome, FaTools } from 'react-icons/fa';
import './Footer.css';
import { toast } from 'react-toastify';

function AirdropFooter() {
  const location = useLocation();

  const handleComingSoonClicked = () => {
    if (toast) {
      toast.info('This feature will be available soon');
    } else {
      console.error('Toast is not defined');
    }
  };

  return (
    <footer className="footer">
      <Container>
        <div className="footer-bottom">
          <Row>
            <Col className="d-flex flex-column align-items-center">
              <div className="footer-content">
                <ul className="footer-links list-unstyled">
                  <li>
                    <Link
                      to="/dashboard/airdrop"
                      className={`d-flex flex-column align-items-center ${
                        location.pathname === '/dashboard/airdrop'
                          ? 'active'
                          : ''
                      }`}
                    >
                      <FaHome size={28} />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/tasks"
                      className={`d-flex flex-column align-items-center ${
                        location.pathname === '/dashboard/tasks' ? 'active' : ''
                      }`}
                    >
                      <FaTasks size={28} />
                      <span className="mt-1">Tasks</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/"
                      className={`d-flex flex-column align-items-center ${
                        location.pathname === '/dashboard/' ? 'active' : ''
                      }`}
                    >
                      <FaGem size={28} />
                      <span className="mt-1">Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      onClick={handleComingSoonClicked}
                      className={`d-flex flex-column align-items-center ${
                        location.pathname === '/game' ? 'active' : ''
                      }`}
                    >
                      <FaTools size={28} />
                      <span className="mt-1">Utilities</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/referrals"
                      className={`d-flex flex-column align-items-center ${
                        location.pathname === '/dashboard/referrals'
                          ? 'active'
                          : ''
                      }`}
                    >
                      <FaUsers size={28} />
                      <span className="mt-1">Referrals</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}

export default AirdropFooter;

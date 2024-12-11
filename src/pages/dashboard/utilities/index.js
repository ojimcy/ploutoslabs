import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaWifi, FaBolt } from 'react-icons/fa';
import './utilities.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

const utilities = [
  {
    name: 'Buy Airtime',
    icon: <FaMobileAlt />,
    link: '/dashboard/airtime',
    description: 'Top up your mobile airtime instantly.',
  },
  {
    name: 'Buy Data',
    icon: <FaWifi />,
    link: '/dashboard/data',
    description: 'Purchase affordable data bundles.',
  },
  {
    name: 'Pay Electricity Bill',
    icon: <FaBolt />,
    link: '/dashboard/electricity',
    description: 'Settle your electricity bills with ease.',
  },
];

function UtilitiesPage() {
  return (
    <div className="utilities-page">
      <TelegramBackButton />
      <Container>
        <h3 className="text-center my-4">Utilities</h3>
        <p className="text-center">
          Explore our range of utility services for your convenience.
        </p>
        <Row>
          {utilities.map((utility, index) => (
            <Col xs={12} md={6} lg={4} className="mb-4" key={index}>
              <Link to={utility.link} className="utility-card">
                <div className="utility-icon">{utility.icon}</div>
                <h5 className="utility-title">{utility.name}</h5>
                <p className="utility-description">{utility.description}</p>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default UtilitiesPage;

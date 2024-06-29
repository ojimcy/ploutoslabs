import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'reactstrap';
import { FaArrowUp, FaGreaterThan } from 'react-icons/fa';
import { useCurrentUser } from '../../hooks/telegram';
import { WebappContext } from '../../context/telegram';
import { boost, getUserByTelegramID } from '../../lib/server';

import logo from '../../assets/images/logo.png';
import './boost-card.css';

function BoostCard({ id, image, title, description, value }) {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);

  const changeLevel = async () => {
    try {
      await boost({ boosterId: id, telegramId: currentUser.telegramId });

      const user = await getUserByTelegramID(currentUser.telegramId);
      setUser(user);
      alert('Account boosted');
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="boost-card">
      <div className="boost-card-content">
        <Row className="boost-card-info">
          <Col xs="auto" className="boost-card-image-container">
            <img src={image} alt="" />
          </Col>
          <Col>
            <div className="boost-card-title">{title}</div>
            <div className="boost-card-description">{description}</div>
            <div className="boost-card-value">
              <img
                src={logo}
                alt=""
                className="boost-card-logo"
                width={40}
                height={40}
              />
              {value} PLTL <FaArrowUp style={{ margin: '0 0.5rem' }} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={changeLevel} className="boost-card-button">
              <FaGreaterThan />
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

BoostCard.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default BoostCard;

import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Button,  Col, Spinner } from 'reactstrap';
import { FaArrowUp } from 'react-icons/fa';
import { useCurrentUser } from '../../hooks/telegram';
import { WebappContext } from '../../context/telegram';
import { boost, getUserByTelegramID } from '../../lib/server';
import { toast } from 'react-toastify';
import './boost-card.css';

function BoostCard({ id, image, title, description, value }) {
  const currentUser = useCurrentUser();
  const { setUser } = useContext(WebappContext);
  const [loading, setLoading] = useState(false);

  const changeLevel = async () => {
    try {
      setLoading(true);
      await boost({ boosterId: id, telegramId: currentUser.telegramId });
      const user = await getUserByTelegramID(currentUser.telegramId);
      setUser(user);
      toast.success('Successfully boosted!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to boost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col xs={12} md={6} className="mb-4">
      <div className="boost-card">
        <div className="boost-card-content">
          <div className="boost-card-header">
            <div className="boost-card-icon">
              <img src={image} alt={title} />
            </div>
            <div className="boost-card-info">
              <h3 className="boost-card-title">{title}</h3>
              <p className="boost-card-description">{description}</p>
            </div>
          </div>

          <div className="boost-card-footer">
            <div className="boost-card-value">
              <span className="value-amount">{value}</span>
              <span className="value-currency">PLTL</span>
              <FaArrowUp className="boost-icon" />
            </div>
            <Button
              className="boost-button"
              onClick={changeLevel}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Boost'}
            </Button>
          </div>
        </div>
      </div>
    </Col>
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

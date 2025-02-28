/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FaTelegram } from 'react-icons/fa';
import { useCurrentUser } from '../../hooks/telegram';
import { userInChannel } from '../../lib/server';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BaseModal from '../common/modal/BaseModal';
import './modal.css';
import { useTranslation } from 'react-i18next';

const tgLink = 'https://t.me/ploutoslabannouncement';

const TelegramModal = ({ isOpen, toggle, fetchUserData }) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [buttonState, setButtonState] = useState('join');

  const handleJoinChannel = () => {
    navigate(tgLink);
    setButtonState('check');
  };

  const handleCheckChannel = async () => {
    try {
      const isInChannel = await userInChannel(currentUser.telegramId);
      if (isInChannel) {
        fetchUserData();
        toggle();
      }
    } catch (error) {
      console.error('error checking channel', error);
      toast.error(t('modal.pleaseMakeSureYouHaveJoinedTheTelegramChannel'));
      setButtonState('join');
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      className="retweet-modal"
      showHeader={false}
    >
      <Button className="close-btn" onClick={toggle} aria-label="Close">
        X
      </Button>

      <div className="logo-container">
        <FaTelegram size={45} />
      </div>

      <h2 className="modal-title">{t('modal.joinChannel')}</h2>
      <p className="modal-description">
        {t('modal.joinChannelDescription')}
      </p>

      {buttonState === 'join' ? (
        <Button
          onClick={handleJoinChannel}
          className="start-btn mt-5"
          size="lg"
          block
        >
          {t('modal.joinChannel')}
        </Button>
      ) : (
        <Button
          onClick={handleCheckChannel}
          className="start-btn mt-5"
          size="lg"
          block
        >
          {t('common.check')}
        </Button>
      )}
    </BaseModal>
  );
};

TelegramModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  fetchUserData: PropTypes.func.isRequired,
};

export default TelegramModal;

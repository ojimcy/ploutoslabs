/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import './modal.css';
import { FaTelegram } from 'react-icons/fa';
import { useCurrentUser } from '../../hooks/telegram';
import { userInChannel } from '../../lib/server';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const tgLink = 'https://t.me/ploutoslabannouncement';

const TelegramModal = ({ isOpen, toggle, fetchUserData }) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState('join'); // 'join' or 'check'

  const handleJoinChannel = () => {
    // Open the Telegram link
    navigate(tgLink);

    // Switch button to 'Check'
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
      toast.error('Please make sure you have joined the Telegram channel.');
      setButtonState('join');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="retweet-modal">
      <ModalBody className="retweet-modal-body">
        {/* Close Button */}
        <Button className="close-btn" onClick={toggle} aria-label="Close">
          X
        </Button>

        {/* Telegram Icon */}
        <div className="logo-container">
          <FaTelegram size={45} />
        </div>

        <h2 className="modal-title">Join Channel</h2>
        <p className="modal-description">
          To continue earning, please join our official Telegram channel by
          clicking the button below.
        </p>

        {/* Join/Check Button */}
        {buttonState === 'join' ? (
          <Button
            onClick={handleJoinChannel}
            className="start-btn mt-5"
            size="lg"
            block
          >
            Join Channel
          </Button>
        ) : (
          <Button
            onClick={handleCheckChannel}
            className="start-btn mt-5"
            size="lg"
            block
          >
            Check
          </Button>
        )}
      </ModalBody>
    </Modal>
  );
};

export default TelegramModal;

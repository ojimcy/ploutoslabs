import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import './modal.css';
import { FaShare } from 'react-icons/fa';
import { useWebApp } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGame } from '../../../lib/server';

function CompetitionTypeModal({ isOpen, toggle }) {
  const webapp = useWebApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleCreateGame = async () => {
    const res = await createGame();
    setCode(res.code);
  };

  // Function to copy the generated code to clipboard
  const copyCodeToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
    navigate('/game/waiting');
  };

  const share = () => {
    if (code) {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        code && code
      )}&text=${encodeURIComponent('Lets play a one-on-one battle! 🎮')}`;
      webapp.openTelegramLink(telegramUrl);
    }
    navigate('/game/waiting');
  };

  const handleRandomUser = async () => {
    await createGame();
    navigate('/game/waiting');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Select Competition Type</ModalHeader>
      <ModalBody>
        <div className="comptetition-type">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button className="friend-btn" onClick={handleCreateGame}>
              Play with Friend
            </Button>
            <Button onClick={handleRandomUser} className="random-btn">
              Random User
            </Button>
          </div>

          {code && (
            <div className="text-center my-5">
              <h6>Your Game Code: {code}</h6>

              <div
                className="code-action
              "
              >
                <Button className="share-btn" onClick={share}>
                  <FaShare /> Share Code
                </Button>
                <Button className="copy-btn" onClick={copyCodeToClipboard}>
                  Copy Code
                </Button>
              </div>
              <Button
                className="random-btn mt-4 w-100"
                onClick={() => navigate('/game/waiting')}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

CompetitionTypeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CompetitionTypeModal;

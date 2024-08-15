import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';
import './modal.css';
import { toast } from 'react-toastify';
import { FaShare } from 'react-icons/fa';
import { useWebApp } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';

function CompetitionTypeModal({ isOpen, toggle }) {
  const webapp = useWebApp();
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState('');
  const [hasCode, setHasCode] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');

  // Function to generate a 6-digit unique code
  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
  };

  // Function to copy the generated code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
  };

  const share = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      generatedCode
    )}&text=${encodeURIComponent('Lets play a one-on-one battle! 🎮')}`;
    webapp.openTelegramLink(telegramUrl);
    navigate('/game/waiting');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Select Competition Type</ModalHeader>
      <ModalBody>
        <div className="comptetition-type">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button className="friend-btn" onClick={generateCode}>
              New Friend
            </Button>
            <Button className="random-btn">Random User</Button>
          </div>

          {generatedCode && (
            <div className="text-center my-3">
              <h6>Your Game Code: {generatedCode}</h6>

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
            </div>
          )}

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={hasCode}
                onChange={(e) => setHasCode(e.target.checked)}
              />{' '}
              I already have a code
            </Label>
          </FormGroup>

          {hasCode && (
            <div className="mt-3">
              <Input
                type="text"
                placeholder="Enter code"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
              />
              <Button className="mt-2" block>
                Play
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

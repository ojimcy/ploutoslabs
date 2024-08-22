import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';
import './modal.css';
import { FaShare } from 'react-icons/fa';
import { useCurrentUser, useWebApp } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGame } from '../../../lib/server';
import { AppContext } from '../../../context/AppContext';

function CompetitionTypeModal({ isOpen, toggle }) {
  const webapp = useWebApp();
  const currentUser = useCurrentUser();

  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [entryFee, setEntryFee] = useState(2);
  const [showStartTimeInput, setShowStartTimeInput] = useState(false);
  const { mode, setMode, difficulty } = useContext(AppContext);
  const now = new Date()
  const [startTime, setStartTime] = useState(`${now.getHours()}:${now.getMinutes()}`);
  const [nickname, setNickname] = useState(currentUser.gameNickname || '');

  const handleCreateGame = async () => {
    try {
      const res = await createGame({
        gameNickname: nickname,
        type: mode,
        difficulty,
        entryFee,
        startTime,
      });
      setCode(res.code);
      console.log(res)
      if (mode == 'one-vs-one') {
        // navigate('/game/waiting');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error)
    }
  };

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
      )}&text=${encodeURIComponent('Let’s play a one-on-one battle! 🎮')}`;
      webapp.openTelegramLink(telegramUrl);
    }
    navigate('/game/waiting');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Select Competition Type</ModalHeader>
      <ModalBody>
        <div className="comptetition-type">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button
              className={`game-btn ${mode === 'one-vs-one' ? 'selected' : ''}`}
              onClick={() => {
                setMode('one-vs-one');
                setShowStartTimeInput(false);
              }}
            >
              Random User
            </Button>
            <Button
              className={`game-btn ${
                mode === 'one-vs-friend' ? 'selected' : ''
              }`}
              onClick={() => {
                setMode('one-vs-friend');
                setShowStartTimeInput(true);
              }}
            >
              Play with Friend
            </Button>
          </div>

          <div className="start-time-section my-3">
            <FormGroup>
              <Label for="exampleSelect">Entry Fee</Label>
              <Input
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                type="select"
                name="select"
                id="exampleSelect"
              >
                <option value="0.5">0.5</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Nickname :</Label>
              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter a nickname"
              />
            </FormGroup>
            {showStartTimeInput && (
              <FormGroup>
                <Label>Start Time:</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Select start time"
                />
              </FormGroup>
            )}

            <Button
              className="continue-btn mt-3 w-100"
              onClick={handleCreateGame}
            >
              Continue
            </Button>
          </div>

          {code && (
            <div className="text-center my-5">
              <h6>Your Game Code: {code}</h6>
              <div className="code-action">
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

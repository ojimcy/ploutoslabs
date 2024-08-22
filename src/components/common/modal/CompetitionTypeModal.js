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
import { useCurrentUser } from '../../../hooks/telegram';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGame } from '../../../lib/server';
import { AppContext } from '../../../context/AppContext';

function CompetitionTypeModal({ isOpen, toggle }) {
  const currentUser = useCurrentUser();

  const navigate = useNavigate();
  const [entryFee, setEntryFee] = useState(2);
  const [showStartTimeInput, setShowStartTimeInput] = useState(false);
  const { mode, setMode, difficulty, setGameCode } = useContext(AppContext);
  const now = new Date();
  const [startTime, setStartTime] = useState(
    `${now.getHours()}:${now.getMinutes()}`
  );
  const [nickname, setNickname] = useState(currentUser.gameNickname || '');

  const handleCreateGame = async () => {
    try {
      const res = await createGame({
        gameNickname: nickname,
        type: mode,
        difficulty,
        entryFee: parseFloat(entryFee),
        startTime,
      });
      setGameCode(res.game.code);
      console.log(res);
      navigate('/game/waiting');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
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
              <Label>Nickname:</Label>
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

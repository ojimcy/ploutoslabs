import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Row, Col, Button } from 'reactstrap';
import './modal.css';
import { AppContext } from '../../../context/AppContext';
import CompetitionTypeModal from './CompetitionTypeModal';
import { createGame } from '../../../lib/server';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

function GameDificultyModal({ isOpen, toggle }) {
  const { difficulty, setDifficulty, mode, setMode } = useContext(AppContext);
  const [typeModal, setTypeModal] = useState(false);

  const handleOneClicked = () => {
    setMode('one-vs-one');
    setTypeModal(!typeModal);
  };

  const handleContinue = async () => {
    if (mode === 'solo') {
      try {
        const res = await createGame({
          type: mode,
          difficulty,
        });
        location.href = `/super-catch?code=${res.game.code}`;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.error || 'Error in creating game. Please try again');
      }
    }
  };

  // const handleGroupClicked = () => {
  //   setMode('group');
  //   navigate('/game/group');
  // };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Create Game</ModalHeader>
      <ModalBody>
        <div className="game-difficulty">
          <Row className="mb-3">
            <h6 className="mt-5">Game Difficulty</h6>
            <p className="text-muted">Click to select game difficulty</p>
            <Col>
              <Button
                className={`game-btn ${
                  difficulty === 'easy' ? 'selected' : ''
                }`}
                onClick={() => setDifficulty('easy')}
                block
              >
                Easy
              </Button>
            </Col>
            <Col>
              <Button
                className={`game-btn ${
                  difficulty === 'medium' ? 'selected' : ''
                }`}
                onClick={() => setDifficulty('medium')}
                block
              >
                Medium
              </Button>
            </Col>
            <Col>
              <Button
                className={`game-btn ${
                  difficulty === 'hard' ? 'selected' : ''
                }`}
                onClick={() => setDifficulty('hard')}
                block
              >
                Hard
              </Button>
            </Col>
          </Row>

          <Row>
            <h6 className="mt-5">Game Mode</h6>
            <p className="text-muted">Click to select game mode</p>
            <Col>
              <Button
                className={`game-btn ${mode === 'solo' ? 'selected' : ''}`}
                onClick={() => setMode('solo')}
                block
              >
                Solo
              </Button>
            </Col>
            <Col>
              <Button
                className={`game-btn ${
                  mode === 'one-vs-one' ? 'selected' : ''
                }`}
                onClick={handleOneClicked}
                block
              >
                One on One
              </Button>
            </Col>
            {/* <Col>
              <Button
                className={`game-btn ${mode === 'group' ? 'selected' : ''}`}
                onClick={handleGroupClicked}
                block
              >
                Group
              </Button>
            </Col> */}
          </Row>
          <Row className="play-action mt-4 d-flex">
            <Button onClick={handleContinue} className="play-btn">
              Continue
            </Button>
          </Row>
        </div>
      </ModalBody>

      <CompetitionTypeModal isOpen={typeModal} toggle={handleOneClicked} />
    </Modal>
  );
}

GameDificultyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GameDificultyModal;

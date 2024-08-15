import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Row, Col, Button } from 'reactstrap';
import './modal.css';
import { AppContext } from '../../../context/AppContext';
import CompetitionTypeModal from './CompetitionTypeModal';
import { useNavigate } from 'react-router-dom';

function GameDificultyModal({ isOpen, toggle }) {
  const navigate = useNavigate();
  const { difficulty, setDifficulty, mode, setMode } = useContext(AppContext);
  const [typeModal, setTypeModal] = useState(false);

  const handleOneClicked = () => {
    setMode('oneonone');
    setTypeModal(!typeModal);
  };

  const handleGroupClicked = () => {
    setMode('group');
    navigate('/game/group');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Game Difficulty</ModalHeader>
      <ModalBody>
        <div className="game-difficulty">
          <Row className="mb-3">
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

          <h2 className="mt-5">Game Mode</h2>
          <Row>
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
                className={`game-btn ${mode === 'oneonone' ? 'selected' : ''}`}
                onClick={handleOneClicked}
                block
              >
                One on One
              </Button>
            </Col>
            <Col>
              <Button
                className={`game-btn ${mode === 'group' ? 'selected' : ''}`}
                onClick={handleGroupClicked}
                block
              >
                Group
              </Button>
            </Col>
          </Row>
        </div>

        <Button
          className="play-btn"
          block
          onClick={() => {
            console.log(
              `Playing with ${difficulty} difficulty in ${mode} mode.`
            );
            toggle();
          }}
        >
          Continue
        </Button>
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

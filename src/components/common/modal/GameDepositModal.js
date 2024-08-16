import React  from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './modal.css';
import { useNavigate } from 'react-router-dom';

function GameDepositModal({ isOpen, toggle }) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="main-modal" fade={false}>
      <ModalHeader toggle={toggle}>Create Game</ModalHeader>
      <ModalBody>
        <div className='game-deposit'>

        </div>
      </ModalBody>

    </Modal>
  );
}

GameDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GameDepositModal;

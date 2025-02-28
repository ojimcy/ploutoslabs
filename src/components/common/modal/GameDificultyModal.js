import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import BaseModal from '../modal/BaseModal';
import './modal.css';
import { AppContext } from '../../../context/AppContext';
import CompetitionTypeModal from './CompetitionTypeModal';
import { createGame } from '../../../lib/server';
import { toast } from 'react-hot-toast';
import { useCurrentUser } from '../../../hooks/telegram';
import { openSuperCatchGameConsole } from '../../../lib/utils';
import PaymentModal from './PaymentModal';
import { useTranslation } from 'react-i18next';
function GameDificultyModal({ isOpen, toggle }) {
  const { t } = useTranslation();
  const { difficulty, setDifficulty, mode, setMode } = useContext(AppContext);
  const currenUser = useCurrentUser();
  const [typeModal, setTypeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleOneClicked = () => {
    setMode('one-vs-one');
    setTypeModal(!typeModal);
  };

  const isToday = (date) => {
    const today = new Date();
    const gameDate = new Date(date);

    return (
      today.getFullYear() === gameDate.getFullYear() &&
      today.getMonth() === gameDate.getMonth() &&
      today.getDate() === gameDate.getDate()
    );
  };

  const handleContinue = async () => {
    if (mode === 'solo') {
      if (isToday(currenUser?.lastFreeGameTime)) {
        setShowPaymentModal(true);
      } else {
        try {
          const res = await createGame({
            type: mode,
            difficulty,
          });
          openSuperCatchGameConsole(res.game.code, currenUser.id);
        } catch (error) {
          console.log(error);
          toast.error(
            error.response?.data?.error ||
              'Error in creating game. Please try again'
          );
        }
      }
    }
  };

  const handlePaymentConfirm = async () => {
    setShowPaymentModal(false);
    try {
      const res = await createGame({
        type: mode,
        difficulty,
      });
      openSuperCatchGameConsole(res.game.code, currenUser.id);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.error ||
          'Error in creating game. Please try again'
      );
    }
  };

  const footerContent = (
    <Row className="play-action mt-4">
      <Button onClick={handleContinue} className="play-btn w-100">
        Continue
      </Button>
    </Row>
  );

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggle}
        title={t('modal.createGame')}
        className="main-modal"
        footerContent={footerContent}
      >
        <div className="game-difficulty">
          <Row className="mb-3">
            <h6 className="mt-5">{t('modal.gameDifficulty')}</h6>
            <p className="text-muted">{t('modal.clickToSelect')}</p>
            <Col>
              <Button
                className={`game-btn ${
                  difficulty === 'easy' ? 'selected' : ''
                }`}
                onClick={() => setDifficulty('easy')}
                block
              >
                {t('modal.easy')}
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
                {t('modal.medium')}
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
                {t('modal.hard')}
              </Button>
            </Col>
          </Row>

          <Row>
            <h6 className="mt-5">{t('modal.gameMode')}</h6>
            <p className="text-muted">{t('modal.clickToSelect')}</p>
            <Col>
              <Button
                className={`game-btn ${mode === 'solo' ? 'selected' : ''}`}
                onClick={() => setMode('solo')}
                block
              >
                {t('modal.solo')}
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
                {t('modal.oneVsOne')}
              </Button>
            </Col>
          </Row>
        </div>
      </BaseModal>

      <CompetitionTypeModal isOpen={typeModal} toggle={handleOneClicked} />
      <PaymentModal
        isOpen={showPaymentModal}
        toggle={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />
    </>
  );
}

GameDificultyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default GameDificultyModal;

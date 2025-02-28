import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import './game.css';
import { Link } from 'react-router-dom';

import crash from '../../assets/images/crash-game.png';
import superCatch from '../../assets/game/superman.png';
import pltlLogo from '../../assets/images/logo.png';
import { FaCaretDown, FaWallet } from 'react-icons/fa';
import { submitGameWithdrawal } from '../../lib/server';
import { toast } from 'react-hot-toast';

import GameDepositModal from '../../components/common/modal/GameDepositModal';
import WithdrawModal from '../../components/common/modal/WithdrawalModal';
import { useCurrentUser } from '../../hooks/telegram';
import { useTranslation } from 'react-i18next';

const Games = () => {
  const currentUser = useCurrentUser();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDepositModal = () => {
    setDepositModal(!depositModal);
  };

  const toggleWithdrawalModal = () => {
    setWithdrawalModal(!withdrawalModal);
  };

  const handleWithdrawal = async (amount, address) => {
    try {
      await submitGameWithdrawal({
        amount: parseFloat(amount),
        destinationAddress: address,
      });
      toast.success('Request submitted');
    } catch (err) {
      console.log(err);
      toast.error('Error in placing request');
    }
  };

  const games = [
    {
      title: t('game.superCatch'),
      description: t('game.superCatchDescription'),
      image: superCatch,
      link: '/game/super-catch',
    },
    {
      title: t('game.crash'),
      description: t('game.crashDescription'),
      image: crash,
    },
  ];

  return (
    <Container>
      <div className="game-header">
        <Link to="/" className="main-title">
          <img src={pltlLogo} alt="logo" />
        </Link>

        <div className="wallet-dropdown">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle className="wallet-dropdown-toggle">
              <FaWallet className="wallet-icon" />
              <FaCaretDown />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>
                {t('common.balance')}: ${currentUser?.gameWalletBalance}
              </DropdownItem>
              <DropdownItem onClick={toggleDepositModal}>
                {t('common.deposit')}
              </DropdownItem>
              <DropdownItem onClick={toggleWithdrawalModal}>
                {t('common.withdraw')}
              </DropdownItem>
              <DropdownItem>
                <Link to="/dashboard/game-leaderboard">
                  {t('footer.leaderboard')}
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {games.map((game, index) => (
        <Row key={index} className="my-4">
          <Col md="12">
            <Link
              to={game.link ? game.link : `/game/coming-soon`}
              className="games-card-link"
            >
              <div className="games-card">
                <div className="d-flex align-items-center">
                  <div className="game-details">
                    <h4 className="game-title">{game.title}</h4>
                    <p className="game-description">{game.description}</p>
                  </div>
                  <div className="game-image-wrapper">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="game-image"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      ))}

      <GameDepositModal isOpen={depositModal} toggle={toggleDepositModal} />
      <WithdrawModal
        isOpen={withdrawalModal}
        toggle={toggleWithdrawalModal}
        onSubmit={handleWithdrawal}
      />
    </Container>
  );
};

export default Games;

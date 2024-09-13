import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Input,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import './presale.css';
import { FaCheck, FaEthereum, FaPlus } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';

import logo from '../../assets/images/logo.png';
import PresaleTabs from '../../components/wallet/PresaleTabs';
import TelegramBackButton from '../../components/common/TelegramBackButton';
import { useTelegramUser } from '../../hooks/telegram';
import { getUserByTelegramID, getWallets } from '../../lib/server';
import { formatAddress } from '../../lib/utils';
import { Link } from 'react-router-dom';

function TokenPresale() {
  const { selectedWallet, setSelectedWallet } = useContext(AppContext);
  const [wallets, setWallets] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const telegramUser = useTelegramUser();

  const [ethBalance, setEthBalance] = useState(0);
  const [ethereumAmount, setEthereumAmount] = useState(0);
  const [ploutosAmount, setPloutosAmount] = useState(0);
  const [presaleCompleted, setPresaleCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = 0.08;

  const presaleEndTime = new Date('2024-09-30T23:59:59Z').getTime();
  const walletAddress = selectedWallet?.address;

  useEffect(() => {
    setEthBalance(1.234);
    // Countdown timer setup
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = presaleEndTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setPresaleCompleted(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [presaleEndTime]);

  useEffect(() => {
    if (!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id);
      const wals = await getWallets(user.id);
      console.log('wals', wals);
      if (!wals || wals.length === 0) return;
      setSelectedWallet(wals[0]);
      setWallets(wals);
    };

    fn();
  }, [telegramUser]);

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleMaxClick = () => {
    setEthereumAmount(ethBalance);
    calculateReceived(ethBalance);
  };

  const calculateReceived = (eth) => {
    setPloutosAmount((eth / currentPrice).toFixed(2));
  };

  const calculateSpent = (pltl) => {
    setPloutosAmount((pltl * currentPrice).toFixed(2));
  };

  const handleEthereumAmountChanged = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setEthereumAmount(value);
    calculateReceived(value);
  };

  const handlePloutosAmountChanged = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPloutosAmount(value);
    calculateSpent(value);
  };

  const handleBuyNow = () => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.error('Error buying presale: ', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log('wallets', wallets);

  return (
    <div className="presale-page">
      <TelegramBackButton />
      <Container>
        <div className="presale-card d-flex align-items-center flex-column w-100">
          <div className="wallet-area d-flex align-items-center flex-column w-100">
            <Row className="justify-content-center w-100">
              <Dropdown
                className="text-center"
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
              >
                <DropdownToggle caret className="connect-wallet">
                  <FaEthereum />
                  {selectedWallet ? walletAddress : 'Select Wallet'}
                </DropdownToggle>
                <DropdownMenu>
                  {wallets ? (
                    wallets.map((wallet) => (
                      <DropdownItem
                        key={wallet.id}
                        onClick={() => handleSelectWallet(wallet)}
                      >
                        <div className="info-main">
                          <div className="wallet-title">{wallet.name}</div>
                          <div className="wallet-balance">
                            {formatAddress(wallet.address)}
                          </div>
                          <div className="wallet-balance">
                            {wallet.networth}
                          </div>
                        </div>
                        {selectedWallet && selectedWallet.id === wallet.id && (
                          <div className="selected-check">
                            <FaCheck />
                          </div>
                        )}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem>
                      <Link to="/dashboard/create" className="links">
                        <div className="wallet-card-content">
                          <div className="wallet-icon">
                            <FaPlus />
                          </div>
                          <div className="wallet-info">
                            <div className="wallet-title">
                              No wallet found, add new
                            </div>
                          </div>
                        </div>
                      </Link>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </Row>

            <Row className="timer-row mt-4 w-75">
              {!presaleCompleted ? (
                <>
                  <h3 className="text-center">Presale ends in</h3>
                  <div className="timer d-flex flex-row justify-content-between ">
                    <span>{timeLeft.days.toString().padStart(2, '0')}</span>:
                    <span>{timeLeft.hours.toString().padStart(2, '0')}</span>:
                    <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>:
                    <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  </div>

                  <div className="timer-labels mt-1">
                    <span>DAY</span>
                    <span className="ml-1">HOUR</span>
                    <span>MINUTE</span>
                    <span>SECOND</span>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="alert-heading">Presale Completed</h4>
                  <p>
                    The presale has successfully ended. Thank you for
                    participating!
                  </p>
                </>
              )}
            </Row>
          </div>

          <Row className="amount-input-row">
            <Col>
              <Form className="presale-form mt-3">
                <FormGroup>
                  <Label for="amount">Pay</Label>
                  <span className="max-value mt-1" onClick={handleMaxClick}>
                    Max: {ethBalance}
                  </span>
                  <Input
                    type="number"
                    name="ethereumAmount"
                    id="ethereumAmount"
                    placeholder="0.01"
                    value={ethereumAmount}
                    onChange={handleEthereumAmountChanged}
                  />
                  <span className="input-token-symbol">
                    <FaEthereum />
                  </span>
                </FormGroup>

                <FormGroup>
                  <Label for="ploutosAmount"> Receive</Label>
                  <Input
                    type="number"
                    name="ploutosAmount"
                    id="ploutosAmount"
                    placeholder="ploutosAmount"
                    value={ploutosAmount}
                    onChange={handlePloutosAmountChanged}
                  />
                  <span className="input-token-symbol">
                    <img src={logo} alt="" width={20} />
                  </span>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row className="buy-now-row">
            <Button
              color="primary"
              size="lg"
              onClick={handleBuyNow}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          </Row>
        </div>

        <PresaleTabs />
      </Container>
    </div>
  );
}

export default TokenPresale;

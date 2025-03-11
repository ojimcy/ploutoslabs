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
import { useCurrentUser } from '../../hooks/telegram';
import {
  getUplineWallets,
  getUserByTelegramID,
  getWallets,
  getDownlinePurchases,
} from '../../lib/server';
import { decryptPrivateKey, formatAddress } from '../../lib/utils';
import { Link } from 'react-router-dom';
import TransactionPin from '../../components/auth/TransactionPin';
import { privateKeyToAccount } from 'viem/accounts';
import {
  checksumAddress,
  createPublicClient,
  createWalletClient,
  formatEther,
  getContract,
  http,
  isAddress,
  parseEther,
} from 'viem';
import { base } from 'viem/chains';
import {
  DEFAULT_REF_ADDRESS,
  NODE_URL,
  PRESALE_CONTRACT_ADDRESS,
} from '../../lib/const';
import { presaleAbi } from '../../lib/presaleAbi';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function TokenPresale() {
  const { t } = useTranslation();
  const { selectedWallet, setSelectedWallet } = useContext(AppContext);
  const [wallets, setWallets] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const telegramId = localStorage.getItem('TELEGRAM_ID');
  const currentUser = useCurrentUser();
  const [histories, setHistories] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [downlinePurchases, setDownlinePurchases] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

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

  const presaleEndTime = new Date('2025-03-31T23:59:59Z').getTime();

  useEffect(() => {
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
    if (!telegramId) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);
      const wals = await getWallets(user.id);
      if (!wals || wals.length === 0) return;
      setWallets(wals);
      const wal = selectedWallet || wals[0];
      setSelectedWallet(wal);
    };

    fn();
  }, [telegramId]);

  useEffect(() => {
    refreshHistory();
  }, [selectedWallet]);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(NODE_URL),
      });
      const contract = getContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: presaleAbi,
        // 1a. Insert a single client
        client: publicClient,
        // 1b. Or public and/or wallet clients
      });
      const rate = await contract.read.rate();
      console.log('rate', parseInt(rate));
      
      setCurrentPrice(parseInt(rate) / 1e9);
    };
    fetchCurrentPrice();
  }, []);

  const refreshHistory = async () => {
    if (!selectedWallet) return;
    setIsLoading(true);

    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(NODE_URL),
      });

      const bal = await publicClient.getBalance({
        address: selectedWallet.address,
      });
      setEthBalance(parseFloat(formatEther(bal)).toFixed(4));

      const contract = getContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: presaleAbi,
        // 1a. Insert a single client
        client: publicClient,
        // 1b. Or public and/or wallet clients
      });

      const result = await contract.read.getPurchaseHistory([
        selectedWallet.address,
      ]);
      setHistories(result);

      const refResult = await contract.read.getReferralHistory([
        selectedWallet.address,
      ]);
      setReferrals(refResult);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleMaxClick = () => {
    const max = parseFloat(ethBalance) - 0.000004;
    setEthereumAmount(max);
    calculateReceived(max);
  };

  const calculateReceived = (eth) => {
    setPloutosAmount((eth * currentPrice).toFixed(2));
  };

  const calculateSpent = (pltl) => {
    setPloutosAmount((pltl / currentPrice).toFixed(2));
  };

  const handleEthereumAmountChanged = (e) => {
    setEthereumAmount(e.target.value);
    calculateReceived(parseFloat(e.target.value) || 0);
  };

  const handlePloutosAmountChanged = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPloutosAmount(e.target.value);
    calculateSpent(value);
  };

  const handleBuyNow = () => {
    setShowPinPad(true);
  };

  const validatePin = async (pin) => {
    setShowPinPad(false);
    setIsLoading(true);

    let decryptedPrivateKey;
    try {
      decryptedPrivateKey = await decryptPrivateKey(
        selectedWallet.privateKey,
        pin,
        selectedWallet.iv,
        selectedWallet.tag
      );
    } catch (error) {
      console.log(error);
      toast.error(t('common.invalidPassword'));
      setIsLoading(false);
      return;
    }

    try {
      const account = privateKeyToAccount(`0x${decryptedPrivateKey}`);

      const walletClient = createWalletClient({
        account,
        chain: base,
        transport: http(NODE_URL),
      });

      const uplineWallets = await getUplineWallets(currentUser.id);

      const amount = parseEther(ethereumAmount.toString());

      const upline1 = isAddress(uplineWallets.upline1, { strict: false })
        ? checksumAddress(uplineWallets.upline1)
        : DEFAULT_REF_ADDRESS;
      const upline2 = isAddress(uplineWallets.upline2, { strict: false })
        ? checksumAddress(uplineWallets.upline2)
        : DEFAULT_REF_ADDRESS;

      await walletClient.writeContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: presaleAbi,
        functionName: 'buyPresale',
        args: [upline1, upline2],
        value: amount,
        // gasPrice: parseGwei('0.009803727'),
      });

      setEthereumAmount(0);
      setPloutosAmount(0);

      await refreshHistory();

      toast.success(t('common.transactionSubmitted'));
    } catch (err) {
      toast.error(err.shortMessage || t('common.somethingWentWrong'));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDownlinePurchases = async () => {
      const purchases = await getDownlinePurchases(selectedWallet.address);
      setDownlinePurchases(purchases);
    };
    fetchDownlinePurchases();
  }, [selectedWallet]);

  console.log('downlinePurchases', downlinePurchases);

  // Mock data for testing
  const mockDownlinePurchases = [
    {
    buyer: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '1000000000000000000', // 1 ETH
    amountUSD: 2500.0,
    tokenAmount: '138000000000', // 138 PLTL
    date: Math.floor(Date.now() / 1000),
    directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
    secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
  },
  {
    buyer: '0x2345678901abcdef1234567890abcdef12345678',
    amount: '500000000000000000', // 0.5 ETH
    amountUSD: 1250.0,
    tokenAmount: '69000000000', // 69 PLTL
    date: Math.floor(Date.now() / 1000) - 86400,
    directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
    secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
  },
  {
    buyer: '0x3456789012abcdef1234567890abcdef12345678',
    amount: '2000000000000000000', // 2 ETH
    amountUSD: 5000.0,
    tokenAmount: '276000000000', // 276 PLTL
    date: Math.floor(Date.now() / 1000) - 172800,
    directReferrer: '0x5432109876abcdef1234567890abcdef12345678',
    secondReferrer: '0x9876543210abcdef1234567890abcdef12345678',
  },
  {
  buyer: '0x1234567890abcdef1234567890abcdef12345678',
  amount: '1000000000000000000', // 1 ETH
  amountUSD: 2500.0,
  tokenAmount: '138000000000', // 138 PLTL
  date: Math.floor(Date.now() / 1000),
  directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
  secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
  buyer: '0x2345678901abcdef1234567890abcdef12345678',
  amount: '500000000000000000', // 0.5 ETH
  amountUSD: 1250.0,
  tokenAmount: '69000000000', // 69 PLTL
  date: Math.floor(Date.now() / 1000) - 86400,
  directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
  secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
  buyer: '0x3456789012abcdef1234567890abcdef12345678',
  amount: '2000000000000000000', // 2 ETH
  amountUSD: 5000.0,
  tokenAmount: '276000000000', // 276 PLTL
  date: Math.floor(Date.now() / 1000) - 172800,
  directReferrer: '0x5432109876abcdef1234567890abcdef12345678',
  secondReferrer: '0x9876543210abcdef1234567890abcdef12345678',
},
{
buyer: '0x1234567890abcdef1234567890abcdef12345678',
amount: '1000000000000000000', // 1 ETH
amountUSD: 2500.0,
tokenAmount: '138000000000', // 138 PLTL
date: Math.floor(Date.now() / 1000),
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x2345678901abcdef1234567890abcdef12345678',
amount: '500000000000000000', // 0.5 ETH
amountUSD: 1250.0,
tokenAmount: '69000000000', // 69 PLTL
date: Math.floor(Date.now() / 1000) - 86400,
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x3456789012abcdef1234567890abcdef12345678',
amount: '2000000000000000000', // 2 ETH
amountUSD: 5000.0,
tokenAmount: '276000000000', // 276 PLTL
date: Math.floor(Date.now() / 1000) - 172800,
directReferrer: '0x5432109876abcdef1234567890abcdef12345678',
secondReferrer: '0x9876543210abcdef1234567890abcdef12345678',
},
{
buyer: '0x1234567890abcdef1234567890abcdef12345678',
amount: '1000000000000000000', // 1 ETH
amountUSD: 2500.0,
tokenAmount: '138000000000', // 138 PLTL
date: Math.floor(Date.now() / 1000),
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x2345678901abcdef1234567890abcdef12345678',
amount: '500000000000000000', // 0.5 ETH
amountUSD: 1250.0,
tokenAmount: '69000000000', // 69 PLTL
date: Math.floor(Date.now() / 1000) - 86400,
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x3456789012abcdef1234567890abcdef12345678',
amount: '2000000000000000000', // 2 ETH
amountUSD: 5000.0,
tokenAmount: '276000000000', // 276 PLTL
date: Math.floor(Date.now() / 1000) - 172800,
directReferrer: '0x5432109876abcdef1234567890abcdef12345678',
secondReferrer: '0x9876543210abcdef1234567890abcdef12345678',
},
{
buyer: '0x1234567890abcdef1234567890abcdef12345678',
amount: '1000000000000000000', // 1 ETH
amountUSD: 2500.0,
tokenAmount: '138000000000', // 138 PLTL
date: Math.floor(Date.now() / 1000),
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x2345678901abcdef1234567890abcdef12345678',
amount: '500000000000000000', // 0.5 ETH
amountUSD: 1250.0,
tokenAmount: '69000000000', // 69 PLTL
date: Math.floor(Date.now() / 1000) - 86400,
directReferrer: '0x9876543210abcdef1234567890abcdef12345678',
secondReferrer: '0x5432109876abcdef1234567890abcdef12345678',
},
{
buyer: '0x3456789012abcdef1234567890abcdef12345678',
amount: '2000000000000000000', // 2 ETH
amountUSD: 5000.0,
tokenAmount: '276000000000', // 276 PLTL
date: Math.floor(Date.now() / 1000) - 172800,
directReferrer: '0x5432109876abcdef1234567890abcdef12345678',
secondReferrer: '0x9876543210abcdef1234567890abcdef12345678',
},
];


  return (
    <div className="presale-page">
      {!showPinPad && (
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
                    {selectedWallet
                      ? formatAddress(selectedWallet.address)
                      : t('common.selectWallet')}
                  </DropdownToggle>
                  <DropdownMenu>
                    {wallets ? (
                      wallets.map((wallet) => (
                        <DropdownItem
                          key={wallet.id}
                          onClick={() => handleSelectWallet(wallet)}
                        >
                          <div className="info-main">
                            <div className="wallet-title">{wallet.label}</div>
                            <div className="wallet-balance">
                              {formatAddress(wallet.address)}
                            </div>
                          </div>
                          {selectedWallet &&
                            selectedWallet.id === wallet.id && (
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
                                {t('common.noWalletFound')}
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
                    <h3 className="text-center">{t('wallet.presaleEndsIn')}</h3>
                    <div className="timer d-flex flex-row justify-content-between ">
                      <span>{timeLeft.days.toString().padStart(2, '0')}</span>:
                      <span>{timeLeft.hours.toString().padStart(2, '0')}</span>:
                      <span>
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                      :
                      <span>
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="timer-labels mt-1">
                      <span>{t('wallet.day')}</span>
                      <span className="ml-1">{t('wallet.hour')}</span>
                      <span>{t('wallet.minute')}</span>
                      <span>{t('wallet.second')}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="alert-heading">
                      {t('wallet.presaleCompleted')}
                    </h4>
                    <p>{t('wallet.presaleCompletedMessage')}</p>
                  </>
                )}
              </Row>
            </div>

            <Row className="amount-input-row w-75">
              <Col>
                <Form className="presale-form mt-3">
                  <FormGroup>
                    <Label for="amount">{t('common.pay')}</Label>
                    <span className="max-value mt-1" onClick={handleMaxClick}>
                      {t('common.max')}: {ethBalance}
                    </span>
                    <Input
                      type="text"
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
                    <Label for="ploutosAmount">{t('common.receive')}</Label>
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
                {isLoading ? t('common.processing') : t('common.buyNow')}
              </Button>
            </Row>
          </div>

          <PresaleTabs
            purchaseHistory={histories}
            loading={isLoading}
            referrals={referrals}
            downlinePurchases={mockDownlinePurchases}
          />
        </Container>
      )}

      {showPinPad && (
        <TransactionPin
          title={'Enter your 6 digit pin'}
          onSubmit={validatePin}
        />
      )}
    </div>
  );
}

export default TokenPresale;

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
import { Link, useNavigate } from 'react-router-dom';
import {
  FaMobileAlt,
  FaWifi,
  FaBolt,
  FaTv,
  FaCaretDown,
  FaBitcoin,
  FaWallet,
} from 'react-icons/fa';
import './utilities.css';
import { useCurrentUser } from '../../../hooks/telegram';
import GameDepositModal from '../../../components/common/modal/GameDepositModal';
import { useTranslation } from 'react-i18next';

function UtilitiesPage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDepositModal = () => {
    setDepositModal(!depositModal);
  };

  const handleLinkClicked = (utility) => {
    if (utility.external) {
      window.open(utility.link, '_blank');
    } else {
      navigate(utility.link);
    }
  };

  const utilities = [
    {
      name: t('utilities.buyAirtime'),
      icon: <FaMobileAlt />,
      link: '/dashboard/airtime',
      description: t('utilities.buyAirtimeDescription'),
    },
    {
      name: t('utilities.buyData'),
      icon: <FaWifi />,
      link: '/dashboard/data',
      description: t('utilities.buyDataDescription'),
    },
    {
      name: t('utilities.payElectricityBill'),
      icon: <FaBolt />,
      link: '/dashboard/electricity',
      description: t('utilities.payElectricityBillDescription'),
    },
    {
      name: t('utilities.tvSubscription'),
      icon: <FaTv />,
      link: '/dashboard/tv-subscription',
      description: t('utilities.tvSubscriptionDescription'),
    },
    {
      name: t('utilities.internationalBillPayments'),
      icon: <FaBitcoin />,
      link: 'https://widget.zypto.com/8d8kvdb7x9bgtwz65me1bk8tajn2ehuvm8oh333gvp2t9brpzhgtn337rdtz?collapse',
      description: t('utilities.internationalBillPaymentsDescription'),
      external: true,
    },
  ];

  return (
    <div className="utilities-page">
      <Container>
        <div className="wallet-dropdown d-flex justify-content-end">
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
              <DropdownItem>
                <Link to="/dashboard/transactions">
                  {t('portfolio.transactions')}
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <h3 className="text-center my-4">{t('utilities.title')}</h3>
        <p className="text-center">{t('utilities.subtitle')}</p>
        <Row>
          {utilities.map((utility, index) => (
            <Col xs={12} md={6} lg={4} className="mb-4" key={index}>
              <div
                onClick={() => handleLinkClicked(utility)}
                className="utility-card"
                role="button"
                tabIndex={0}
              >
                <div className="utility-icon">{utility.icon}</div>
                <h5 className="utility-title">{utility.name}</h5>
                <p className="utility-description">{utility.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <GameDepositModal isOpen={depositModal} toggle={toggleDepositModal} />
    </div>
  );
}

export default UtilitiesPage;

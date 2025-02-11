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
} from 'react-icons/fa';
import './utilities.css';
import { useCurrentUser } from '../../../hooks/telegram';
import GameDepositModal from '../../../components/common/modal/GameDepositModal';

const utilities = [
  {
    name: 'Buy Airtime',
    icon: <FaMobileAlt />,
    link: '/dashboard/airtime',
    description: 'Top up your mobile airtime instantly.',
  },
  {
    name: 'Buy Data',
    icon: <FaWifi />,
    link: '/dashboard/data',
    description: 'Purchase affordable data bundles.',
  },
  {
    name: 'Pay Electricity Bill',
    icon: <FaBolt />,
    link: '/dashboard/electricity',
    description: 'Settle your electricity bills with ease.',
  },
  {
    name: 'TV Subscription',
    icon: <FaTv />,
    link: '/dashboard/tv-subscription',
    description: 'Subscribe to your favorite TV services.',
  },
  {
    name: 'International Bill Payments',
    icon: <FaBitcoin />,
    link: 'https://widget.zypto.com/8d8kvdb7x9bgtwz65me1bk8tajn2ehuvm8oh333gvp2t9brpzhgtn337rdtz?collapse',
    description: 'Pay your international bills with ease.',
  },
];

function UtilitiesPage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [depositModal, setDepositModal] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDepositModal = () => {
    setDepositModal(!depositModal);
  };

  const handleLinkClicked = (u) => {
    navigate(u.link);
  };

  return (
    <div className="utilities-page">
      <Container>
        <div className="wallet-dropdown d-flex justify-content-end">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} end>
            <DropdownToggle header className="wallet-dropdown-toggle">
              Wallet: ${currentUser?.gameWalletBalance}
              <FaCaretDown />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header>
                Balance: ${currentUser?.gameWalletBalance}
              </DropdownItem>
              <DropdownItem onClick={toggleDepositModal}>Deposit</DropdownItem>
              <DropdownItem>
                <Link to="/dashboard/transactions">Transactions</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <h3 className="text-center my-4">Utilities</h3>
        <p className="text-center">
          Explore our range of utility services for your convenience.
        </p>
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

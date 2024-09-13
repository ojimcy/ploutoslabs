import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Col,
} from 'reactstrap';
import classnames from 'classnames';
import './portfolio.css';
import { Separator } from '../common/Seperator';
import { useCurrentUser, useWebApp } from '../../hooks/telegram';
import { toast } from 'react-toastify';
import { FaCopy, FaEthereum, FaTelegramPlane } from 'react-icons/fa';

const referrals = [
  {
    id: 1,
    first_name: 'Emmanuel',
    last_name: 'Ojima-ojo',
    username: 'emmyojay',
    reward: 20,
  },
];

const PresaleTabs = () => {
  const webapp = useWebApp();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState('1');

  const referralLink = `https://t.me/ploutos_labs_bot/app?startapp=${currentUser?.telegramId}`;

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    await navigator.clipboard.writeText(text);
  }

  const copyReferralLink = async () => {
    try {
      await copyTextToClipboard(referralLink);
      toast.success('Referral link copied!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (error) {
      toast.error('Failed to copy link', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const handleShare = () => {
    const inviteMessage = `🚀 Join the Ploutos Labs Presale and secure your place in the future of decentralized finance! 💰 \n\nTap here to get started: ${referralLink}`;

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=${encodeURIComponent(inviteMessage)}`;

    webapp.openTelegramLink(telegramUrl);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="portfolio">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1');
            }}
          >
            Refferals
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2');
            }}
          >
            History
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row className="justify-content-center align-items-center text-center">
            <div className="mt-4">
              <h4>Referrals</h4>
              <p>
                Share your referral link and earn 10% of every purchase your
                referral makes. Use the buttons below to share or copy your
                referral link.
              </p>
              <Separator />
              <Row className="referrals-grid">
                <Col className="referral-link-container">
                  <div className="referral-link-text mt-3">Referral Link</div>
                  <div>
                    {currentUser
                      ? `https://t.me/ploutos_labs_bot/app?startapp=${currentUser.telegramId}`
                      : ''}
                  </div>
                  <div className="d-flex justify-content-between my-3">
                    <Button className="share-btn" onClick={handleShare}>
                      <FaTelegramPlane /> Share Link
                    </Button>
                    <Button
                      onClick={copyReferralLink}
                      className="share-btn copy-button"
                    >
                      <FaCopy /> Copy Link
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    Total Earnings:{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      <FaEthereum />
                      0.058
                    </span>
                  </span>
                  {referrals.map((r) => (
                    <React.Fragment key={r.id}>
                      <div className="referral-card d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle">
                            <span>{`${r.first_name[0]}${r.last_name[0]}`}</span>
                          </div>
                          <span className="referral-username ml-2">
                            {r.username}
                          </span>
                        </div>
                        <span className="referral-balance">+{r.reward}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </Col>
              </Row>
            </div>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row className="justify-content-center align-items-center text-center">
            <div className="mt-4">
              <h4>Presale History</h4>
              <p>No record found</p>
            </div>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

PresaleTabs.propTypes = {};

export default PresaleTabs;

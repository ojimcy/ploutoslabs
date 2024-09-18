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
  Spinner,
} from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './portfolio.css';
import { Separator } from '../common/Seperator';
import { useCurrentUser, useWebApp } from '../../hooks/telegram';
import { toast } from 'react-toastify';
import { FaCopy, FaEthereum, FaTelegramPlane } from 'react-icons/fa';
import { formatEther } from 'viem';
import { formatAddress } from '../../lib/utils';

const PresaleTabs = ({ purchaseHistory, referrals, loading }) => {
  const webapp = useWebApp();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState('1');

  const referralLink = `https://t.me/ploutos_labs_bot/app?startapp=${currentUser?.telegramId}`;

  const totalRefEarningn = () => {
    let total = 0;
    for(let i = 0; i < referrals.length; i++) {
      total += parseFloat(formatEther(referrals[i].referralAmount))
    }
    return total
  }

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
                    <Button
                      className="share-btn"
                      onClick={handleShare}
                      aria-label="Share referal link"
                    >
                      <FaTelegramPlane /> Share Link
                    </Button>
                    <Button
                      onClick={copyReferralLink}
                      className="share-btn copy-button "
                      aria-label="Copy referral link"
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
                      {totalRefEarningn()}
                    </span>
                  </span>
                  {referrals.map((r) => (
                    <React.Fragment key={r.date}>
                      <div className="referral-card d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle">
                            <span>{formatAddress(r.buyer)}</span>
                          </div>
                          {/* <span className="referral-username ml-2">
                            {r.username}
                          </span> */}
                        </div>
                        <span className="referral-balance">+{formatEther(r.referralAmount)}</span>
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
              {purchaseHistory.length === 0 ? (
                <p>No record found</p>
              ) : (
                <div className="purchase-history-list">
                  {loading ? (
                    <Spinner />
                  ) : (
                    purchaseHistory.map((purchase) => (
                      <div key={purchase.id} className="purchase-history-item">
                        <div className="history-date">
                          Date: {new Date(parseInt(purchase.date) || 2).toLocaleDateString()}
                        </div>
                        <div className="history-eth">
                          ETH: {formatEther(purchase.ethSpent)}
                        </div>
                        <div className="history-plt">
                          PLTL: {formatEther(purchase.tokenAmount, 9)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

PresaleTabs.propTypes = {
  purchaseHistory: PropTypes.array,
  referrals: PropTypes.array,
  loading: PropTypes.bool
};

export default PresaleTabs;

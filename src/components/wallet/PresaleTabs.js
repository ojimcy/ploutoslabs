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
import { useCurrentUser, useReferralLink } from '../../hooks/telegram';
import { toast } from 'react-hot-toast';
import { FaCopy, FaEthereum, FaTelegramPlane, FaUsers } from 'react-icons/fa';
import { formatEther, formatUnits } from 'viem';
import { formatAddress } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PresaleTabs = ({
  purchaseHistory,
  referrals,
  downlinePurchases,
  loading,
}) => {
  const currentUser = useCurrentUser();
  const referralLink = useReferralLink(currentUser);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [showAllDownlines, setShowAllDownlines] = useState(false);
  const { t } = useTranslation();
  const ITEMS_PER_PAGE = 10;

  const totalRefEarningn = () => {
    let total = 0;
    for (let i = 0; i < referrals.length; i++) {
      total += parseFloat(formatEther(referrals[i].referralAmount));
    }
    return total;
  };

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
      toast.success(t('wallet.referralLinkCopied'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (error) {
      toast.error(t('wallet.failedToCopyReferralLink'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const handleShare = () => {
    const inviteMessage = `${t('wallet.inviteMessage1')} \n\n${t(
      'wallet.inviteMessage2'
    )} { referralLink }`;

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=${encodeURIComponent(inviteMessage)}`;

    navigate(telegramUrl);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const refEarning = (purchase) => {
    const tokenAmount = parseFloat(formatUnits(purchase.tokenAmount, 9));
    if (purchase.directReferrer === currentUser?.address) {
      return tokenAmount * 0.1;
    } else {
      return tokenAmount * 0.05;
    }
  };

  console.log('downlinePurchases', downlinePurchases);

  const displayedDownlines = showAllDownlines
    ? downlinePurchases
    : downlinePurchases.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="portfolio">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => toggle('1')}
          >
            {t('wallet.referrals')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => toggle('2')}
          >
            {t('wallet.history')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => toggle('3')}
          >
            {t('wallet.downlinePurchases')}
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row className="justify-content-center align-items-center text-center">
            <div className="mt-4">
              <h4>{t('wallet.referrals')}</h4>
              <p>{t('wallet.referralDescription')}</p>
              <Separator />
              <Row className="referrals-grid">
                <Col className="referral-link-container">
                  <div className="referral-link-text mt-3">
                    {t('wallet.referralLink')}
                  </div>
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
                      <FaTelegramPlane /> {t('referral.shareLink')}
                    </Button>
                    <Button
                      onClick={copyReferralLink}
                      className="share-btn copy-button "
                      aria-label="Copy referral link"
                    >
                      <FaCopy /> {t('referral.copyLink')}
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    {t('wallet.totalEarnings')}:{' '}
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
                        <span className="referral-balance">
                          +{formatEther(r.referralAmount)}
                        </span>
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
              <h4>{t('wallet.history')}</h4>
              {purchaseHistory.length === 0 ? (
                <p>{t('wallet.noRecordsFound')}</p>
              ) : (
                <div className="purchase-history-list">
                  {loading ? (
                    <Spinner />
                  ) : (
                    purchaseHistory.map((purchase) => (
                      <div key={purchase.id} className="purchase-history-item">
                        <div className="history-date">
                          Date:{' '}
                          {new Date(
                            parseInt(purchase.date || 2) * 1000
                          ).toLocaleDateString()}
                        </div>
                        <div className="history-eth">
                          ETH: {formatEther(purchase.ethSpent)}
                        </div>
                        <div className="history-plt">
                          PLTL: {formatUnits(purchase.tokenAmount, 9)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <div className="mt-4">
            <h4 className="text-center">{t('wallet.downlinePurchases')}</h4>
            <p className="text-center text-muted">
              {t('wallet.downlinePurchasesDescription')}
            </p>
            <Separator />

            {downlinePurchases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <p>{t('wallet.noDownlinePurchases')}</p>
              </div>
            ) : (
              <div className="downline-purchases-list">
                <div className="downline-stats">
                  <div className="downline-stat-item">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">
                        {t('wallet.totalDownlines')}
                      </div>
                      <div className="stat-value">
                        {downlinePurchases.length}
                      </div>
                    </div>
                  </div>

                  <div className="downline-stat-item">
                    <div className="stat-icon">
                      <FaEthereum />
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">
                        {t('wallet.totalVolume')}
                      </div>
                      <div className="stat-value">
                        {downlinePurchases
                          .reduce(
                            (total, purchase) =>
                              total + parseFloat(formatEther(purchase.amount)),
                            0
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="downline-stat-item">
                    <div className="stat-icon">
                      <span className="dollar-icon">$</span>
                    </div>
                    <div className="stat-info">
                      <div className="stat-label">
                        {t('wallet.totalVolumeUSD')}
                      </div>
                      <div className="stat-value">
                        $
                        {downlinePurchases
                          .reduce(
                            (total, purchase) =>
                              total + (purchase.amountUSD || 0),
                            0
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {displayedDownlines.map((purchase, index) => (
                  <div key={index} className="downline-purchase-item">
                    <div className="purchase-header">
                      <div className="downline-address">
                        <span className="address-label">
                          {t('wallet.downlineAddress')}:
                        </span>
                        <span className="address-value">
                          {formatAddress(purchase.buyer)}
                        </span>
                      </div>
                      <div className="purchase-date">
                        {new Date(purchase.date * 1000).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="purchase-details">
                      <div className="purchase-amount">
                        <span className="amount-label">ETH:</span>
                        <span className="amount-value">
                          {formatEther(purchase.amount)}
                          {purchase.amountUSD && (
                            <small>(${purchase.amountUSD.toFixed(2)})</small>
                          )}
                        </span>
                      </div>

                      <div className="purchase-tokens">
                        <span className="tokens-label">PLTL:</span>
                        <span className="tokens-value">
                          {formatUnits(purchase.tokenAmount, 9)}
                        </span>
                      </div>

                      <div className="purchase-level">
                        <span className="level-label">
                          {t('wallet.level')}:
                        </span>
                        <span className="level-value">
                          {purchase.directReferrer === currentUser?.address
                            ? t('wallet.firstGeneration')
                            : t('wallet.secondGeneration')}
                        </span>
                      </div>

                      <div className="purchase-ref-earning">
                        <span className="ref-earning-label">
                          {t('wallet.refEarning')}:
                        </span>
                        <span className="ref-earning-value">
                          {refEarning(purchase)} PLTL
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {downlinePurchases.length > ITEMS_PER_PAGE &&
                  !showAllDownlines && (
                    <div className="show-more-container">
                      <Button
                        className="show-more-btn"
                        onClick={() => setShowAllDownlines(true)}
                      >
                        {t('common.showMore')} (
                        {downlinePurchases.length - ITEMS_PER_PAGE})
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

PresaleTabs.propTypes = {
  purchaseHistory: PropTypes.array,
  referrals: PropTypes.array,
  downlinePurchases: PropTypes.array,
  loading: PropTypes.bool,
};

export default PresaleTabs;

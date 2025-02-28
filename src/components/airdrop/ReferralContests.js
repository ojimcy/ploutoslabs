import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Spinner,
} from 'reactstrap';
import classnames from 'classnames';
import './contest.css';
import { getRefLeaderboard } from '../../lib/server';
import ContestList from './ContestList';
import { useTranslation } from 'react-i18next';
const ReferralContests = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const [dailyLeaderboard, weeklyLeaderboard] = await Promise.all([
        getRefLeaderboard('daily'),
        getRefLeaderboard('weekly'),
      ]);

      setDailyData(dailyLeaderboard.leaderboard || []);
      setWeeklyData(weeklyLeaderboard.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="contest-page">
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="contest-title text-center mb-4">
              {t('referral.contests')}
            </h3>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'daily' })}
                  onClick={() => toggleTab('daily')}
                >
                  {t('referral.daily')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 'weekly' })}
                  onClick={() => toggleTab('weekly')}
                >
                  {t('referral.weekly')}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="daily">
                <ContestList
                  title={t('referral.dailyContestListTitle')}
                  subtitle={t('referral.dailyContestListSubtitle')}
                  data={dailyData}
                  contestType="daily"
                />
              </TabPane>
              <TabPane tabId="weekly">
                <ContestList
                  title={t('referral.weeklyContestListTitle')}
                  subtitle={t('referral.weeklyContestListSubtitle')}
                  data={weeklyData}
                  contestType="weekly"
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReferralContests;

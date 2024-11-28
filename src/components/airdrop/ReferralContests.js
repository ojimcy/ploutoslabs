import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import './contest.css';
import { getRefLeaderboard } from '../../lib/server';
import ContestList from './ContestList';
import TelegramBackButton from '../common/TelegramBackButton';

const ReferralContests = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const fetchLeaderboardData = async () => {
    try {
      const leaderboard = await getRefLeaderboard('daily');
      setDailyData(leaderboard.leaderboard || []);

      const weeklyData = await getRefLeaderboard('weekly');
      setWeeklyData(weeklyData.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return (
    <div className="contest-page">
      <TelegramBackButton />
      <Row>
        <Col xs={12}>
          <h3 className="text-center my-4">Referral Contests</h3>
          <Nav tabs className="justify-content-center">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'daily' })}
                onClick={() => toggleTab('daily')}
              >
                Daily Contest
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'weekly' })}
                onClick={() => toggleTab('weekly')}
              >
                Weekly Contest
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="daily">
              <ContestList
                title="Daily Referral Contest"
                subtitle="First 5 to refer 20 people in a day win $10"
                data={dailyData}
                contestType="daily"
              />
            </TabPane>
            <TabPane tabId="weekly">
              <ContestList
                title="Weekly Referral Contest"
                subtitle="First 5 to refer 100 people in a week win $100"
                data={weeklyData}
                contestType="weekly"
              />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default ReferralContests;

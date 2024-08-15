import React from 'react';
import './game.css';
import { Button, Container } from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

function GroupScreen() {
  const group = {
    name: 'Group 1',
    totalPlayers: 10,
    rewardPool: 1000,
    members: [{ username: 'Charlie', score: 1100, avatar: null }],
  };

  return (
    <div className="group-page">
      <TelegramBackButton />
      <Container className="group-content">
        <div className="group-header text-center">
          <h1>{group.name}</h1>
          <div className="buttons mt-3">
            <Button className="info-btn">How It Works</Button>
            <Button className="info-btn">View All</Button>
          </div>
        </div>

        {/* Group Details Card */}
        <div className="group-card mt-5">
          <div className="details">
            <div className="details-section">
              <span className="details-label">Total Players:</span>
              <span id="total-players">{group.totalPlayers}</span>
            </div>
            <div className="details-section">
              <span className="details-label">Reward Pool:</span>
              <span id="reward-pool">{group.rewardPool}</span>
            </div>
          </div>
          <div className="buttons">
            <Button className="button leave">Leave Group</Button>
            <Button className="button">Invite Members</Button>
          </div>
        </div>

        {/* Members Section */}
        <h2 className="mt-3">Members</h2>
        <ul className="user-list">
          {group.members.map((member, index) => (
            <li key={index}>
              <div className="user-info">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.username}
                    className="avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="username">{member.username}</span>
              </div>
              <div className="user-score">{member.score}</div>
            </li>
          ))}
        </ul>
      </Container>
      <Button className="play-btn" block>
        Play
      </Button>
    </div>
  );
}

export default GroupScreen;

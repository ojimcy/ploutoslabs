import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
} from 'reactstrap';
import './join.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

function JoinPage() {
  const [sudoUsername, setSudoUsername] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [availableGroups] = useState([
    { id: 1, name: 'Group A', players: 5, rewardPool: 500 },
    { id: 2, name: 'Group B', players: 3, rewardPool: 300 },
  ]);

  const handleJoinOneToOne = () => {
    // Implement the logic to join one-to-one game with sudoUsername and gameCode
  };

  const handleJoinGroupGame = (group) => {
    setSelectedGroup(group);
  };

  const handleJoinGroupWithCode = () => {
    // Implement the logic to join group game with gameCode
  };

  return (
    <div className="join-page">
      <TelegramBackButton />
      <Container>
        <h2 className="text-center mt-4">Join Game</h2>

        {/* One-to-One Game Section */}
        <div className="join-section">
          <h3>One-to-One</h3>
          <Form onSubmit={handleJoinOneToOne}>
            <FormGroup>
              <Label for="sudoUsername"> Username</Label>
              <Input
                type="text"
                id="sudoUsername"
                placeholder="Enter username"
                value={sudoUsername}
                onChange={(e) => setSudoUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="gameCode">Game Code</Label>
              <Input
                type="text"
                id="gameCode"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
              />
            </FormGroup>
            <Button className="join-btn" color="primary" block>
              Join
            </Button>
          </Form>
        </div>

        {/* Group Game Section */}
        <div className="join-section mt-5">
          <h3>Available Groups</h3>
          <Row>
            {availableGroups.map((group) => (
              <Col key={group.id} xs={12} sm={6} md={4} className="group-card">
                <div className="group-info">
                  <h4>{group.name}</h4>
                  <p>Players: {group.players}</p>
                  <p>Reward Pool: {group.rewardPool}</p>
                  <Button
                    color="primary"
                    onClick={() => handleJoinGroupGame(group)}
                  >
                    Join Group
                  </Button>
                </div>
              </Col>
            ))}
          </Row>

          {selectedGroup && (
            <div className="join-group-code mt-4">
              <h4>Enter Game Code to play against {selectedGroup.name}</h4>
              <Input
                type="text"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
              />
              <Button
                className="mt-2"
                color="primary"
                block
                onClick={handleJoinGroupWithCode}
              >
                Join {selectedGroup.name}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default JoinPage;

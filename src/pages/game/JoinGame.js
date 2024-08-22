import React, { useState } from 'react';
import { Container, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import './join.css';
import TelegramBackButton from '../../components/common/TelegramBackButton';
import { joinGame } from '../../lib/server';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/telegram';

function JoinPage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(currentUser.gameNickname || '');
  const [gameCode, setGameCode] = useState('');

  const handleJoinOneToOne = async () => {
    try {
      await joinGame({
        gameNickname: nickname,
        gameCode,
      });
      navigate('/game/waiting');
    } catch (error) {
      console.error('Error while joining game: ', error);
    }
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
              <Label for="nickname">Nickname:</Label>
              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter a nickname"
              />
            </FormGroup>
            <FormGroup>
              <Label for="gameCode">Game Code: </Label>
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
      </Container>
    </div>
  );
}

export default JoinPage;

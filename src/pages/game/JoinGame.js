import React, { useContext, useEffect, useState } from 'react';
import { Container, Button, Input, FormGroup, Label } from 'reactstrap';
import './join.css';
import TelegramBackButton from '../../components/common/TelegramBackButton';
import { joinGame } from '../../lib/server';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/telegram';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

function JoinPage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const { setGameCode } = useContext(AppContext);
  const [gameCode, setCurrentGameCode] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setNickname(currentUser.gameNickname);
  }, [currentUser]);

  const handleJoinOneToOne = async () => {
    try {
      setGameCode(gameCode);
      await joinGame({
        gameNickname: nickname,
        code: gameCode,
      });
      navigate('/game/super-catch/waiting');
    } catch (error) {
      console.error('Error while joining game: ', error);
      toast.error(error.response.data.error || 'Error while joining game');
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
              onChange={(e) => setCurrentGameCode(e.target.value)}
            />
          </FormGroup>
          <Button
            className="join-btn"
            color="primary"
            block
            onClick={handleJoinOneToOne}
          >
            Join
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default JoinPage;

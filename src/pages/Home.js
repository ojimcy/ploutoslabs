import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getUserByTelegramID } from '../lib/server';
import { WebappContext } from '../context/telegram';

function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);
  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    // if (!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramId);
      if (user && user.id) {
        setUser(user);
        navigate('/dashboard/airdrop');
      } else {
        navigate('/auth');
      }
    };
    fn();
  }, [telegramId]);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Row className="justify-content-center">
        <Col className="text-center">
          <Spinner
            style={{
              width: '5rem',
              height: '5rem',
            }}
            color="primary"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

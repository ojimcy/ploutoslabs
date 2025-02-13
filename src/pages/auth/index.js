import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import { BOT_USERNAME } from '../../constants';
import { toast } from 'react-hot-toast';
import { loginWithTelegram as loginWithTelegramAPI } from '../../lib/server';
import { WebappContext } from '../../context/telegram';
import AuthPinPad from '../../components/auth/AuthPinPad';

import airdropLogo from '../../assets/images/airdrop-logo.png';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [tempTelegramData, setTempTelegramData] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (telegramId) {
      navigate('/dashboard/airdrop');
    }
  }, [telegramId]);

  // Define global Telegram login callback
  useEffect(() => {
    window.loginWithTelegram = async (user) => {
      setLoading(true);
      try {
        const result = await loginWithTelegramAPI(user);
        console.log('result', result.user);

        if (!result.user) {
          // New user - show PIN modal
          setTempTelegramData(user);
          setShowPinPad(true);
        } else {
          // Existing user - proceed with login
          localStorage.setItem('ACCESS_TOKEN_KEY', result.token);
          localStorage.setItem('TELEGRAM_ID', result.user.telegramId);
          setUser(result.user);
          navigate('/dashboard/airdrop');
          toast.success('Successfully logged in!');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Login failed');
        console.error('Telegram login failed:', error);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      delete window.loginWithTelegram;
    };
  }, [navigate, setUser]);

  const handlePinSubmit = async (pin) => {
    setLoading(true);
    try {
      const userData = {
        telegramId: tempTelegramData.id,
        username: tempTelegramData.username,
        pin,
        uplineId: new URLSearchParams(window.location.search).get('ref') || 0,
      };

      const user = await loginWithTelegramAPI(userData);
      localStorage.setItem('ACCESS_TOKEN_KEY', user.token);
      localStorage.setItem('TELEGRAM_ID', user.telegramId);
      if (user) {
        setUser(user);
        navigate('/dashboard/airdrop');
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
      setShowPinPad(false);
    }
  };

  // Telegram login button script
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[data-telegram-login]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-onauth', 'loginWithTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <div className="auth-card">
              {!showPinPad ? (
                <>
                  <div className="text-center mb-4 d-flex flex-column align-items-center">
                    <div className="bg-black rounded-circle auth-logo-container">
                      <img
                        src={airdropLogo}
                        alt="Ploutos Labs"
                        className="auth-logo"
                        style={{ width: '80px', height: 'auto' }}
                      />
                    </div>
                    <h3 className="title">Welcome to Ploutos Labs</h3>
                    <p className="sub-title">
                      Start mining <strong>$PLTL</strong> tokens and join our
                      growing community. Connect with Telegram to continue.
                    </p>
                  </div>

                  <div className="d-flex justify-content-center">
                    <div id="telegram-login-container"></div>
                  </div>

                  <div className="text-center mt-4">
                    <small className="text-muted">
                      By connecting, you agree to our{' '}
                      <a href="/terms" className="text-primary">
                        Terms of Service
                      </a>
                    </small>
                  </div>
                </>
              ) : (
                <AuthPinPad onSubmit={handlePinSubmit} loading={loading} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Auth;

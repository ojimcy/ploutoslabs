import React, { useContext, useEffect, useState } from 'react';
import { Container, Input, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useInitData, useTelegramUser } from '../../hooks/telegram';
import { createAccount, getUserByTelegramID } from '../../lib/server';
import { WebappContext } from '../../context/telegram';
import { toast } from 'react-toastify';

import './auth.css';

function Auth() {
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);
  const telegramUser = useTelegramUser();
  const initData = useInitData();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id);
      if (user && user.id) {
        setUser(user);
        navigate('/dashboard');
      }
    };
    fn();
  }, [telegramUser, navigate]);

  const handlePinChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPin(value);
    setError('');
  };

  const handleConfirmPinChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setConfirmPin(value);
    setError('');
  };

  const handleCreateAccount = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setError('PIN must be 4 digits long');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    const userData = {
      telegramId: telegramUser.id,
      username: telegramUser.username,
      pin,
      uplineId: parseInt(initData.start_param) || 0,
    };

    try {
      const user = await createAccount(userData);
      if (user && user.id) {
        setUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error in creating account:', error);
      toast.error('Error in creating account');
    }
  };

  return (
    <Container className="auth-container">
      <div className="auth d-flex flex-column">
        <div className="d-flex flex-column text-center">
          <h3 className="title">Ploutos Labs</h3>
          <p className="sub-title mt-3">
            Start mining <strong>$PLTL</strong> from Ploutos Labs. Create your
            account to continue
          </p>
        </div>

        <div className="mt-4">
          <Label className="my-2 mt-2">Enter your PIN:</Label>
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            autoFocus
            invalid={!!error}
          />
        </div>
        <div className="">
          <Label className="mt-4">Confirm your PIN:</Label>
          <Input
            type="password"
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={handleConfirmPinChange}
            maxLength={4}
            invalid={!!error}
          />
        </div>
        {error && <span className="error">{error}</span>}

        <div className="auth-actions d-flex justify-content-center mt-5">
          <button
            onClick={handleCreateAccount}
            className="btn btn-primary auth-btn"
          >
            Create New Account
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Auth;

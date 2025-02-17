import { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCurrentUser } from '../../hooks/telegram';
import { getUserByTelegramID } from '../../lib/server';
import { WebappContext } from '../../context/telegram';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);
  const telegramId = localStorage.getItem('TELEGRAM_ID');
  const currentUser = useCurrentUser();
  const authCheckCompleted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckCompleted.current) return;

      try {
        if (!telegramId) throw new Error('No telegram ID');

        const user = await getUserByTelegramID(telegramId);
        if (!user?.id) throw new Error('User not found');

        setUser(user); // Update context with fetched user
        authCheckCompleted.current = true;
      } catch (error) {
        console.error('Auth check failed:', error);
        authCheckCompleted.current = true;
        localStorage.removeItem('TELEGRAM_ID');
        navigate('/auth');
      }
    };

    checkAuth();
  }, [telegramId, navigate, setUser]);

  if (!authCheckCompleted.current) {
    return null; // Show nothing while checking
  }

  return currentUser ? children : null;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;

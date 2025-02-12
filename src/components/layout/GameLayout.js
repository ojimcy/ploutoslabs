import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebappContext } from '../../context/telegram';
import { createAccount, getUserByTelegramID } from '../../lib/server';
import { Spinner } from 'reactstrap';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const GameLayout = ({ children }) => {
  const navigate = useNavigate();
  const {
    setUser,
    loadingPageIsVissible,
    // hideLoadingPage,
    // showLoadingPage,
  } = useContext(WebappContext);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (!telegramId) {
      navigate('/auth');
      return;
    }
    // if (currentUser) return;
    // showLoadingPage();

    const fn = async () => {
      let user = await getUserByTelegramID(telegramId);
      if (!user || !user.id) {
        const userData = {
          telegramId: telegramId,
          username: telegramId,
          pin: '0000',
          // get uplineId from url
          uplineId:
            parseInt(new URLSearchParams(window.location.search).get('ref')) ||
            0,
        };
        const resp = await createAccount(userData);
        if (resp.error) {
          // toast the error
          toast.error(resp.error);
          return;
        }
        user = resp.user;
        console.log('new user', user);
      }
      setUser(user);
      // hideLoadingPage();
    };

    fn();
  }, [telegramId]);

  return (
    <div className="page-content">
      {!loadingPageIsVissible && (
        <>
          <main className="content">{children}</main>
        </>
      )}

      {loadingPageIsVissible && (
        <div className="page-content">
          <main className="content">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '100vh' }}
            >
              <Spinner
                style={{ width: '3rem', height: '3rem' }}
                color="primary"
              />
              {/* You can change 'primary' to any other color theme like secondary, success, info, etc. */}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameLayout;

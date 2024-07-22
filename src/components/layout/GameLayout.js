import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebappContext } from '../../context/telegram';
import { createAccount, getUserByTelegramID } from '../../lib/server';
import {
  useTelegramUser,
  // useCurrentUser,
  useInitData,
} from '../../hooks/telegram';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';

const GameLayout = ({ children }) => {
  const initData = useInitData();
  const {
    webapp,
    setUser,
    loadingPageIsVissible,
    hideLoadingPage,
    showLoadingPage,
  } = useContext(WebappContext);
  const telegramUser = useTelegramUser();

  useEffect(() => {
    if (!telegramUser) {
      // hideLoadingPage();
      return;
    }
    // if (currentUser) return;
    showLoadingPage();

    const fn = async () => {
      if (webapp.expand) webapp.expand();
      let user = await getUserByTelegramID(telegramUser.id);
      if (!user || !user.id) {
        const userData = {
          telegramId: telegramUser.id,
          username: telegramUser.username,
          pin: '0000',
          uplineId: parseInt(initData.start_param) || 0,
        };
        const resp = await createAccount(userData);
        console.log('resp', resp)
        if (resp.error) {
          // toast the error
          toast.error(resp.error);
          return;
        }
        user = resp.user;
        console.log('new user', user);
      }
      setUser(user);
      hideLoadingPage();
    };

    fn();
  }, [telegramUser]);

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

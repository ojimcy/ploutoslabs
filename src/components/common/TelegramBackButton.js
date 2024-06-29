import { useEffect } from 'react';
import { useWebApp } from '../../hooks/telegram';
import { useNavigate } from 'react-router-dom';

const TelegramBackButton = () => {
  const webApp = useWebApp();
  const navigated = useNavigate();

  const goBack = () => {
    navigated.goBack();
  };

  useEffect(() => {
    if (!webApp) return;
    console.log(webApp);
    webApp.BackButton.isVisible = true;
    webApp.BackButton.onClick(goBack);
    // window.Telegram.WebApp.onEvent('backButtonClicked', () => {
    //   navigated.goBack();
    // });
    return () => {
      webApp.BackButton.isVisible = false;
      webApp.BackButton.offClick(goBack);
    };
  });

  return null;
};

export default TelegramBackButton;

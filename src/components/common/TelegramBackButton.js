import { useEffect } from 'react';

const TelegramBackButton = () => {
  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.history.back();
      });
    }

    return () => {
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide();
        window.Telegram.WebApp.BackButton.offClick(() => {
          window.history.back();
        });
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default TelegramBackButton;

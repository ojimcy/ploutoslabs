import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import WOW from 'wowjs';
import 'wowjs/css/libs/animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Dashboard from './pages/dashboard/Dashboard';
import Register from './pages/auth';
import Layout from './components/layout/Layout';
import Send from './pages/dashboard/wallet/Send';
import Receive from './pages/dashboard/wallet/Receive';
import ViewWallets from './pages/dashboard/wallet/ViewWallets';
import WalletCredentials from './pages/dashboard/wallet/WalletCredentials';
import ImportWallet from './pages/dashboard/wallet/ImportWallet';
import Airdrop from './pages/dashboard/airdrop/Airdrop';
import Tasks from './pages/dashboard/airdrop/tasks';
import Referrals from './pages/dashboard/airdrop/Referrals';
import Boosts from './pages/dashboard/airdrop/Boosts';
import GameLayout from './components/layout/GameLayout';
import RainGameCanvas from './pages/RainGameCanvas';
import CreateWallet from './pages/dashboard/wallet/CreateWallet';
import Game from './pages/game/Game';
import GroupPage from './pages/game/GroupPage';
import JoinPage from './pages/game/JoinGame';
import GameSummaryPage from './pages/game/GameSummaryPage';
import GameDetails from './pages/game/GameDetails';

const App = () => {
  useEffect(() => {
    const wow = new WOW.WOW();
    wow.init();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <Routes>
              <Route index element={<Home />} />
            </Routes>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <Layout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="airdrop" element={<Airdrop />} />
                <Route path="send" element={<Send />} />
                <Route path="receive" element={<Receive />} />
                <Route path="accounts" element={<ViewWallets />} />
                <Route
                  path="wallet-credentials"
                  element={<WalletCredentials />}
                />
                <Route path="create" element={<CreateWallet />} />
                <Route path="import-wallet" element={<ImportWallet />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="boosts" element={<Boosts />} />
              </Routes>
            </Layout>
          }
        />

        <Route
          path="/game/*"
          element={
            <GameLayout>
              <Routes>
                <Route index element={<Game />} />
                <Route path="/super-catch" element={<RainGameCanvas />} />
                <Route path="/group" element={<GroupPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/summary" element={<GameSummaryPage />} />
                <Route path="waiting" element={<GameDetails />} />
              </Routes>
            </GameLayout>
          }
        />

        <Route
          path="/auth/*"
          element={
            <Routes>
              <Route index element={<Register />} />
            </Routes>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

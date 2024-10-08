import React, { useEffect } from 'react';
import randomBytes from 'randombytes';
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
import CreateWallet from './pages/dashboard/wallet/CreateWallet';
import SuperCatchGame from './pages/game/SuperCatchGame';
import GroupPage from './pages/game/GroupPage';
import JoinPage from './pages/game/JoinGame';
import GameSummaryPage from './pages/game/GameSummaryPage';
import GameDetails from './pages/game/GameDetails';
import DailyReward from './components/airdrop/DailyReward';
import OnrampPage from './pages/dashboard/wallet/OnrampPage';
import TokenPresale from './pages/dashboard/Presale';
import ConfirmationPage from './pages/dashboard/wallet/confirmation';
import GameLeaderBoard from './components/airdrop/GameLeaderboard';
import Games from './pages/game/Games';
import ComingSoon from './pages/ComingSoon';

if (!crypto.getRandomValues) {
  crypto.getRandomValues = (array) => {
    const randomValues = randomBytes(array.length);
    array.set(randomValues);
    return array;
  };
}

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
                <Route path="onramp" element={<OnrampPage />} />
                <Route
                  path="wallet-credentials"
                  element={<WalletCredentials />}
                />
                <Route path="create" element={<CreateWallet />} />
                <Route path="confirm" element={<ConfirmationPage />} />
                <Route path="import-wallet" element={<ImportWallet />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="boosts" element={<Boosts />} />
                <Route path="rewards" element={<DailyReward />} />
                <Route path="presale" element={<TokenPresale />} />
                <Route path="game-leaderboard" element={<GameLeaderBoard />} />
              </Routes>
            </Layout>
          }
        />

        <Route
          path="/game/*"
          element={
            <GameLayout>
              <Routes>                
                <Route index element={<Games />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/super-catch" element={<SuperCatchGame />} />
                {/* <Route path="/super-catch" element={<RainGameCanvas />} /> */}
                <Route path="/super-catch/group" element={<GroupPage />} />
                <Route path="/super-catch/join" element={<JoinPage />} />
                <Route path="/super-catch/summary" element={<GameSummaryPage />} />
                <Route path="/super-catch/waiting" element={<GameDetails />} />
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

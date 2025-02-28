import './i18n';
import React, { useEffect } from 'react';
import randomBytes from 'randombytes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import WOW from 'wowjs';
import 'wowjs/css/libs/animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Dashboard from './pages/dashboard/Dashboard';
import Register from './pages/auth/';
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
import AddTask from './pages/dashboard/AddTask';
// import ConfirmationPage from './pages/dashboard/wallet/confirmation';
import GameLeaderBoard from './components/airdrop/GameLeaderboard';
import ReferralContests from './components/airdrop/ReferralContests';
import Games from './pages/game/Games';
import ComingSoon from './pages/ComingSoon';
import AirdropLayout from './components/layout/DashboardLayout';
import TokenPresale from './pages/dashboard/Presale';
import UtilitiesPage from './pages/dashboard/utilities';
import Airtime from './pages/dashboard/utilities/AirtimePage';
import DataPage from './pages/dashboard/utilities/DataPage';
import ElectricityBillPage from './pages/dashboard/utilities/ElectricityBillPage';
import TransactionPage from './pages/dashboard/utilities/TransactionPage';
import TvSubscriptionPage from './pages/dashboard/utilities/TvSubscriptionPage';
import Checkout from './pages/dashboard/utilities/Checkout';
import TransactionSummary from './pages/dashboard/utilities/TransactionSummary';
import CheckoutSummary from './pages/dashboard/utilities/CheckoutSummary';
import PageNotFound from './pages/NotFound';
import AuthGuard from './components/guards/AuthGuard';
import TokenDetail from './pages/dashboard/wallet/TokenDetail';
import WalletDetail from './pages/dashboard/wallet/WalletDetail';

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
          path="/dashboard/airdrop"
          element={
            <AuthGuard>
              <AirdropLayout>
                <Routes>
                  <Route index element={<Airdrop />} />

                  {/* 404 page */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </AirdropLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="send" element={<Send />} />
                  <Route path="receive" element={<Receive />} />
                  <Route path="accounts" element={<ViewWallets />} />
                  <Route path="onramp" element={<OnrampPage />} />
                  <Route
                    path="wallet-credentials"
                    element={<WalletCredentials />}
                  />
                  <Route path="create" element={<CreateWallet />} />
                  {/* <Route path="confirm" element={<ConfirmationPage />} /> */}
                  <Route path="import-wallet" element={<ImportWallet />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="referrals" element={<Referrals />} />
                  <Route path="boosts" element={<Boosts />} />
                  <Route path="rewards" element={<DailyReward />} />
                  <Route path="presales" element={<TokenPresale />} />
                  <Route
                    path="game-leaderboard"
                    element={<GameLeaderBoard />}
                  />
                  <Route
                    path="ref-leaderboard"
                    element={<ReferralContests />}
                  />
                  <Route path="create-task" element={<AddTask />} />
                  <Route path="utilities" element={<UtilitiesPage />} />
                  <Route path="airtime" element={<Airtime />} />
                  <Route path="data" element={<DataPage />} />
                  <Route path="electricity" element={<ElectricityBillPage />} />
                  <Route path="transactions" element={<TransactionPage />} />
                  <Route
                    path="tv-subscription"
                    element={<TvSubscriptionPage />}
                  />
                  <Route path="checkout" element={<Checkout />} />
                  <Route
                    path="transaction-summary"
                    element={<TransactionSummary />}
                  />
                  <Route
                    path="transaction-details"
                    element={<CheckoutSummary />}
                  />
                  <Route path="token-detail" element={<TokenDetail />} />
                  <Route path="wallet" element={<WalletDetail />} />

                  {/* 404 page */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />

        <Route
          path="/game/*"
          element={
            <AuthGuard>
              <GameLayout>
                <Routes>
                  <Route index element={<Games />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="/super-catch" element={<SuperCatchGame />} />
                  {/* <Route path="/super-catch" element={<RainGameCanvas />} /> */}
                  <Route path="/super-catch/group" element={<GroupPage />} />
                  <Route path="/super-catch/join" element={<JoinPage />} />
                  <Route
                    path="/super-catch/summary"
                    element={<GameSummaryPage />}
                  />
                  <Route
                    path="/super-catch/waiting"
                    element={<GameDetails />}
                  />

                  {/* 404 page */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </GameLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/auth/*"
          element={
            <Routes>
              <Route index element={<Register />} />

              {/* 404 page */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          }
        />
        {/* page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

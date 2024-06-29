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
import Airdrop from './pages/dashboard/Airdrop';
import Send from './pages/dashboard/wallet/Send';
import Receive from './pages/dashboard/wallet/Receive';
import ViewWallets from './pages/dashboard/wallet/ViewWallets';
import WalletCredentials from './pages/dashboard/wallet/WalletCredentials';
import ImportWallet from './pages/dashboard/wallet/ImportWallet';

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
                <Route path="wallet-credentials" element={<WalletCredentials />} />
                <Route path="import-wallet" element={<ImportWallet />} />
              </Routes>
            </Layout>
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

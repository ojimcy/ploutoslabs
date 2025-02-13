import React from 'react';
import { Container } from 'reactstrap';
import BalanceCard from '../../components/wallet/BalanceCard';
import Portfolio from '../../components/wallet/Portfolio';
import data from '../../hooks/demo_data';
import './wallet/wallets.css';

function Dashboard() {
  return (
    <div className="wallet-page">
      <Container>
        <BalanceCard />
        <Portfolio crypto={data.cryptoData} transactions={data.transactionData}/>
      </Container>
    </div>
  );
}

export default Dashboard;

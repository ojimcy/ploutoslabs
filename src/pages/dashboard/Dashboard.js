import React from 'react';
import { Container } from 'reactstrap';
import BalanceCard from '../../components/wallet/BalanceCard';
import Portfolio from '../../components/wallet/Portfolio';
import data from '../../hooks/demo_data';
import TelegramBackButton from '../../components/common/TelegramBackButton';



function Dashboard() {
  return (
    <div className="wallet">
      <TelegramBackButton />
      <Container>
        <BalanceCard />
        <Portfolio crypto={data.cryptoData} transactions={data.transactionData}/>
      </Container>
    </div>
  );
}

export default Dashboard;

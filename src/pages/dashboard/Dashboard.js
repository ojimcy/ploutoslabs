import React from 'react';
import { Container } from 'reactstrap';
import BalanceCard from '../../components/wallet/BalanceCard';
import AirdropCard from '../../components/wallet/AirdropCard';
import Portfolio from '../../components/wallet/Portfolio';

import logo from '../../assets/images/logo.png'

const cryptoData = [
  {
    icon: logo,
    symbol: 'PLTL',
    price: 0.005,
    quantity: 1451.5,
  },
  {
    icon: logo,
    symbol: 'ETH',
    price: 2300,
    quantity: 5,
  },
  {
    icon: logo,
    symbol: 'BNB',
    price: 320,
    quantity: 10,
  },
];

const transactionData = [
  {
    date: '2024-06-28',
    type: 'Buy',
    amount: '1.5 BTC',
    txid: '0x1a2b3c4d5e6f7g8h',
  },
  {
    date: '2024-06-27',
    type: 'Sell',
    amount: '5 ETH',
    txid: '0x9i8u7y6t5r4e3w2q',
  },
  {
    date: '2024-06-26',
    type: 'Buy',
    amount: '10 BNB',
    txid: '0x8h7g6f5d4s3a2q1w',
  },
];

function Dashboard() {
  return (
    <div className="wallet">
      <Container>
        <BalanceCard />
        <AirdropCard />
        <Portfolio crypto={cryptoData} transactions={transactionData}/>
      </Container>
    </div>
  );
}

export default Dashboard;

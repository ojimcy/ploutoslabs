import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Container,
} from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import { OnrampWebSDK } from '@onramp.money/onramp-web-sdk';

const OnrampPage = () => {
  const [asset, setAsset] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState(0);

  // 1247696
  const handleSubmit = () => {
    const onrampInstance = new OnrampWebSDK({
      appId: 2,
      walletAddress: walletAddress,
      flowType: 1,
      fiatType: 6,
      paymentMethod: 1,
      lang: 'vi',
      fiatAmount: amount,
      network: 'matic20',
      coinCode: 'usdt',
      // ... pass other configs here
    });
    // Pass the form data back to the parent component or handle it here
    // const url = `https://onramp.money/app/?appId=1247696&network=base&fiatAmount=${amount}&coinCode=${asset}&paymentMethod=2&walletAddress=${walletAddress}&redirectUrl=https://t.me/ploutos_labs_dev_bot/app`;
    // console.log(url);
    //location.href = url;
    onrampInstance.show();

    // https://onramp.money/app/?appId=1247696&network=base&fiatAmount=8900&coinCode=usdc&paymentMethod=2&walletAddress=0xc87a86671E0590C2CC7e729FDb96d61550C122F5&redirectUrl=https://t.me/ploutos_labs_dev_bot/app
  };

  return (
    <Container>
      <TelegramBackButton />

      <Row>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="assetSelect">Select Asset</Label>
              <Input
                type="select"
                name="asset"
                id="assetSelect"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an asset
                </option>
                <option value="usdc">USDC (USDC)</option>
                <option value="eth">Ethereum (ETH)</option>
                {/* Add more assets as needed */}
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="walletAddress">Wallet Address</Label>
              <Input
                type="text"
                name="walletAddress"
                id="walletAddress"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                placeholder="Enter amount"
                max="3750000"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" onClick={handleSubmit}>
          Onramp
        </Button>
      </Row>
    </Container>
  );
};

export default OnrampPage;

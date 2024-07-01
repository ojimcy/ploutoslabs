import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { useCallback, useEffect, useState } from 'react';
import { setSmartWallet } from '../lib/server';

const buttonStyles = {
  background: 'transparent',
  border: '1px solid transparent',
  boxSizing: 'border-box',
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  width: 200,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: 18,
  backgroundColor: '#0052FF',
  color: '#FFF',
  borderRadius: 10,
};

const Connect = () => {
  const [uid, setUiid] = useState();
  const [created, setCreated] = useState(false);

  const sdk = new CoinbaseWalletSDK({
    appName: 'PLTL Wallet',
    appLogoUrl: 'https://ploutoslabs.io/favicon.svg',
    appChainIds: [84532],
  });

  const provider = sdk.makeWeb3Provider();

  useEffect(() => {
    const param = new URLSearchParams(location.search)
    setUiid(param.get('uid'))
    console.log(param.get('uid'))
  }, [setUiid])

  const handleSuccess = useCallback(async (address) => {
    const resp = await setSmartWallet(uid, address)
    console.log(resp)
    setCreated(true)
    // close browser and open telegram
  })

  const handleError = useCallback((error) => {
    console.log(error)
  })

  const createWallet = useCallback(async () => {
    try {
      const [address] = await provider.request({
        method: 'eth_requestAccounts',
      });
      handleSuccess(address);
    } catch (error) {
      handleError(error);
    }
  }, [handleSuccess, handleError, provider]);

  return <>
  {!created && <button style={buttonStyles} onClick={createWallet}>
      Create Wallet
    </button>}

    {created && <p>Return to telegram to continue</p>}
  </>;
};

export default Connect;

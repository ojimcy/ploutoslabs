import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useEffect, useState } from "react";
import { getTxDetails, updateTransaction } from "../lib/server";
import Web3 from "web3";

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

const tokenABI = [ // ERC-20 Token Contract ABI
  // Add the minimal ABI required to interact with the contract
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  }
];

const Sign = () => {
  const [tx, setTx] = useState(null);
  const [created, setCreated] = useState(true);
  const [hash, setHash] = useState('')

  const sdk = new CoinbaseWalletSDK({
    appName: 'PLTL Wallet',
    appLogoUrl: 'https://ploutoslabs.io/favicon.svg',
    appChainIds: [84532],
  });

  const provider = sdk.makeWeb3Provider();
  const web3 = new Web3(provider);

  useEffect(() => {
    const fn = async () => {
      const param = new URLSearchParams(location.search);
      const txid = param.get('txid');
      const txDetail = await getTxDetails(txid);
      setTx(txDetail)
    }

    fn()

  }, [setTx])

  const send = async () => {
    if (tx.token !== '0x4200000000000000000000000000000000000006') {
      await sendERC20Token(tx)
      return
    }
    const amountToSend = web3.utils.toWei(tx.amount, 'ether');

    const transactionParameters = {
      to: tx.toWallet,
      from: tx.walletAddress,
      value: web3.utils.toHex(amountToSend),
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    setHash(txHash)
    const input = {...tx, hash: txHash}
    await updateTransaction(input)
    setCreated(true)
    console.log('signature', txHash);
  }

  async function sendERC20Token(tx) {
    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];
    const receiverAddress = tx.toAddress;
    const amountToSend = web3.utils.toWei(tx.amount, tx.tokenDecimals);

    const contract = new web3.eth.Contract(tokenABI, tx.token);
    const data = contract.methods.transfer(receiverAddress, amountToSend).encodeABI();

    const transactionParameters = {
      to: tx.token,
      from: senderAddress,
      data: data,
      gas: web3.utils.toHex(60000), // Adjust gas limit as necessary
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')), // Adjust gas price as necessary
    };

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log('Transaction Hash:', txHash);
      const input = {...tx, hash: txHash}
      await updateTransaction(input)
      setCreated(true)
      setHash(txHash)
      console.log('signature', txHash);
    } catch (error) {
      console.error('Transaction Error:', error);
    }
  }

  return <>
  {!created && <button style={buttonStyles} onClick={send}>
      Sign Transaction
    </button>}

    {created && <p>Return to telegram to continue<br/>
    Hash: {hash}
    </p>}
  </>;
};

export default Sign;

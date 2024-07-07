import { useCallback, useEffect, useState } from "react";
import { getTxDetails, updateTransaction } from "../lib/server";
import { useAccount, useConnect, useSendTransaction, useWriteContract } from 'wagmi';
import { erc20Abi, parseEther } from "viem";

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


const Sign = () => {
  const [done, setDone] = useState(false);
  const account = useAccount()
  const { connectors, connect} = useConnect();
  const { 
    data: hash, 
    isPending,
    sendTransactionAsync 
  } = useSendTransaction();
  const { data: erc20hash, writeContractAsync, error: erc20Error } = useWriteContract()

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  const [tx, setTx] = useState(null);
  

  useEffect(() => {
    const fn = async () => {
      const param = new URLSearchParams(location.search);
      const txid = param.get('txid');
      const txDetail = await getTxDetails(txid);
      setTx(txDetail)
      console.log(txDetail)
    }

    fn()

  }, [setTx])

  const send = async () => {
    if (tx.token !== '0x4200000000000000000000000000000000000006') {
      console.log(tx, [tx.toAddress, parseEther(tx.amount, tx.tokenDecimals)])
      // await sendERC20Token(tx)
      const data = await writeContractAsync({
        address: tx.token,
        abi:erc20Abi,
        functionName: 'transfer',
        args: [tx.toAddress, parseEther(tx.amount, tx.tokenDecimals)],
      })
      console.log(data)
      await updateTransaction({...tx, hash: data, status: 'confirmed'})
      setDone(true)
      return
    }
    const data = await sendTransactionAsync({ to: tx.toAddress, value: parseEther(tx.amount) }) 
    await updateTransaction({...tx, hash: data, status: 'confirmed'})
    setDone(true)
    console.log(data)
  }

  useEffect(() => {
    if(!erc20Error) return
    console.log(erc20Error)
  }, [erc20Error])

  return <>
  {!done && !account.isConnected && <button style={buttonStyles} onClick={createWallet}>
      Connect Smart Wallet
    </button>}
  {! done && account.isConnected && <button style={buttonStyles} onClick={send}>
      Sign Transaction
    </button>}

    {isPending && <p>Sending transaction. Please wait...</p>}

    {done && <p>Return to telegram to continue<br/>
    Hash: {hash || erc20hash}
    </p>}
  </>;
};

export default Sign;

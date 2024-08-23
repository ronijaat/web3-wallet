'use client';

import axios from 'axios';
import { mnemonicToSeed } from 'bip39';
import { HDNodeWallet, Wallet, formatEther } from 'ethers';
import { useState } from 'react';
import { Button } from './ui/button';

interface EthWalletProps {
  mnemonic: string;
}

interface PublicKeyWithBalance {
  key: string;
  balance: string;
}

export const EthWallet = ({ mnemonic }: EthWalletProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<PublicKeyWithBalance[]>([]);

  const getBalance = async (address: string): Promise<string> => {
    const res = await axios.post(
      'https://eth-mainnet.g.alchemy.com/v2/SQl2E86QkdEeWHaPK-_jo8uGlb9lAGwM',
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }
    );
    const wei = res?.data?.result;
    return formatEther(wei); // Convert Wei to Ether
  };

  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const wallet = new Wallet(child.privateKey);

    if (!wallet.address) {
      throw new Error('Could not derive address');
    }

    const balance = await getBalance(wallet.address);

    setCurrentIndex((prevIndex) => prevIndex + 1);
    setAddresses((prevAddresses) => [
      ...prevAddresses,
      {
        key: wallet.address,
        balance: balance,
      },
    ]);
  };

  return (
    <div>
      <h1>Ethereum</h1>
      <Button onClick={addWallet}>Add ETH wallet</Button>

      {addresses.map((address, i) => (
        <div key={address.key}>
          {i + 1}. Eth - {address.key} - Balance: {address.balance} ETH
        </div>
      ))}
    </div>
  );
};

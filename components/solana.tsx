import { Keypair, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { useState } from 'react';
import nacl from 'tweetnacl';
import { Button } from './ui/button';

interface SolanaProps {
  mnemonic: string;
}

interface PublicKeyWithBalance {
  key: PublicKey;
  balance: number;
}

export function Solana({ mnemonic }: SolanaProps) {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<PublicKeyWithBalance[]>([]);

  if (!mnemonic) {
    return <p>Please provide a valid seed phrase</p>;
  }

  const getBalance = async (address: PublicKey): Promise<number> => {
    const res = await axios.post(
      'https://solana-mainnet.g.alchemy.com/v2/SQl2E86QkdEeWHaPK-_jo8uGlb9lAGwM',
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address.toBase58()],
      }
    );
    return res?.data?.result?.value / 1000000;
  };

  const addWallet = async () => {
    setLoading(true);
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const balance = await getBalance(keypair.publicKey);

    setCurrentIndex((prevIndex) => prevIndex + 1);
    setPublicKeys((prevKeys) => [
      ...prevKeys,
      {
        key: keypair.publicKey,
        balance: balance,
      },
    ]);
    setLoading(false);
  };

  return (
    <div>
      <h1>Solana</h1>
      <Button onClick={addWallet} className="mt-2" disabled={loading}>
        {loading ? 'Loading...' : 'Add Wallet'}
      </Button>
      {publicKeys.length > 0 &&
        publicKeys.map((p, i) => (
          <div key={p.key.toBase58()}>
            {i + 1}. {p.key.toBase58()} - Balance: {p.balance} SOL
          </div>
        ))}
    </div>
  );
}

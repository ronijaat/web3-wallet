'use client';

import { EthWallet } from '@/components/etherium';
import { Solana } from '@/components/solana';
import { Button } from '@/components/ui/button';
import { generateMnemonic } from 'bip39';
import { useState } from 'react';

export default function Home() {
  const [mnemonic, setMnemonic] = useState('');
  const [blockchain, setBlockChain] = useState('solana');
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col mt-8 w-[50%] items-center justify-center gap-8">
          {/* <Input /> */}
          <Button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}
          >
            Generate Seed Phrase
          </Button>
          <div>
            {mnemonic.length > 0 && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Your Seed Phrase:
                </h2>
                <div className="shadow-lg p-8 rounded-2xl bg-slate-100 dark:bg-slate-900 mt-2">
                  <div className="grid grid-cols-4 gap-8">
                    {mnemonic.split(' ').map((word, index) => {
                      return (
                        <div key={word} className="">
                          {index + 1}. {word}
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-center mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(mnemonic);
                          alert('Seed phrase copied to clipboard');
                        }}
                      >
                        Click here to copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {mnemonic.length > 0 && (
        <div>
          <p className="text-2xl flex flex-col items-center justify-center font-medium text-gray-900 dark:text-gray-100 mt-8">
            Choose your BlockChain:
          </p>
          <div className="grid grid-cols-2 font-medium text-gray-900 dark:text-gray-100 mx-20 mt-2">
            <Solana mnemonic={mnemonic} />

            <EthWallet mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </>
  );
}

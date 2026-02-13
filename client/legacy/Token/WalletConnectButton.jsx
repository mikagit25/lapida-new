import React from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';


function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  return (
    <div>
      <button onClick={() => open()} className="bg-indigo-600 text-white px-4 py-2 rounded">
        {isConnected ? 'Отключить кошелёк' : 'Подключить кошелёк'}
      </button>
      {isConnected && <div className="mt-2 text-green-600">Кошелёк: {address}</div>}
    </div>
  );
}

export default WalletConnectButton;



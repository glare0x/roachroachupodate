import React from 'react';

const WalletButton = () => {
  const BASE_MAINNET_ID = '8453'; // Assuming this is the correct decimal ID for the Base mainnet

  // Attempt to switch to the Base mainnet
  const switchToBaseMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(BASE_MAINNET_ID, 10).toString(16)}` }], // Hexadecimal with '0x' prefix
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          // Base mainnet not added to user's wallet; attempt to add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${parseInt(BASE_MAINNET_ID, 10).toString(16)}`,
                rpcUrl: 'https://<BASE_RPC_URL>', // Replace <BASE_RPC_URL> with the actual RPC URL of Base mainnet
                // Include other parameters as necessary (chainName, symbol, etc.)
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding the Base mainnet:', addError);
        }
      } else {
        console.error('Error switching to the Base mainnet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await window.ethereum.request({ method: 'net_version' });

        if (networkId !== parseInt(BASE_MAINNET_ID, 10).toString()) {
          alert('You are connected to the wrong network.');
          await switchToBaseMainnet();
          return;
        }

        console.log('Connected account:', accounts[0]);
        alert(`Wallet connected: ${accounts[0]} on Base mainnet`);
      } catch (error) {
        console.error('Error connecting to the wallet:', error);
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  return <button onClick={connectWallet}>Connect Wallet</button>;
};

export default WalletButton;

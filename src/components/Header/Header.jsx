import React, { useState, useEffect } from "react";
import user from "../../assets/Images/user.svg";
import { Logo } from "../../assets/Images";
import { Dialog } from '@headlessui/react'
import "./header.css";
// const ROACH_TOKEN_CONTRACT = import.meta.env.VITE_ROACH_TOKEN_CONTRACT;

const VITE_ROACH_TOKEN_CONTRACT = "0x30ed6eb751Bb1f94a35256dd68B01D1D27B576A5"
const VITE_ROACH_RALLY_CONTRACT = "0x00819bFf8341f30743BfdF9f63EDA38E78c96434"
const VITE_ROACH_FLIP_CONTRACT = "0x5D7A8E777e74AF9d7A12FA7aee24B45c2a93E1FB"
const VITE_ROACH_MANAGER_CONTRACT = "0x6bc984bD80346EBF7680dd81ad7449d1A8688599"
const ROACH_TOKEN_CONTRACT = VITE_ROACH_TOKEN_CONTRACT;
export default function Header({onWalletConnect}) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const BASE_MAINNET_ID = '8453';


  useEffect(() => {
    const checkWalletConnectionAndNetwork = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const networkId = await window.ethereum.request({ method: 'net_version' });
          if (accounts.length > 0 && networkId === BASE_MAINNET_ID) {
            setAccount(accounts[0]);
            setIsWalletConnected(true); // Wallet is connected and on the correct network
            onWalletConnect(true);
          } else if (networkId !== BASE_MAINNET_ID) {
            switchToBaseMainnet(); // Attempt to switch if not on Base mainnet
          }
        } catch (error) {
          console.error('Error checking wallet connection and network:', error);
        }
      }
    };

    const switchToBaseMainnet = async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${parseInt(BASE_MAINNET_ID, 10).toString(16)}` }],
        });
      } catch (error) {
        if (error.code === 4902) {
          console.error('Base mainnet not configured in MetaMask:', error);
        } else {
          console.error('Error switching to the Base mainnet:', error);
        }
      }
    };

    checkWalletConnectionAndNetwork();
  }, []);

  const connectWalletHandler = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await window.ethereum.request({ method: 'net_version' });
        if (accounts.length > 0 && networkId === BASE_MAINNET_ID) {
          setAccount(accounts[0]);
          setIsWalletConnected(true);
            onWalletConnect(true);
        } else if (networkId !== BASE_MAINNET_ID) {
          await switchToBaseMainnet();
        }
      } catch (error) {
        console.error('Error connecting to the wallet:', error);
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  return (
    <>
      <div className="hMain">
        <div className="container">
          <div className="text-xs">
          Roach Rally Token CA: { ROACH_TOKEN_CONTRACT}<br />
          </div>
          <div className="hIcon">
            <a href="/"><Logo /></a>
          </div>
          <div className="singIn">
            <a href="/" onClick={connectWalletHandler} className="walletConnectButton">
              {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'} <img src={user} alt="Wallet Icon" />
            </a>
            { isWalletConnected && <span className="text-sm">{account}</span> }
          </div>
        </div>
      </div>
    </>
  );
}

import roachTokenABI from  './roachTokenABI.json';
import roachManagerABI from  './roachManagerABI.json';
import { ethers, utils, BigNumber } from 'ethers';
import {useRoachStore } from "../store.js";

//const ROACH_CONTRACT = import.meta.env.VITE_ROACH_CONTRACT;
// const ROACH_TOKEN_CONTRACT = import.meta.env.VITE_ROACH_TOKEN_CONTRACT;
// const ROACH_MANAGER_CONTRACT = import.meta.env.VITE_ROACH_MANAGER_CONTRACT;
// const ROACH_FLIP_CONTRACT = import.meta.env.VITE_ROACH_FLIP_CONTRACT;
// const ROACH_RALLY_CONTRACT = import.meta.env.VITE_ROACH_RALLY_CONTRACT;
const VITE_ROACH_TOKEN_CONTRACT = "0x30ed6eb751Bb1f94a35256dd68B01D1D27B576A5"
const VITE_ROACH_RALLY_CONTRACT = "0x00819bFf8341f30743BfdF9f63EDA38E78c96434"
const VITE_ROACH_FLIP_CONTRACT = "0x5D7A8E777e74AF9d7A12FA7aee24B45c2a93E1FB"
const VITE_ROACH_MANAGER_CONTRACT = "0x6bc984bD80346EBF7680dd81ad7449d1A8688599"
const ROACH_MANAGER_CONTRACT = VITE_ROACH_MANAGER_CONTRACT;
const ROACH_TOKEN_CONTRACT = VITE_ROACH_TOKEN_CONTRACT;

async function deposit( amount, ethAmount, tgHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // First, add allowance for the contract to spend the token
    const address = await signer.getAddress();
    const roachContract = new ethers.Contract(ROACH_TOKEN_CONTRACT, roachTokenABI, signer);
    const allowance = await roachContract.allowance(address, ROACH_MANAGER_CONTRACT);
    // Convert the amount to wei
    amount = utils.parseEther(amount.toString());
    if (allowance.lt(amount)) {
        const approveTx = await roachContract.approve(ROACH_MANAGER_CONTRACT, amount);
        await approveTx.wait();
    }
    ethAmount = ethers.utils.parseEther(ethAmount.toString());
    const roachManagerContract = new ethers.Contract(ROACH_MANAGER_CONTRACT, roachManagerABI, signer);
    // const inBytes = ethers.utils.formatBytes32String(tgHash);
    const ret = await roachManagerContract.deposit( amount, tgHash, {value: ethAmount, gasLimit: 500_000});
    return ret;
 
}
async function getDepositedBalance( tgHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const roachManagerContract = new ethers.Contract(ROACH_MANAGER_CONTRACT, roachManagerABI, signer);
    const address = await signer.getAddress();
    // const inBytes = ethers.utils.formatBytes32String(tgHash);
    const ret = await roachManagerContract.balanceOf( address, tgHash.toString());
    return Math.round(parseInt(ethers.utils.formatEther(ret.toString()))*100)/100;
}

async function getDepositedBalanceETH(tgHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const roachManagerContract = new ethers.Contract(ROACH_MANAGER_CONTRACT, roachManagerABI, signer);
    const address = await signer.getAddress();
    // const inBytes = ethers.utils.formatBytes32String(tgHash);
    const ret = await roachManagerContract.balanceETHOf( address, tgHash.toString());
    return utils.formatEther(ret).substring(0,6);
}

async function withdraw(amount, tgHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // First, add allowance for the contract to spend the token
    const roachManagerContract = new ethers.Contract(ROACH_MANAGER_CONTRACT, roachManagerABI, signer);
    amount = ethers.utils.parseEther(amount.toString());
    // const inBytes = ethers.utils.formatBytes32String(tgHash);
    const ret = await roachManagerContract.withdraw( amount, tgHash.toString(),{gasLimit: 500_000});
    return ret;
}

async function withdrawETH(amountETH, tgHash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // First, add allowance for the contract to spend the token
    const roachManagerContract = new ethers.Contract(ROACH_MANAGER_CONTRACT, roachManagerABI, signer);
    amountETH = ethers.utils.parseEther(amountETH.toString());

    // const inBytes = ethers.utils.formatBytes32String(tgHash);
    const ret = await roachManagerContract.withdrawETH( amountETH, tgHash.toString(),{gasLimit: 500_000});
    return ret;
}
// Export the function
export { 
    deposit,
    withdraw,   
    withdrawETH,
    getDepositedBalanceETH,
    getDepositedBalance,

};
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
const VITE_ROACH_RALLY_CONTRACT = "0xA2b3174072FEd15A7C2599634a15dBeD12989096"
const VITE_ROACH_FLIP_CONTRACT = "0x87d7ac0669eef0753303ec24b19d4233d252eb05"
const VITE_ROACH_MANAGER_CONTRACT = "0x59B99595C4657e368649786228a16Dc68Dda9e3f"
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

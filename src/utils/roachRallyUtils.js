import roachRallyABI from  './roachRallyABI.json';
import roachTokenABI from  './roachTokenABI.json';
import { ethers, utils, BigNumber } from 'ethers';
import {useRoachStore } from "../store.js";

// const ROACH_CONTRACT = import.meta.env.VITE_ROACH_CONTRACT;
// const ROACH_TOKEN_CONTRACT = import.meta.env.VITE_ROACH_TOKEN_CONTRACT;
// const ROACH_MANAGER_CONTRACT = import.meta.env.VITE_ROACH_MANAGER_CONTRACT;
// const ROACH_FLIP_CONTRACT = import.meta.env.VITE_ROACH_FLIP_CONTRACT;
// const ROACH_RALLY_CONTRACT = import.meta.env.VITE_ROACH_RALLY_CONTRACT;

const VITE_ROACH_TOKEN_CONTRACT = "0x30ed6eb751Bb1f94a35256dd68B01D1D27B576A5"
const VITE_ROACH_RALLY_CONTRACT = "0x00819bFf8341f30743BfdF9f63EDA38E78c96434"
const VITE_ROACH_FLIP_CONTRACT = "0x5D7A8E777e74AF9d7A12FA7aee24B45c2a93E1FB"
const VITE_ROACH_MANAGER_CONTRACT = "0x6bc984bD80346EBF7680dd81ad7449d1A8688599"
const ROACH_RALLY_CONTRACT = VITE_ROACH_RALLY_CONTRACT;
const ROACH_TOKEN_CONTRACT = VITE_ROACH_TOKEN_CONTRACT;


async function simulateRewardsBeforeSponsor(roach, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    // Convert amount to wei
    amount = ethers.utils.parseEther(amount.toString());
    const simulateRewards = await contract.simulateRewardsBeforeSponsor(roach, amount, { gasLimit: 5_000_000 });
    return simulateRewards;
}
async function simulateRewards(roach) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    const simulateRewards = await contract.simulateRewards(roach, account, { gasLimit: 5_000_000 });
    return simulateRewards;
}

// Create a function to get the current round number
async function getCurrentRoundNumber() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    const roundNumber = await contract.getCurrentRoundNumber({ gasLimit: 5_000_000 });
    return roundNumber;
}

async function getRoachBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ROACH_TOKEN_CONTRACT, roachTokenABI, signer);
    const ret= await contract.balanceOf(await signer.getAddress());
    return Math.round(parseInt(ethers.utils.formatEther(ret.toString()))*100)/100;
}

async function getETHBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const ethBalance = await provider.getBalance(address)
    return utils.formatEther(ethBalance).substring(0,6);
}

async function getRoundData(roundNumber) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    const roundData = await contract.getRoundData(roundNumber, { gasLimit: 5_000_000 });
    return roundData;
}

async function sponsorRoach(roachId, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // First, add allowance for the contract to spend the token
    const roachContract = new ethers.Contract(ROACH_TOKEN_CONTRACT, roachTokenABI, signer);
    const allowance = await roachContract.allowance(signer.getAddress(), ROACH_RALLY_CONTRACT);
    const address = await signer.getAddress();

    // Convert the amount to wei
    amount = ethers.utils.parseEther(amount.toString());
    console.log("Roach token contract",ROACH_TOKEN_CONTRACT)
    if (allowance.lt(amount)) {
        const approveTx = await roachContract.approve(ROACH_RALLY_CONTRACT, amount, { gasLimit: 5_000_000 });
        await approveTx.wait();
    }

    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    console.log("Race contract",ROACH_RALLY_CONTRACT)
    const ret = await contract.sponsorRoach(roachId, amount, address, true, { gasLimit: 5_000_000 });
    return ret;
}

async function increaseSponsorRoach(amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // First, add allowance for the contract to spend the token
    const roachContract = new ethers.Contract(ROACH_TOKEN_CONTRACT, roachTokenABI, signer);
    const allowance = await roachContract.allowance(signer.getAddress(), ROACH_RALLY_CONTRACT);
    const address = await signer.getAddress();
    // Convert the amount to wei
    amount = ethers.utils.parseEther(amount.toString());
    console.log("Roach token contract",ROACH_TOKEN_CONTRACT)
    if (allowance.lt(amount)) {
        const approveTx = await roachContract.approve(ROACH_RALLY_CONTRACT, amount);
        await approveTx.wait();
    }

    const contract = new ethers.Contract(ROACH_RALLY_CONTRACT, roachRallyABI, signer);
    console.log("Race contract",ROACH_RALLY_CONTRACT)
    const ret = await contract.increaseSponsorRoach(amount, address, true, { gasLimit: 5_000_000 });
    return ret;
}

// Export the function
export { 
    getCurrentRoundNumber ,
    sponsorRoach,
    getRoundData,
    simulateRewards,
    simulateRewardsBeforeSponsor,
    getRoachBalance,
    getETHBalance,
    increaseSponsorRoach
};
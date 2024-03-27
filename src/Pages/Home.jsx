import { useEffect, useState, Fragment } from 'react'
import { ethers } from 'ethers';
import data from "../components/Chat/data.json";
import bets from "../components/BetSection/bets.js";
import Button from "../assets/Button";
import BetCard from "../components/BetSection/BetCard";
import CountDown from "../components/useCountDown";
import AskSponsor from "../components/BetSection/AskSponsor";
import CoinFlip from "../components/CoinFlip/CoinFlip";
import RoundEndDialog from "../components/RoundEndDialog";
import roachRallyABI from '../utils/roachRallyABI.json';
import { useRoachStore } from "../store.js";
import "./style.css";
// const ROACH_CONTRACT = import.meta.env.VITE_ROACH_RALLY_CONTRACT;
import {
  getCurrentRoundNumber,
  getRoundData,
  sponsorRoach,
  simulateRewards,
  simulateRewardsBeforeSponsor,
} from "../utils/roachRallyUtils.js";

const VITE_ROACH_TOKEN_CONTRACT = "0x30ed6eb751Bb1f94a35256dd68B01D1D27B576A5"
const VITE_ROACH_RALLY_CONTRACT = "0x00819bFf8341f30743BfdF9f63EDA38E78c96434"
const VITE_ROACH_FLIP_CONTRACT = "0x5D7A8E777e74AF9d7A12FA7aee24B45c2a93E1FB"
const VITE_ROACH_MANAGER_CONTRACT = "0x6bc984bD80346EBF7680dd81ad7449d1A8688599"
const ROACH_CONTRACT = VITE_ROACH_RALLY_CONTRACT;
export default function Home({ connected }) {
  console.log("I AM WORKING")
  const [isBetInputOpen, setBetInputIsOpen] = useState(false);
  const [betRoach, setBetRoach] = useState(0);
  const [roachID, setRoachID] = useState(0);
  const [betAmount, setBetAmount] = useState(0.01);
  const [roundNumber, setRoundNumber] = useState(0);
  const [roachTotals, setRoachTotals] = useState({});
  const [roachParticipants, setRoachParticipants] = useState({});
  const [roundEndData, setRoundEndData] = useState(null);
  const [showRoundEndDialog, setShowRoundEndDialog] = useState(false);
  const [askBetBusy, setAskSponsorBusy] = useState(false);
  const [simulatedRewards, setSimulatedRewards] = useState(null);
  const roaches = useRoachStore((state) => state.roaches);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  //TODO: view roach sponsors if not connected
  const defaultProvider = new ethers.providers.JsonRpcProvider("https://developer-access-mainnet.base.org", 0x2105);
  const defaultWallet = ethers.Wallet.createRandom().connect(defaultProvider)
  const defaultAddress = defaultWallet.address;

  const signer = provider.getSigner();
  const contract = new ethers.Contract(ROACH_CONTRACT, roachRallyABI, signer);

  contract.on("NewSponsor", (addr, roach, round, amount, event) => {
    console.log(`New Sponsor Detected`);
    // Just get the new round data, don't try to merge or anything fancy.
    getRoundData(roundNumber).then((res) => {
      setRoachTotals({
        "1": ethers.utils.formatEther(res.roach1Total.toString()),
        "2": ethers.utils.formatEther(res.roach2Total.toString()),
        "3": ethers.utils.formatEther(res.roach3Total.toString()),
        "4": ethers.utils.formatEther(res.roach4Total.toString()),
      })
      setRoachParticipants({
        "1": res.roach1Participants.toString(),
        "2": res.roach2Participants.toString(),
        "3": res.roach3Participants.toString(),
        "4": res.roach4Participants.toString()
      })
    })
  });
  contract.on("RoundEnd", (roundNumber, winnerRoach, totalWinnerSponsors, totalLoserSponsors, numberOfWinners, numberOfLosers) => {
    debugger
    console.log(`Round End Detected: `);
    // Additional logic to handle the event
    setRoundEndData({
      roundNumber,
      winnerRoach: winnerRoach.toString(),
      totalWinnerSponsors: ethers.utils.formatEther(totalWinnerSponsors.toString()),
      totalLoserSponsors: ethers.utils.formatEther(totalLoserSponsors.toString()),
      numberOfWinners: numberOfWinners.toString(),
      numberOfLosers: numberOfLosers.toString(),
    });
    setShowRoundEndDialog(true);
  });


  useEffect(() => {
    if (connected) {
      getCurrentRoundNumber().then((result) => {
        setRoundNumber(result);
      })
    }
  }, [connected]);
  useEffect(() => {

    if (roundNumber > 0) {
      /*
      simulateRewards(2).then((res) => {
        debugger
        console.log("Simulated Rewards",res)
        setSimulatedRewards({
          sponsored : ethers.utils.formatEther(res.amountSponsored.toString()),
          reward : ethers.utils.formatEther(res.reward.toString())
        })
      })
      */
      getRoundData(roundNumber).then((res) => {
        setRoachTotals({
          "1": ethers.utils.formatEther(res.roach1Total.toString()),
          "2": ethers.utils.formatEther(res.roach2Total.toString()),
          "3": ethers.utils.formatEther(res.roach3Total.toString()),
          "4": ethers.utils.formatEther(res.roach4Total.toString()),
        })
        setRoachParticipants({
          "1": res.roach1Participants.toString(),
          "2": res.roach2Participants.toString(),
          "3": res.roach3Participants.toString(),
          "4": res.roach4Participants.toString()
        })
      })
    }

  }, [roundNumber])

  const openBetDialog = (event, id) => {
    setRoachID(id);
    setBetInputIsOpen(true);
  };

  const closeRoundEndDialog = () => {
    setShowRoundEndDialog(false)
  }
  const closeAskSponsorDialog = () => {
    setBetInputIsOpen(false)
  }

  const onBet = (amount) => {
    setAskSponsorBusy(true);
    sponsorRoach(roachID, amount).then((res) => {
      setAskSponsorBusy(false);
      setBetInputIsOpen(false)
      alert("Your bet has been placed!")
    }).catch(err => {
      setAskSponsorBusy(false);
      debugger
      alert(err.reason)
    })
  }

  return (
    <>
      <RoundEndDialog open={showRoundEndDialog} close={closeRoundEndDialog} winner={roundEndData} />
      <AskSponsor open={isBetInputOpen} close={closeAskSponsorDialog} onBet={onBet} busy={askBetBusy} roach={roachID} />
      <div className="mainContent">
        <div className="container">
          <div className="cardmainwrap">

            <div className="heroVideo hide-on-mobile">
  <iframe
    src="https://player.twitch.tv/?channel=roachrally&parent=www.roachrallyraces.xyz"
    height="600"
    width="100%"
    allowFullScreen={true}>
  </iframe>
</div>

            <div className="w-3/4 mx-auto block mt-4">
              <h2 className="text-2xl text-center">Round number #{roundNumber}</h2>
              <div className="text-center">
                {simulatedRewards != null && (
                  <div>
                    Your sponsor: {simulatedRewards.sponsored}<br />
                    Possible reward: {simulatedRewards.reward}
                  </div>
                )
                }
              </div>
            </div>

            {/*<CountDown
              time={{ hrs: 4, min: 20, sec: 40 }}
              text={"Sponsor Now, Race Starts in"}
            />*/}
            <div className="cards">
              {bets.map((bet) => (
                <BetCard key={bet.name} data={bet} total={roachTotals[bet.id]} participants={roachParticipants[bet.id]} addBet={openBetDialog} />
              ))}
            </div>
          </div>
          <div className="chatwrap my-2">
            <h1 className="font-bold text-lg mb-2">Deposit / Withdraw to Roach Manager</h1>
            <div className="">
              <CoinFlip connected={connected} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

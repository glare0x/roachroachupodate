import React,{useCallback, useState, useEffect } from 'react';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import { 
    getDepositedBalance,
    getDepositedBalanceETH,
} from "../../utils/roachManagerUtils";
import { 
    getRoachBalance,
    getETHBalance
} from "../../utils/roachRallyUtils";

const CoinFlip = ({connected}) => {
    const [handle, setHandle] = useState("")
    const [balance, setBalance] = useState(0)
    const [balanceETH, setBalanceETH] = useState(0)
    const [depositedBalance, setDepositedBalance] = useState(0)
    const [depositedBalanceETH, setDepositedBalanceETH] = useState(0)

    useEffect(() => {
        if (connected) {
            getRoachBalance().then((balance) => {
                setBalance(balance)
            })

            getETHBalance().then((balance) => {
                setBalanceETH(balance)
            })
        }
    },[connected]);

    
    useEffect(() => {
        if (handle != "") {
            verify(handle)
        }
    },[handle]);
    
    const debounce = (cb, delay) => {
        let timerId;
        return (...args) => {
            if (timerId) clearTimeout(timerId);
            timerId = setTimeout(() => {
                cb(...args);
            }, delay);
        };
    }

  const verify = useCallback(
    debounce(name => {
            if(name.length == 66) {
                getDepositedBalance(name).then((balance) => {
                    setDepositedBalance(balance)
                })
                getDepositedBalanceETH(name).then((balance) => {
                    setDepositedBalanceETH(balance)
                })
            } else {
                //TODO Throw invalid hash length
            }
      console.log(name);
    }, 400),
    []
  );
    return (
        <div>
            {connected && (
                <div>
                    <p>Go to https://t.me/Roachrally_bot to obtain your telegram hash</p>
                    <br></br>
                    <p>Provide the telegram hash you received from one of the ROACH bots</p>
                    <input className="text-black border rounded-lg px-8 py-2 w-full my-2" type="text" value={handle} onChange={e => setHandle(e.target.value)} />

                    <div className="flex justify-between">
                        <div className="text-xs">
                            Wallet ROACH Balance: {balance}
                        </div>
                        <div className="text-xs">
                            Wallet ETH Balance: {balanceETH}
                        </div>

                        <br></br>
                        
                        <div className="text-xs">
                            Deposited ROACH: {depositedBalance}
                        </div>

                        <div className="text-xs">
                            Deposited ETH: {depositedBalanceETH}
                        </div>
                    </div>

                    <Deposit tgHash={handle} connected={connected} />
                    <Withdraw tgHash={handle} connected={connected} />
                </div>
            )}
            {!connected && (
                <h1>Connect your wallet to start</h1>
            )}
        </div>
    );
};

export default CoinFlip;
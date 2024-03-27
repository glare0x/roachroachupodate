import React,{useState, useEffect } from 'react';
import { 
    withdraw,
    withdrawETH,
    getDepositedBalance,
    getDepositedBalanceETH
} from "../../utils/roachManagerUtils";
import { connected } from 'process'

const Withdraw = ({tgHash, connected}) => {
    const [withdrawAmount , setWithdrawAmount] = useState(0)
    const [withdrawAmountETH, setWithdrawAmountETH] = useState(0)
    const [balance, setBalance] = useState(0)
    const [balanceETH, setBalanceETH] = useState(0)
    const [busy, setBusy] = useState(false)
    useEffect(() => {
        console.log(tgHash, "tgHashConnected?", connected)
        if (connected) {
            getDepositedBalance(tgHash).then((balance) => {
                setBalance(balance)
            })
            getDepositedBalanceETH(tgHash).then((balance) => {
                setBalanceETH(balance)
            })
        }
    },[connected]);
    const onWithdraw = async (amount ) => {
        //todo: require both not 0 && < deposited
        await withdraw(amount, tgHash)
    }
    const onWithdrawEth = async (amountEth ) => {
        //todo: require both not 0 && < deposited
        await withdrawETH(amountEth, tgHash)
    }
    const useMax = () => {
        return setWithdrawAmount(balance)
    }
    const useMaxETH = () => {
        return setWithdrawAmountETH(balanceETH)
    }
    return (
        <div>
            <h1 className="text-2xl font-bold my-1 uppercase">Withdraw</h1>
            <p>Withdraw tokens from the Roach Manager</p>
            <br></br>
            <h1>Withdraw ROACH</h1>
            <div className="flex justify-between">
                <input className="text-black border rounded-lg px-8 py-2 w-full my-2" type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                <button onClick={useMax} className=" w-full justify-center rounded-md bg-red-600 px-3 py-0 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Max</button>
            </div>

            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                disabled={busy}
                onClick={() => onWithdraw(withdrawAmount)}
            >
                {busy ? 'withdrawing...' : 'withdraw'}
            </button>

            <br>
            </br>
            <br>
            </br>
            <h1>Withdraw ETH</h1>
            <div className="flex justify-between">
                <input className="text-black border rounded-lg px-8 py-2 w-full my-2" type="number" value={withdrawAmountETH} onChange={e => setWithdrawAmountETH(e.target.value)} />
                <button onClick={useMaxETH} className=" w-full justify-center rounded-md bg-red-600 px-3 py-0 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Max</button>
            </div>

            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                disabled={busy}
                onClick={() => onWithdrawEth(withdrawAmountETH  )}
            >
                {busy ? 'withdrawing...' : 'withdraw'}
            </button>

        </div>
    );
};

export default Withdraw;
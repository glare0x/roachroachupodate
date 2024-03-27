import React,{useState, useEffect } from 'react';
import { 
    deposit
} from "../../utils/roachManagerUtils";
import { getRoachBalance } from '../../utils/roachRallyUtils';

const Deposit = ({tgHash, connected}) => {
    const [depositAmount , setDepositAmount] = useState(0)
    const [depositAmountETH , setDepositAmountETH] = useState(0)
    const [balance, setBalance] = useState(0)
    const [busy, setBusy] = useState(false)
    const useMax = () => {
        return setDepositAmount(balance, tgHash)
    }
    const onDeposit = async (amount) => {
        //todo: require both not 0
        deposit(depositAmount, depositAmountETH, tgHash)
        .then(ret => {
            debugger
        })
    }

    useEffect(() => {
        console.log(tgHash, "tgHashConnected?", connected)
        if (connected) {
            getRoachBalance().then((balance) => {
                setBalance(balance)
            })
        }
    },[connected]);

    return (
        <div className="mb-8">
            <br></br>
            <h1 className="text-2xl font-bold my-1 uppercase">Deposit</h1>
            <p>Deposit tokens in the Roach Manager</p>
            <br></br>
            <p>Deposit amount </p>
            <div className="flex justify-between">
                <input className="text-black border rounded-lg px-8 py-2 w-full my-2" type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                <button onClick={useMax} className=" w-full justify-center rounded-md bg-red-600 px-3 py-0 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Max</button>
            </div>
            <p>Deposit amount ETH (for transaction costs) </p>
            <div className="flex justify-between">
                <input className="text-black border rounded-lg px-8 py-2 w-full my-2" type="number" value={depositAmountETH} onChange={e => setDepositAmountETH(e.target.value)} />
            </div>

            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                disabled={busy}
                onClick={() => onDeposit()}
            >
                {busy ? 'Depositing...' : 'Deposit'}
            </button>

        </div>
    );
};

export default Deposit;
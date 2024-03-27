import BetData from "./BetData";
// import { Hamster } from "../../assets/Images";
export default function ({ data ,addBet , total, participants, simulatedRewards }) {
  const { name, betsData, link, Img } = data;
  return (
    <div>
      <h2>{name}</h2>
      <Img />
      <button onClick={() => addBet(this,data.id)}>Sponsor</button>
      <div className="cardslistWrap">
        <div className="card-list">
            <BetData total={total} participants={participants}  />
        </div>
      </div>
    </div>
  );
}

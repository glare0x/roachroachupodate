import React from "react"
import { BUSD } from "../../assets/Images"

export default function BetData({ total, participants }) {
  //const { house, amount, ratio } = data;
  return (
    <div>
      <div>
        <span className="flex">
          Total {" "}
          {total || 0} ROACH{" "}
        </span>
      </div>
      <div style={{ color: "rgb(69, 228, 174) " }}>
        {" "}
        <span>{participants || 0} sponsor(s)</span>
      </div>



    </div>
  )
}

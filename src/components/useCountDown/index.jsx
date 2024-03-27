import React, { useState, useRef, useEffect, useCallback } from "react";

const App = ({ time, text }) => {
  const { hrs, min, sec } = time;
  const Ref = useRef(null);
  const formattedTime = useCallback(
    (h, m, s) =>
      `${h > 9 ? h : `0${h}`}:${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`,
    []
  );
  const [timer, setTimer] = useState(formattedTime(hrs, min, sec));

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(formattedTime(hours, minutes, seconds));
    }
  };

  const clearTimer = (e) => {
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + hrs * 60 * 60 + min * 60 + sec);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  return <div className="counter"><h2>{`${text} ${timer}`}</h2></div>;
  {
    /* <button
        onClick={() => {
          clearTimer(getDeadTime());
        }}
      >
        Reset
      </button> */
  }
};

export default App;

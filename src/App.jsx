import "./App.css";
import Home from "./Pages/Home";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
export default function () {
  const [walletConnected, setWalletConnected] = useState(false);
  const onWalletConnect = (isConnected) => {
    setWalletConnected(isConnected);
  }
  return (
    <>
      <Header onWalletConnect={onWalletConnect}/>
      <Routes>
        <Route path="/" element={<Home connected={walletConnected} />}>
          <Route index element={<Home connected={walletConnected} />} />
        </Route>
      </Routes>
    </>
  );
}

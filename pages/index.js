import { useState, useEffect } from "react";

export default function Home() {
  const [xauPrice, setXauPrice] = useState(4510.5);
  const [mgcPrice, setMgcPrice] = useState(45.10);

  let signal = "WAIT";
  let confidence = 70;
  let entry = "--";
  let sl = "--";
  let tp = "--";
  let risk = "NO TRADE";

  if (xauPrice > 4500) {
    signal = "BUY";
    confidence = 85;
    entry = xauPrice;
    sl = xauPrice - 10;
    tp = xauPrice + 20;
    risk = "SMALL RISK";
  }

  if (signal === "BUY" || signal === "SELL") {
    fetch(
      https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${signal} XAUUSD ${confidence}% Entry:${entry} SL:${sl} TP:${tp}
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Admy Gold AI Dashboard</h1>
      <h2>XAU/USD: {xauPrice}</h2>
      <h2>MGC: {mgcPrice}</h2>
      <h1>{signal}</h1>
      <h2>Confidence: {confidence}%</h2>
      <h3>Entry: {entry}</h3>
      <h3>Stop Loss: {sl}</h3>
      <h3>Take Profit: {tp}</h3>
      <h3>Risk: {risk}</h3>
    </div>
  );
}
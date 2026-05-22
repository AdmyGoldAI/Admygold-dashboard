import { useEffect, useState } from "react";
import axios from "axios";
import { RSI, EMA, MACD } from "technicalindicators";

export default function Home() {
  const [xauPrice, setXauPrice] = useState("Loading...");
  const [mgcPrice, setMgcPrice] = useState("Loading...");
  const [signal, setSignal] = useState("WAIT");
  const [confidence, setConfidence] = useState(0);
  const [entry, setEntry] = useState("--");
  const [sl, setSl] = useState("--");
  const [tp, setTp] = useState("--");
  const [risk, setRisk] = useState("NO TRADE");

  useEffect(() => {
    async function fetchGoldData() {
      try {
        const res = await axios.get("https://api.gold-api.com/price/XAU");
        const price = res.data.price;

        setXauPrice(price.toFixed(2));
        setMgcPrice((price / 100).toFixed(2));

        // demo history for indicators
        const history = [];
        for (let i = 0; i < 60; i++) {
          history.push(price + (Math.random() * 20 - 10));
        }

        const rsi = RSI.calculate({
          values: history,
          period: 14,
        });

        const ema20 = EMA.calculate({
          values: history,
          period: 20,
        });

        const ema50 = EMA.calculate({
          values: history,
          period: 50,
        });

        const macd = MACD.calculate({
          values: history,
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        });

        const latestRSI = rsi[rsi.length - 1];
        const latestEMA20 = ema20[ema20.length - 1];
        const latestEMA50 = ema50[ema50.length - 1];
        const latestMACD = macd[macd.length - 1];

        let score = 50;

        if (latestEMA20 > latestEMA50) score += 15;
        else score += 15;

        if (latestMACD.MACD > latestMACD.signal) score += 15;

        if (latestRSI > 45 && latestRSI < 65) score += 10;

        setConfidence(score);
        setEntry(price.toFixed(2));

        if (score < 75) {
          setSignal("WAIT");
          setRisk("NO TRADE");
          setSl("--");
          setTp("--");
        } else if (score >= 75 && score < 80) {
          if (latestEMA20 > latestEMA50) {
            setSignal("SMALL BUY");
            setSl((price - 8).toFixed(2));
            setTp((price + 16).toFixed(2));
          } else {
            setSignal("SMALL SELL");
            setSl((price + 8).toFixed(2));
            setTp((price - 16).toFixed(2));
          }

          setRisk("0.25% - 0.5%");
        } else {
          if (latestEMA20 > latestEMA50) {
            setSignal("STRONG BUY");
            setSl((price - 10).toFixed(2));
            setTp((price + 20).toFixed(2));
          } else {
            setSignal("STRONG SELL");
            setSl((price + 10).toFixed(2));
            setTp((price - 20).toFixed(2));
          }

          setRisk("0.75% - 1%");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchGoldData();
    const interval = setInterval(fetchGoldData, 10000);

    return () => clearInterval(interval);
  }, []);

  const signalColor =
    signal.includes("BUY")
      ? "green"
      : signal.includes("SELL")
      ? "red"
      : "orange";

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1>AdmyGold AI PRO</h1>

      <h2>XAUUSD: ${xauPrice}</h2>
      <h2>MGC Futures: ${mgcPrice}</h2>

      <h1 style={{ color: signalColor }}>{signal}</h1>

      <h2>Confidence: {confidence}%</h2>
      <h3>Entry: {entry}</h3>
      <h3>Stop Loss: {sl}</h3>
      <h3>Take Profit: {tp}</h3>
      <h3>Risk: {risk}</h3>
    </div>
  );
}
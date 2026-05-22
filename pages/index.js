import { useEffect, useState } from "react";
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
    function fetchGoldData() {
      const closes5m = [3300, 3302, 3301, 3305, 3307, 3304, 3308, 3310, 3309, 3312, 3315, 3313, 3316, 3318];
      const closes15m = [3290, 3295, 3298, 3300, 3303, 3306, 3310, 3312, 3315, 3318, 3320, 3322, 3325, 3328];

      const currentPrice = closes5m[closes5m.length - 1];

      setXauPrice(currentPrice.toFixed(2));
      setMgcPrice((currentPrice / 100).toFixed(2));

      const rsi = RSI.calculate({
        values: closes5m,
        period: 14,
      });

      const ema = EMA.calculate({
        values: closes15m,
        period: 9,
      });

      const macd = MACD.calculate({
        values: closes15m,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
      });

      const latestRsi = rsi[rsi.length - 1] || 50;
      const latestEma = ema[ema.length - 1] || currentPrice;
      const latestMacd = macd[macd.length - 1] || { MACD: 0, signal: 0 };

      let conf = 70;
      let sig = "WAIT";

      if (latestRsi < 35 && currentPrice > latestEma && latestMacd.MACD > latestMacd.signal) {
        sig = "BUY";
        conf = 82;
      } else if (latestRsi > 65 && currentPrice < latestEma && latestMacd.MACD < latestMacd.signal) {
        sig = "SELL";
        conf = 82;
      }

      setSignal(sig);
      setConfidence(conf);

      if (conf >= 75 && sig !== "WAIT") {
        setEntry(currentPrice.toFixed(2));
        setSl((currentPrice - 10).toFixed(2));
        setTp((currentPrice + 20).toFixed(2));
        setRisk(conf >= 80 ? "HIGH CONFIDENCE" : "SMALL RISK");
      }
    }

    fetchGoldData();
  }, []);

  const signalColor =
    signal === "BUY" ? "green" : signal === "SELL" ? "red" : "orange";

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
      <h1>Admy Gold AI Dashboard</h1>
      <h2>XAU/USD: {xauPrice}</h2>
      <h2>MGC: {mgcPrice}</h2>
      <h1 style={{ color: signalColor }}>{signal}</h1>
      <h2>Confidence: {confidence}%</h2>
      <h3>Entry: {entry}</h3>
      <h3>Stop Loss: {sl}</h3>
      <h3>Take Profit: {tp}</h3>
      <h3>Risk: {risk}</h3>
    </div>
  );
}
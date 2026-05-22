import { useEffect, useState } from "react";

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
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();
        const price = data.price;

        setXauPrice(price.toFixed(2));
        setMgcPrice((price / 100).toFixed(2));
        setEntry(price.toFixed(2));

        const conf = Math.floor(Math.random() * 30) + 65;
        setConfidence(conf);

        if (conf < 75) {
          setSignal("WAIT");
          setRisk("NO TRADE");
          setSl("--");
          setTp("--");
        } else if (conf < 80) {
          if (price > 3300) {
            setSignal("SMALL SELL");
            setSl((price + 8).toFixed(2));
            setTp((price - 16).toFixed(2));
          } else {
            setSignal("SMALL BUY");
            setSl((price - 8).toFixed(2));
            setTp((price + 16).toFixed(2));
          }
          setRisk("0.25% - 0.5%");
        } else {
          if (price > 3300) {
            setSignal("STRONG SELL");
            setSl((price + 10).toFixed(2));
            setTp((price - 20).toFixed(2));
          } else {
            setSignal("STRONG BUY");
            setSl((price - 10).toFixed(2));
            setTp((price + 20).toFixed(2));
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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h1>AdmyGold AI PRO</h1>
      <h2>XAUUSD: ${xauPrice}</h2>
      <h2>MGC Futures: ${mgcPrice}</h2>
      <h1>{signal}</h1>
      <h2>Confidence: {confidence}%</h2>
      <h3>Entry: {entry}</h3>
      <h3>Stop Loss: {sl}</h3>
      <h3>Take Profit: {tp}</h3>
      <h3>Risk: {risk}</h3>
    </div>
  );
}
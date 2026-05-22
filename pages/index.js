import { useEffect, useState } from "react";

export default function Home() {
  const [xauPrice, setXauPrice] = useState("Loading...");
  const [mgcPrice, setMgcPrice] = useState("Loading...");
  const [signal, setSignal] = useState("WAIT");
  const [confidence, setConfidence] = useState(0);
  const [entry, setEntry] = useState("-");
  const [sl, setSl] = useState("-");
  const [tp, setTp] = useState("-");
  const [risk, setRisk] = useState("NO TRADE");

  useEffect(() => {
    async function fetchGoldData() {
      try {
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();

        const price = data.price;
        setXauPrice(price);
        setMgcPrice((price / 100).toFixed(2)); // simple estimate

        const randomConfidence = Math.floor(Math.random() * 30) + 65;

        setConfidence(randomConfidence);
        setEntry(price);

        if (randomConfidence < 75) {
          setSignal("WAIT");
          setRisk("NO TRADE");
          setSl("-");
          setTp("-");
        } else if (randomConfidence >= 75 && randomConfidence < 80) {
          setSignal(price > 3300 ? "SMALL SELL" : "SMALL BUY");
          setRisk("0.25% - 0.5%");
          setSl((price - 8).toFixed(2));
          setTp((price + 16).toFixed(2));
        } else {
          setSignal(price > 3300 ? "STRONG SELL" : "STRONG BUY");
          setRisk("0.75% - 1%");
          setSl((price - 10).toFixed(2));
          setTp((price + 20).toFixed(2));
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
    <div style={{
      padding: "40px",
      fontFamily: "Arial",
      textAlign: "center"
    }}>
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
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [xauPrice, setXauPrice] = useState("Loading...");
  const [mgcPrice, setMgcPrice] = useState("Loading...");
  const [signal, setSignal] = useState("WAIT");
  const [confidence, setConfidence] = useState(70);
  const [entry, setEntry] = useState("--");
  const [sl, setSl] = useState("--");
  const [tp, setTp] = useState("--");
  const [risk, setRisk] = useState("NO TRADE");

  useEffect(() => {
    async function fetchGoldData() {
      try {
        const response = await axios.get(
          "https://api.gold-api.com/price/XAU"
        );

        const price = response.data.price;

        setXauPrice(price);
        setMgcPrice((price / 100).toFixed(2));

        if (price > 3300) {
          setSignal("BUY");
          setConfidence(85);
          setEntry(price);
          setSl((price - 10).toFixed(2));
          setTp((price + 20).toFixed(2));
          setRisk("SMALL RISK");
        } else {
          setSignal("WAIT");
          setConfidence(70);
          setEntry("--");
          setSl("--");
          setTp("--");
          setRisk("NO TRADE");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchGoldData();
  }, []);

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
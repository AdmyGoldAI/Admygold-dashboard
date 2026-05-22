import { useEffect, useState } from "react";

export default function Home() {
  const [price, setPrice] = useState("Loading...");
  const [signal, setSignal] = useState("WAIT");

  useEffect(() => {
    async function fetchGold() {
      try {
        const res = await fetch("https://api.gold-api.com/price/XAU");
        const data = await res.json();

        setPrice(data.price);

        if (data.price > 3300) {
          setSignal("SELL");
        } else {
          setSignal("BUY");
        }
      } catch (error) {
        setPrice("Error");
        setSignal("NO DATA");
      }
    }

    fetchGold();
    const interval = setInterval(fetchGold, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
      <h1>AdmyGold AI Dashboard</h1>
      <h2>Live Gold Price: ${price}</h2>
      <h1>{signal}</h1>
    </div>
  );
}
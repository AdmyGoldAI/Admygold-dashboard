import { useEffect, useState } from "react";
import yahooFinance from "yahoo-finance2";
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
        const data5m = await yahooFinance.chart("GC=F", {
          interval: "5m",
          range: "5d",
        });

        const data15m = await yahooFinance.chart("GC=F", {
          interval: "15m",
          range: "5d",
        });

        const closes5m = data5m.quotes.map((q) => q.close).filter(Boolean);
        const closes15m = data15m.quotes.map((q) => q.close).filter(Boolean);

        const currentPrice = closes5m[closes5m.length - 1];

        setXauPrice(currentPrice.toFixed(2));
        setMgcPrice((currentPrice / 100).toFixed(2));

        const rsi = RSI.calculate({
          values: closes5m,
          period: 14,
        });

        const ema20 = EMA.calculate({
          values: closes5m,
          period: 20,
        });

        const ema50 = EMA.calculate({
          values: closes5m,
          period: 50,
        });

        const ema15Trend = EMA.calculate({
          values: closes15m,
          period: 20,
        });

        const macd = MACD.calculate({
          values: closes5m,
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
        const latest15Trend = ema15Trend[ema15Trend.length - 1];
        const current15 = closes15m[closes15m.length - 1];

        let score = 50;

        const bullish = latestEMA20 > latestEMA50;
        const bearish = latestEMA20 < latestEMA50;

        if (bullish || bearish) score += 10;

        if (latestMACD.MACD > latestMACD.signal) score += 15;

        if (latestRSI > 45 && latestRSI < 65) score += 15;

        if (current15 > latest15Trend && bullish) score += 15;

        if (current15 < latest15Trend && bearish) score += 15;

        setConfidence(score);
        setEntry(currentPrice.toFixed(2));

        if (score < 75) {
          setSignal("WAIT");
          setRisk("NO TRADE");
          setSl("--");
          setTp("--");
        } else if (score < 80) {
          if (bullish) {
            setSignal("SMALL BUY");
            setSl((currentPrice - 8).toFixed(2));
            setTp((currentPrice + 16).toFixed(2));
          } else {
            setSignal("SMALL SELL");
            setSl((currentPrice + 8).toFixed(2));
            setTp((currentPrice - 16).toFixed(2));
          }
          setRisk("0.25% - 0.5%");
        } else {
          if (bullish) {
            setSignal("STRONG BUY");
            setSl((currentPrice - 10).toFixed(2));
            setTp((currentPrice + 20).toFixed(2));
          } else {
            setSignal("STRONG SELL");
            setSl((currentPrice + 10).toFixed(2));
            setTp((currentPrice - 20).toFixed(2));
          }
          setRisk("0.75% - 1%");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchGoldData();
    const interval = setInterval(fetchGoldData, 60000);

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
      <h1>AdmyGold AI PRO REAL</h1>

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
export default function Home() {
  const xauPrice = 3345;
  const mgcPrice = 3348;
  const signal = "BUY";
  const confidence = 82;
  const entry = 3344;
  const sl = 3338;
  const tp = 3355;
  const risk = "LOW";

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
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
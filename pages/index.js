s

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
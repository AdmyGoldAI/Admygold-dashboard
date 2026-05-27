export default async function Home() {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: "🚨 TEST ALERT BUY"
    })
  });

  return (
    <div>
      <h1>Telegram Test</h1>
    </div>
  );
}
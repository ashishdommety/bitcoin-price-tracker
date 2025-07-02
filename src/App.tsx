import "./App.css";
import { useEffect, useState } from "react";
import fetchBitcoinStartingPrice from "./api";
import { SkewLoader } from "react-spinners";

const App = () => {
  const [price, newPrice] = useState<number | null>(null);
  const [startingPrice, setStartingPrice] = useState<number | null>(null);

  useEffect(() => {
    const getPrice = async () => {
      const morningPrice = await fetchBitcoinStartingPrice();
      if (morningPrice !== undefined) {
        setStartingPrice(morningPrice);
      }
    };

    getPrice();

    // https://www.bitstamp.net/websocket/v2/
    const socket = new WebSocket("wss://ws.bitstamp.net");

    socket.onopen = () => {
      const tradesMsg = {
        event: "bts:subscribe",
        data: {
          channel: "live_trades_btcusd",
        },
      };

      socket.send(JSON.stringify(tradesMsg));
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.channel === "live_trades_btcusd" && data.event === "trade") {
        const tradePrice = data.data.price;
        newPrice(tradePrice);
      }
    };
  }, []);

  const isProfit: boolean =
    !!price && !!startingPrice && price > startingPrice ? true : false;

  const getProfitOrLoss = (): string | null => {
    if (price && startingPrice) {
      const difference = (startingPrice - price).toFixed(2);
      return `$${difference}`;
    }
    return null;
  };

  return (
    <>
      <div className="content">
        <h2>This morning Bitcoin was: ${startingPrice}</h2>
        {price ? (
          <>
            <h1>
              Live Price: $
              <span style={{ textDecoration: "underline" }}>{price}</span>
            </h1>
            <h2>
              Difference:{" "}
              <span style={isProfit ? { color: "green" } : { color: "red" }}>
                {isProfit ? "" : "-"}
                {getProfitOrLoss()}
                {isProfit ? " 😃" : " 🙁"}
              </span>
            </h2>
          </>
        ) : (
          <div style={{ display: "flex", color: "white", margin: "0px auto" }}>
            <span style={{ color: "white" }}>
              Loading live price <SkewLoader color="white" size={10} />
            </span>
          </div>
        )}
      </div>
      <footer style={{ textAlign: "center" }}>
        <p>
          * Data pulled from <a href="https://www.bitstamp.net/">bitstamp's</a>{" "}
          live trades and <a href="https://www.coingecko.com/">coingecko</a> for
          starting price this morning
        </p>
      </footer>
    </>
  );
};

export default App;

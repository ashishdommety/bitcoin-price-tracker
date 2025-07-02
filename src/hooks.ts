import { useState, useEffect } from "react";
import fetchBitcoinStartingPrice from "./api";

export const useBitcoinPrice = () => {
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

      if (data.channel === "live_trades_btcusd" && data.event === "trade") {
        const tradePrice = data.data.price;
        newPrice(tradePrice);
      }
    };
  }, []);

  return { livePrice: price, startingPrice };
};

const fetchBitcoinStartingPrice = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
    );
    const data = await response.json();
    return data.prices[0][1].toFixed(2);
  } catch (error) {
    console.error(error);
  }
};

export default fetchBitcoinStartingPrice;

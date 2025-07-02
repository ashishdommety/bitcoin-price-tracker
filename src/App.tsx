import "./App.css";
import { SkewLoader } from "react-spinners";
import { useBitcoinPrice } from "./hooks";

const App = () => {
  const { livePrice, startingPrice } = useBitcoinPrice();

  const isProfit: boolean =
    !!livePrice && !!startingPrice && livePrice > startingPrice ? true : false;

  const getProfitOrLoss = (): string | null => {
    if (livePrice && startingPrice) {
      const difference = (livePrice - startingPrice).toFixed(2);
      return `$${difference}`;
    }
    return null;
  };

  return (
    <>
      <div className="content">
        <h2>This morning Bitcoin was: ${startingPrice}</h2>
        {livePrice ? (
          <>
            <h1>
              Live Price: $
              <span style={{ textDecoration: "underline" }}>{livePrice}</span>
            </h1>
            <h2>
              Difference:{" "}
              <span style={isProfit ? { color: "green" } : { color: "red" }}>
                {isProfit ? "+" : "-"}
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

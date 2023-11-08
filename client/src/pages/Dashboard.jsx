import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useLoaderData, Link } from "react-router-dom";
import {
  List,
  ListItem,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

function hotlist(market, portfolio, choice, script) {
  if (choice === "market") {
    market.sort((a, b) => b.changePercent - a.changePercent);
    const top2 = market.slice(0, 2);
    const losers = market.slice(-2);
    const bottom2 = losers.reverse();
    return { top2, bottom2 };
  } else {
    const profitLoss = [];
    for (let i = 0; i < portfolio.length; ++i) {
      profitLoss.push({
        label: portfolio[i].symbol,
        prolos: (script[i] - portfolio[i].avgPrice) * portfolio[i].quantity,
      });
    }
    profitLoss.sort((a, b) => b.prolos - a.prolos);

    const best = profitLoss[0];
    const worst = profitLoss[profitLoss.length - 1];

    const top = market.find((stock) => stock.symbol === best.label);
    const bottom = market.find((stock) => stock.symbol === worst.label);

    const topWithProlos = { ...top, prolos: best.prolos };
    const bottomWithProlos = { ...bottom, prolos: worst.prolos };

    return { top: topWithProlos, bottom: bottomWithProlos };
  }
}

export function Dashboard() {
  const { indicesData, portfolio, transactions, marketData, scriptData } =
    useLoaderData();
  const { top2, bottom2 } = hotlist(marketData, portfolio.stocks, "market", []);
  const { top, bottom } = hotlist(
    marketData,
    portfolio.stocks,
    "portfolio",
    scriptData
  );
  const [top2stocks, setTop2stocks] = useState(top2);
  const [bottom2stocks, setBottom2stocks] = useState(bottom2);
  const [topPerformer, setTopPerformer] = useState(top);
  const [worstPerformer, setWorstPerformer] = useState(bottom);
  const [indices, setIndices] = useState(indicesData);
  const transacTrades = transactions.slice(-5);
  const last5Trades = transacTrades.reverse();
  useEffect(() => {
    async function check() {
      try {
        const requestIndices = axios.get("/indices");
        const requestPortfolio = axios.get("/portfolio/info");
        const requestTransactions = axios.get("/transactions");
        const requestMarket = axios.get("/market");

        const [
          indicesResponse,
          portfolioResponse,
          transactionsResponse,
          marketResponse,
        ] = await Promise.all([
          requestIndices,
          requestPortfolio,
          requestTransactions,
          requestMarket,
        ]);

        const indicesData = indicesResponse.data;
        const portfolio = portfolioResponse.data;
        const transactions = transactionsResponse.data;
        const marketData = marketResponse.data;
        const stocks = portfolio.stocks;
        const requestScript = axios.post("/portfolio/prices", { stocks });
        const scriptData = requestScript.data;

        const { top2, bottom2 } = hotlist(
          marketData,
          portfolio.stocks,
          "market",
          []
        );
        const { top, bottom } = hotlist(
          marketData,
          portfolio.stocks,
          "portfolio",
          scriptData
        );
        setTop2stocks(top2);
        setBottom2stocks(bottom2);
        setTopPerformer(top);
        setWorstPerformer(bottom);
        setIndices(indicesData);

        console.log("Stocks updated");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const [chartData, setChartData] = useState([["Stocks", "Investment in INR"]]);

  useEffect(() => {
    const newChartData = [["Stocks", "Investment in INR"]];
    for (let i = 0; i < portfolio.stocks.length; ++i) {
      let investment =
        portfolio.stocks[i].avgPrice * portfolio.stocks[i].quantity;
      newChartData.push([portfolio.stocks[i].symbol, investment]);
    }
    setChartData(newChartData);
  }, [portfolio]);

  const options = {
    fontSize: 16,
    fontName: "Outfit",
    is3D: true,
    height: 400,
    legend: {
      alignment: "center",
    },
    backgroundColor: "transparent",
    legendTextStyle: {
      color: "#eceff1",
    },
  };

  const listItemStyle =
    "text-blue-gray-50 text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-blue-gray-50 hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <div className="bg-dashboard bg-no-repeat bg-cover bg-center p-10">
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-16">
          {indices.map((index) => (
            <Card
              variant="gradient"
              className="w-80 text-center bg-blue-gray-900/70"
            >
              <CardBody>
                <Typography
                  variant="h5"
                  className="text-blue-gray-50 font-Outfit font-normal text-xl"
                >
                  {index.name} ({index.symbol})
                </Typography>
                <Typography className="text-blue-gray-50/70 font-Outfit font-normal mt-3 text-xl">
                  {index.currentPrice.toFixed(2)}
                </Typography>
                <Typography
                  className="font-Outfit font-normal text-xl"
                  style={{ color: index.change >= 0 ? "green" : "red" }}
                >
                  {index.change.toFixed(2)}
                </Typography>
                <Typography
                  className="font-Outfit font-normal text-xl"
                  style={{
                    color: index.changePercent >= 0 ? "green" : "red",
                  }}
                >
                  {index.changePercent.toFixed(2)}%
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 mt-10 gap-10">
        <div className="col-span-6 bg-white/0 self-center">
          <Typography className="text-blue-gray-50 text-center text-4xl font-medium font-Outfit">
            Investment
          </Typography>
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            graph_id="PieChart"
            legend_toggle
          />
        </div>
        <Card
          variant="gradient"
          className="bg-blue-gray-900/70 col-span-6 w-full rounded-xl px-2"
        >
          <CardBody>
            <Typography className="text-blue-gray-50 font-Outfit font-normal text-xl text-left mt-5 mx-2">
              Top Gainers
            </Typography>
            <hr className="mt-2 mx-2" />
            <List>
              {top2stocks.map((stock) => (
                <Link to={`/stock/${stock.symbol}`}>
                  <div className="grid gap-2">
                    <ListItem
                      className={`grid grid-cols-4 items-center ${listItemStyle}`}
                    >
                      <div className="col-span-1 text-base text-left">
                        {stock.symbol}
                      </div>
                      <div className="col-span-1 text-right">
                        {stock.currentPrice.toFixed(2)}
                      </div>
                      <div
                        className="col-span- text-right"
                        style={{ color: stock.change >= 0 ? "green" : "red" }}
                      >
                        {stock.change.toFixed(2)}
                      </div>
                      <div
                        className="col-span-1 text-right"
                        style={{
                          color: stock.changePercent >= 0 ? "green" : "red",
                        }}
                      >
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </ListItem>
                  </div>
                </Link>
              ))}
            </List>
            <Typography className="text-blue-gray-50 font-Outfit font-normal text-xl text-left mt-5 mx-2">
              Top Losers
            </Typography>
            <hr className="mt-2 mx-2" />
            <List>
              {bottom2stocks.map((stock) => (
                <Link to={`/stock/${stock.symbol}`}>
                  <div className="grid gap-2">
                    <ListItem
                      className={`grid grid-cols-4 items-center ${listItemStyle}`}
                    >
                      <div className="col-span-1 text-base text-left">
                        {stock.symbol}
                      </div>
                      <div className="col-span-1 text-right">
                        {stock.currentPrice.toFixed(2)}
                      </div>
                      <div
                        className="col-span- text-right"
                        style={{ color: stock.change >= 0 ? "green" : "red" }}
                      >
                        {stock.change.toFixed(2)}
                      </div>
                      <div
                        className="col-span-1 text-right"
                        style={{
                          color: stock.changePercent >= 0 ? "green" : "red",
                        }}
                      >
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </ListItem>
                  </div>
                </Link>
              ))}
            </List>
            <Typography className="text-blue-gray-50 font-Outfit font-normal text-xl text-left mt-5 mx-2">
              Top Performer
            </Typography>
            <hr className="mt-2 mx-2" />
            <List>
              <Link to={`/stock/${topPerformer.symbol}`}>
                <div className="grid gap-2">
                  <ListItem
                    className={`grid grid-cols-6 items-center ${listItemStyle}`}
                  >
                    <div className="col-span-2 text-base text-left">
                      {topPerformer.symbol}
                    </div>
                    <div className="col-span-1 text-right">
                      {topPerformer.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color: topPerformer.change >= 0 ? "green" : "red",
                      }}
                    >
                      {topPerformer.change.toFixed(2)}
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color:
                          topPerformer.changePercent >= 0 ? "green" : "red",
                      }}
                    >
                      {topPerformer.changePercent.toFixed(2)}%
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color: topPerformer.prolos >= 0 ? "green" : "red",
                      }}
                    >
                      {topPerformer.prolos.toFixed(2)}
                    </div>
                  </ListItem>
                </div>
              </Link>
            </List>
            <Typography className="text-blue-gray-50 font-Outfit font-normal text-xl text-left mt-5 mx-2">
              Worst Performer
            </Typography>
            <hr className="mt-2 mx-2" />
            <List>
              <Link to={`/stock/${worstPerformer.symbol}`}>
                <div className="grid gap-2">
                  <ListItem
                    className={`grid grid-cols-6 items-center ${listItemStyle}`}
                  >
                    <div className="col-span-2 text-base text-left">
                      {worstPerformer.symbol}
                    </div>
                    <div className="col-span-1 text-right">
                      {worstPerformer.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color: worstPerformer.change >= 0 ? "green" : "red",
                      }}
                    >
                      {worstPerformer.change.toFixed(2)}
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color:
                          worstPerformer.changePercent >= 0 ? "green" : "red",
                      }}
                    >
                      {worstPerformer.changePercent.toFixed(2)}%
                    </div>
                    <div
                      className="col-span-1 text-right"
                      style={{
                        color: worstPerformer.prolos >= 0 ? "green" : "red",
                      }}
                    >
                      {worstPerformer.prolos.toFixed(2)}
                    </div>
                  </ListItem>
                </div>
              </Link>
            </List>
          </CardBody>
        </Card>
      </div>
      <Card
        variant="gradient"
        className="bg-blue-gray-900/70 h-auto w-full rounded-xl mt-10 p-2"
      >
        <CardHeader
          floated={false}
          className="grid grid-cols-9 items-center bg-transparent shadow-none mx-5"
        >
          <Typography className="col-span-2 text-blue-gray-50 font-Outfit font-normal text-xl">
            Date
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Trade Type
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Symbol
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Price
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Quantity
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Amount
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Profit/Loss
          </Typography>
          <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-center">
            Balance
          </Typography>
        </CardHeader>
        <hr className="mx-5 mt-2" />
        <List>
          {last5Trades.map((trade) => (
            <div className="grid gap-2">
              <ListItem
                className={`grid grid-cols-9 items-center ${listItemStyle}`}
              >
                <div className="col-span-2">{trade.date}</div>
                <div className="col-span-1 text-center">{trade.tradeType}</div>
                <div className="col-span-1 text-center">{trade.symbol}</div>
                <div className="col-span-1 text-center">
                  {trade.price.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">{trade.quantity}</div>
                <div className="col-span-1 text-center">
                  {trade.amount.toFixed(2)}
                </div>
                <div
                  className="col-span-1 text-center"
                  style={{ color: trade.profitLoss >= 0 ? "green" : "red" }}
                >
                  {trade.profitLoss.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  {trade.balance.toFixed(2)}
                </div>
              </ListItem>
            </div>
          ))}
        </List>
      </Card>
      {/* <div className="mt-10 flex justify-center gap-10">
        <button className="bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit">
          Deposit Money
        </button>
        <button className="bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit">
          Withdraw Money
        </button>
      </div> */}
    </div>
  );
}

export async function loader() {
  try {
    const requestIndices = axios.get("/indices");
    const requestPortfolio = axios.get("/portfolio/info");
    const requestTransactions = axios.get("/transactions");
    const requestMarket = axios.get("/market");

    const [
      indicesResponse,
      portfolioResponse,
      transactionsResponse,
      marketResponse,
    ] = await Promise.all([
      requestIndices,
      requestPortfolio,
      requestTransactions,
      requestMarket,
    ]);

    const indicesData = indicesResponse.data;
    const portfolio = portfolioResponse.data;
    const transactions = transactionsResponse.data;
    const marketData = marketResponse.data;
    const stocks = portfolio.stocks;
    const requestScript = await axios.post("/portfolio/prices", { stocks });
    const scriptData = requestScript.data;
    return { indicesData, portfolio, transactions, marketData, scriptData };
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; // Re-throw the error to propagate it to the error boundary
  }
}

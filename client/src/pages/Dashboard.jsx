import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useLoaderData } from "react-router-dom";
import {
  List,
  ListItem,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

function hotlist(market, choice) {
  market.sort((a, b) => b.changePercent - a.changePercent);
  if (choice == "market") {
    const top2 = market.slice(0, 2);
    const bottom2 = market.slice(-2);
    return { top2, bottom2 };
  } else {
    const top = market[0];
    const bottom = market[-1];
  }
}

export function Dashboard() {
  const { indicesData, portfolio, transactions, marketData } = useLoaderData();
  const [stocks, setStocks] = useState(marketData);
  const [indices, setIndices] = useState(indicesData);
  const last5Trades = transactions.slice(-5);
  // const { top2, bottom2 } = hotlist(marketData, "market");
  // const { top, bottom } = hotlist(portfolio.stocks, "stocks");
  useEffect(() => {
    async function check() {
      try {
        // const result = await axios.get("/market");
        const indices = await axios.get("/indices");
        setIndices(indices.data);
        // setStocks(result.data);
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
    backgroundColor: "#B2B2B2B2",
    height: 400,
    legend: {
      alignment: "center",
    },
  };

  const listItemStyle =
    "text-[#eceff1] text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-[#eceff1] hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <div className="bg-home bg-no-repeat bg-cover bg-center p-10">
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-16">
          {indices.map((index) => (
            <Card
              variant="gradient"
              className="w-80 text-center bg-blue-gray-900"
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
      <div className="grid grid-cols-12 mt-10">
        <div className="col-span-6">
          <Typography className="text-[#eceff1] text-center text-5xl font-medium font-Outfit">
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
        <div className="col-span-6 self-center">
          <Typography className="text-[#eceff1] text-center text-7xl font-medium font-Outfit">
            {/* <div>
              {top2.map((stock) => (
                <p>{stock.symbol}</p>
              ))}
            </div>{" "}
            <div>
              <h2>My top performers</h2>
              <p>{top}</p> <p>{bottom}</p>
            </div> */}
          </Typography>
        </div>
      </div>
      <List>
        {last5Trades.map((trade) => (
          <div className="grid gap-2">
            <ListItem
              className={`grid grid-cols-9 items-center ${listItemStyle}`}
            >
              <div className="col-span-2">{trade.date}</div>
              <div className="col-span-1">{trade.tradeType}</div>
              <div className="col-span-1">{trade.symbol}</div>
              <div className="col-span-1 pl-12">{trade.price.toFixed(2)}</div>
              <div className="col-span-1 pl-12">{trade.quantity}</div>
              <div className="col-span-1 pl-6">{trade.amount.toFixed(2)}</div>
              <div
                className="col-span-1 pl-12"
                style={{ color: trade.profitLoss >= 0 ? "green" : "red" }}
              >
                {trade.profitLoss.toFixed(2)}
              </div>
              <div className="col-span-1 pl-12">{trade.balance.toFixed(2)}</div>
            </ListItem>
          </div>
        ))}
      </List>
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

    return { indicesData, portfolio, transactions, marketData };
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; // Re-throw the error to propagate it to the error boundary
  }
}

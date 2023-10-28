import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

export function Stock({ params }) {
  // var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  // Use the correct server URL
  const { dps, symbol, lp, c, cp, metaData, watchlistPresent } =
    useLoaderData();
  const [change, setChange] = useState(c);
  const [changePercent, setChangePercent] = useState(cp);
  const [lastprice, setLastprice] = useState(lp);
  const [watchlistPre, setWatchlistPre] = useState(watchlistPresent);
  console.log(metaData);

  useEffect(() => {
    async function check() {
      try {
        console.log(symbol);
        const hist = true;
        const response = await axios.post("/stock", {
          symbol,
          hist,
        });
        setLastprice(response.data.lastprice);
        setChange(response.data.change);
        setChangePercent(response.data.changePercent);

        console.log("Stocks updated");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    theme: "light2",
    subtitles: [
      {
        text: "",
      },
    ],
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            valueFormatString: "MMM DD YYYY",
          },
        },
        axisY: {
          title: "Stock Price",
          prefix: "₹",
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            valueFormatString: "₹#,###.##",
          },
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: "Price (in INR)",
            type: "splineArea",
            color: "#064199",
            yValueFormatString: "₹#,###.##",
            xValueFormatString: "MMM DD YYYY",
            dataPoints: dps,
          },
        ],
      },
    ],
    navigator: {
      slider: {
        minimum: new Date("2023-01-01"),
        maximum: new Date("2023-09-30"),
      },
    },
  };
  const containerProps = {
    width: "90%",
    height: "450px",
    margin: "auto",
  };

  async function watchlistAdded() {
    console.log("sdasda");
    const res = await axios.post("/watchlist/add", {
      symbol,
    });
    setWatchlistPre(true);
  }
  return (
    <div className="p-10">
      <Typography className="mb-6 text-blue-gray-900 font-Outfit font-semibold text-4xl">
        ₹{lastprice.toFixed(2)}
        <span
          className="text-lg font-medium ml-3"
          style={{
            color: change >= 0 ? "green" : "red",
          }}
        >
          {change.toFixed(2)}
        </span>
        <span
          className="text-lg font-medium ml-3"
          style={{
            color: changePercent >= 0 ? "green" : "red",
          }}
        >
          {changePercent.toFixed(2)}%
        </span>
      </Typography>
      {!watchlistPre ? (
        <Button onClick={watchlistAdded}>Add to Watchlist</Button>
      ) : (
        <p>Added to watchlist</p>
      )}
      <div className="my-10">
        <Typography className="mb-10 text-gray-900 font-Outfit font-semibold text-3xl">
          {symbol} Chart
        </Typography>
        <Typography className="mb-10 text-blue-gray-900 font-Outfit font-semibold text-3xl">
          {symbol} Chart
        </Typography>
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      </div>
      <Typography className="mb-2 text-blue-gray-900 font-Outfit font-semibold text-4xl">
        Key Stats
      </Typography>
      <div className="flex py-5">
        <div className="grid grid-cols-4 gap-8">
          {metaData.map((quote) => (
            <Card variant="gradient" className="p-4">
              <Typography className="text-blue-gray-900 font-Outfit font-medium text-xl">
                {quote.label}
              </Typography>
              <Typography className="text-blue-gray-900/70 font-Outfit font-medium text-base">
                {quote.value}
              </Typography>
            </Card>
          ))}
        </div>
      </div>
      <Link to={`/purchase/${symbol}`} className="flex justify-center mt-5">
        <button className="bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit">
          Buy {symbol}
        </button>
      </Link>
    </div>
  );
}

export async function loader({ params }) {
  const symbol = params.symbol;
  const hist = true;
  const response = await axios.post("/stock", {
    symbol,
    hist,
  });

  var dps = [];
  const { histData, lastprice, change, changePercent } = response.data;
  console.log(histData);
  console.log(lastprice, change, changePercent);
  if (
    histData.chart &&
    histData.chart.result &&
    histData.chart.result.length > 0
  ) {
    const historicalData = histData.chart.result[0];
    const timestamps = historicalData.timestamp;
    const prices = historicalData.indicators.quote[0].close;

    for (let i = 0; i < timestamps.length; i++) {
      dps.push({
        x: new Date(timestamps[i] * 1000),
        y: Number(prices[i]),
      });
    }
  } else {
    console.error("No historical histData found for the symbol:");
  }
  const metaDataResponse = await axios.post("/stock/data", { symbol });
  const metaData = metaDataResponse.data;
  const c = change;
  const cp = changePercent;
  const lp = lastprice;

  const res = await axios.get("/watchlist/info");
  const watchlist = res.data;
  let watchlistPresent = false;
  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].symbol === symbol) {
      watchlistPresent = true;
      break;
    }
  }
  return { dps, symbol, lp, c, cp, metaData, watchlistPresent };
}

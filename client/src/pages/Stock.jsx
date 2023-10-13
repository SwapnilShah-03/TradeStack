import React from "react";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import { Button } from "@mui/material";
export function Stock({ params }) {
  // var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  // Use the correct server URL
  const { dps, symbol, lastprice, change, changePercent } = useLoaderData();
  console.log(dps);
  const options = {
    title: {
      text: `React StockChart of ${symbol}`,
    },
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
            color: "#1b6e55",
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
  return (
    <div>
      <div>
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      </div>
      <Link to={`/purchase/${symbol}`}>
        <Button>Buy</Button>
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
  return { dps, symbol, lastprice, change, changePercent };
}

import React from "react";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
import CanvasJSReact from "@canvasjs/react-stockcharts";

export function Stock({ params }) {
  // var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  // Use the correct server URL
  const { dps, symbol, lastprice, change, changePercent, metaData } =
    useLoaderData();
  console.log(metaData);
  const options = {
    title: {
      text: `Stock Chart of ${symbol}`,
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
  return (
    <div className="p-10">
      <h2>{lastprice.toFixed(2)}</h2>
      
      <p
        style={{
          color: change >= 0 ? "seagreen" : "red",
        }}
      >
        {change.toFixed(2)}
      </p>
      <p
        style={{
          color: changePercent >= 0 ? "seagreen" : "red",
        }}
      >
        {changePercent.toFixed(2)}%
      </p>

      <div>
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      </div>
      <div className="metaData">
        {metaData.map((quote) => (
          <div>
            <h3>{quote.label}</h3>
            <p>{quote.value}</p>
          </div>
        ))}
      </div>
      <Link to={`/purchase/${symbol}`} className="flex justify-center mt-6">
        <button className="bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit">
          Buy
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
  return { dps, symbol, lastprice, change, changePercent, metaData };
}

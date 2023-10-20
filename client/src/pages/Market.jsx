import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function Market(params) {
  const response = useLoaderData();
  const [stocks, setStocks] = useState(response);
  useEffect(() => {
    async function check() {
      try {
        const result = await axios.get("/market");
        setStocks(result.data); // Update the state with the data
        console.log("Stocks updated");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const interval = setInterval(check, 60000); // Set up periodic fetching
    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full h-screen w-full flex justify-center ">
      <div className="mt-[5rem] w-full grid self-stretch">
        {stocks.map((stock) => (
          <>
            <Link to={`/stock/${stock.symbol}`}>
              <div className="grid gap-2 self-stretch">
                <div className="grid grid-cols-12 items-center bg-[#252366] px-6 py-6 text-white rounded-xl">
                  <div className="col-span-4">{stock.name}</div>
                  <div className="col-span-2 text-xs">{stock.symbol}</div>
                  <div className="col-span-2 text-right">
                    {stock.currentPrice.toFixed(2)}
                  </div>
                  <div
                    className="col-span-2 text-right"
                    style={{ color: stock.change >= 0 ? "green" : "red" }}
                  >
                    {stock.change.toFixed(2)}
                  </div>
                  <div
                    className="col-span-2 text-right"
                    style={{
                      color: stock.changePercent >= 0 ? "seagreen" : "red",
                    }}
                  >
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </Link>
            <br />
            <br />
          </>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/market");
  console.log(response.data);
  return response.data;
}

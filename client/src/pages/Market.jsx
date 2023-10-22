import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, Card } from "@material-tailwind/react";

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

  const listItemStyle =
    "text-[#eceff1] text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-[#eceff1] hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <>
      <div className="min-h-full h-auto w-full flex justify-center pt-5">
        <Card
          variant="gradient"
          className="bg-[#263238] w-full rounded-xl rounded-b-none"
        >
          <List>
            {stocks.map((stock) => (
              <Link to={`/stock/${stock.symbol}`}>
                <div className="grid gap-2">
                  <ListItem
                    className={`grid grid-cols-12 items-center ${listItemStyle}`}
                  >
                    <div className="col-span-4">{stock.name}</div>
                    <div className="col-span-3 text-base">{stock.symbol}</div>
                    <div className="col-span-1">
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
                  </ListItem>
                </div>
              </Link>
            ))}
          </List>
        </Card>
      </div>
    </>
  );
}

export async function loader() {
  const response = await axios.get("/market");
  console.log(response.data);
  return response.data;
}

import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function Market(params) {
  const { indicesData, marketData } = useLoaderData();
  console.log(indicesData);
  console.log(marketData);
  const [stocks, setStocks] = useState(marketData);
  const [indices, setIndices] = useState(indicesData);
  useEffect(() => {
    async function check() {
      try {
        const result = await axios.get("/market");
        const indices = await axios.get("/indices");
        setIndices(indices.data);
        setStocks(result.data);
        console.log("Stocks updated");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const listItemStyle =
    "text-[#eceff1] text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-[#eceff1] hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <>
      <div className="flex justify-center mt-10">
        <div className="grid grid-cols-3 gap-16">
          {indices.map((index) => (
            <Card
              variant="gradient"
              className="w-80 text-center bg-blue-gray-900"
            >
              <CardBody>
                <Typography
                  variant="h5"
                  className="text-blue-gray-50 font-Outfit font-normal"
                >
                  {index.name} ({index.symbol})
                </Typography>
                <Typography className="text-blue-gray-50/70 font-Outfit font-normal mt-3">{index.currentPrice.toFixed(2)}</Typography>
                <Typography
                className="font-Outfit font-normal"
                  style={{ color: index.change >= 0 ? "green" : "red" }}
                >
                  {index.change.toFixed(2)}
                </Typography>
                <Typography
                className="font-Outfit font-normal"
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
      <div className="h-auto w-full flex justify-center pt-10">
        <Card
          variant="gradient"
          className="bg-[#263238] w-full rounded-xl rounded-b-none"
        >
          <List>
            {stocks.map((stock) => (
              <Link to={`/stock/${stock.symbol}`}>
                <div className="grid gap-2">
                  <ListItem
                    className={`grid grid-cols-11 items-center ${listItemStyle}`}
                  >
                    <div className="col-span-3">{stock.name}</div>
                    <div className="col-span-2 text-base pl-6">{stock.symbol}</div>
                    <div className="col-span-2 text-center pl-6">
                      {stock.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className="col-span-2 text-center pl-32"
                      style={{ color: stock.change >= 0 ? "green" : "red" }}
                    >
                      {stock.change.toFixed(2)}
                    </div>
                    <div
                      className="col-span-2 text-center pl-48"
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
        </Card>
      </div>
    </>
  );
}

export async function loader() {
  const response = await axios.get("/market");
  const res = await axios.get("/indices");
  const indicesData = res.data;
  const marketData = response.data;
  return { indicesData, marketData };
}

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
  CardHeader,
  Button,
} from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";

export function Watchlist(params) {
  const { indicesData, marketData } = useLoaderData();
  console.log(indicesData);
  console.log(marketData);
  const [stocks, setStocks] = useState(marketData);
  const [indices, setIndices] = useState(indicesData);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    async function check() {
      try {
        const result = await axios.get("/watchlist/info");
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

  async function watchlistDelete(symbol) {
    const response = await axios.post("/watchlist/delete", {
      symbol,
    });
    console.log("ASDasda");
    setRedirect(true);
    return;
  }

  useEffect(() => {
    if (redirect) {
      window.location.reload();
    }
  }, [redirect]);

  const listItemStyle =
    "text-blue-gray-50 text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-blue-gray-50 hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <div className="bg-market bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="flex justify-center pt-10">
        <div className="grid grid-cols-3 gap-16">
          {indices.map((index) => (
            <Card
              variant="gradient"
              className="w-80 text-center bg-blue-gray-900 bg-opacity-70"
            >
              <CardBody>
                <Typography
                  variant="h5"
                  className="text-blue-gray-50 font-Outfit font-normal"
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
      <div className="h-auto w-full flex justify-center py-10">
        <Card
          variant="gradient"
          className="bg-blue-gray-900 bg-opacity-70 w-full rounded-xl mx-10 p-2"
        >
          <CardHeader
            floated={false}
            className="grid grid-cols-6 items-center bg-transparent shadow-none mx-5"
          >
            <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-left">
              Stock Name
            </Typography>
            <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-right">
              Symbol
            </Typography>
            <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-right">
              Price
            </Typography>
            <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-right">
              Change
            </Typography>
            <Typography className="col-span-1 text-blue-gray-50 font-Outfit font-normal text-xl text-right">
              Change %
            </Typography>
          </CardHeader>
          <hr className="mx-5 mt-2" />
          <List>
            {stocks.map((stock) => (
              <>
                <div className="grid gap-2">
                  <Link to={`/stock/${stock.symbol}`}>
                    <ListItem
                      className={`grid grid-cols-6 grid-flow-col items-center ${listItemStyle}`}
                    >
                      <div className="col-span-1 text-left">{stock.name}</div>
                      <div className="col-span-1 text-base text-right">
                        {stock.symbol}
                      </div>
                      <div className="col-span-1 text-right">
                        {stock.currentPrice.toFixed(2)}
                      </div>
                      <div
                        className="col-span-1 text-right"
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
                      {/* <button
                      onClick={() => watchlistDelete(stock.symbol)}
                      className="col-span-1 text-right"
                    >
                      <DeleteIcon />
                    </button> */}
                      {/* <IconButton
                      variant="text"
                      className="rounded-full col-span-1 justify-self-end bg-transparent hover:bg-blue-gray-50"
                    > */}
                      {/* </IconButton> */}
                      <Link
                        onClick={window.location.reload}
                        className="justify-self-end"
                      >
                        <DeleteIcon
                          onClick={() => watchlistDelete(stock.symbol)}
                          className="col-span-1 text-blue-gray-300 hover:text-blue-gray-50"
                        />
                      </Link>
                    </ListItem>
                  </Link>
                </div>
              </>
            ))}
          </List>
        </Card>
      </div>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/watchlist/info");
  const res = await axios.get("/indices");
  const indicesData = res.data;
  const marketData = response.data;
  return { indicesData, marketData };
}

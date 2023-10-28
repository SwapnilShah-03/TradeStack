import React, { useContext } from "react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { UserContext } from "../userContext";
import {
  List,
  ListItem,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function Transactions() {
  const trades = useLoaderData();

  const formatedDate = (utcDate) => {
    utcDate.setHours(utcDate.getHours() + 5);
    utcDate.setMinutes(utcDate.getMinutes() + 30);
    const newDate = utcDate.toISOString();
    return newDate;
  };

  console.log(trades);

  const listItemStyle =
    "text-[#eceff1] text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-[#eceff1] hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <div className="min-h-screen">
      <div className="w-full flex justify-center py-10">
        <Card
          variant="gradient"
          className="bg-blue-gray-900 h-auto w-full rounded-xl mx-10 p-2"
        >
          <div className="grid grid-cols-9 items-center mx-5 mt-6 mb-2">
            <Typography className="col-span-2 text-[#eceff1] font-Outfit font-normal text-xl">
              Date
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Trade Type
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Symbol
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Price
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Quantity
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Amount
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Profit/Loss
            </Typography>
            <Typography className="col-span-1 text-[#eceff1] font-Outfit font-normal text-xl text-center">
              Balance
            </Typography>
          </div>
          <hr className="mx-5 mt-3" />
          <List>
            {trades.map((trade) => (
              <div className="grid gap-2">
                <ListItem
                  className={`grid grid-cols-9 items-center ${listItemStyle}`}
                >
                  <div className="col-span-2">{trade.date}</div>
                  <div className="col-span-1 text-center">{trade.tradeType}</div>
                  <div className="col-span-1 text-center">{trade.symbol}</div>
                  <div className="col-span-1 text-center">{trade.price.toFixed(2)}</div>
                  <div className="col-span-1 text-center">{trade.quantity}</div>
                  <div className="col-span-1 text-center">{trade.amount.toFixed(2)}</div>
                  <div
                    className="col-span-1 text-center"
                    style={{ color: trade.profitLoss >= 0 ? "green" : "red" }}
                  >
                    {trade.profitLoss.toFixed(2)}
                  </div>
                  <div className="col-span-1 text-center">{trade.balance.toFixed(2)}</div>
                </ListItem>
              </div>
            ))}
          </List>
        </Card>
      </div>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/transactions");
  const data = response.data;
  const rev = data.reverse();
  return rev;
}

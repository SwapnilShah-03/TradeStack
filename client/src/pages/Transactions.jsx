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
    utcDate.setHours(utcDate.getHours() + 5); // Add 5 hours
    utcDate.setMinutes(utcDate.getMinutes() + 30);
    const newDate = utcDate.toISOString();
    return newDate;
  };

  console.log(trades);

  const listItemStyle =
    "text-[#eceff1] text-opacity-50 hover:bg-blue-gray-700 ease-in transition duration-150 hover:text-[#eceff1] hover:text-opacity-100 font-Outfit font-normal text-lg";

  return (
    <div className="h-auto w-full flex justify-center pt-10">
      <Card
        variant="gradient"
        className="bg-[#263238] w-full rounded-xl rounded-b-none"
      >
        <List>
          {trades.map((trade) => (
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
                <div className="col-span-1 pl-12">
                  {trade.balance.toFixed(2)}
                </div>
              </ListItem>
            </div>
          ))}
        </List>
      </Card>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/transactions");
  const data = response.data;
  const rev = data.reverse();
  return rev;
}

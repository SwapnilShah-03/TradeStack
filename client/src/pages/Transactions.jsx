import React, { useContext } from "react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { UserContext } from "../userContext";
export function Transactions() {
  const trades = useLoaderData();

  const formatedDate = (utcDate) => {
    utcDate.setHours(utcDate.getHours() + 5); // Add 5 hours
    utcDate.setMinutes(utcDate.getMinutes() + 30);
    const newDate = utcDate.toISOString();

    return newDate;
  };

  console.log(trades);
  return (
    <div
      className="my-20
"
    >
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        // alignItems={"flex-start"}
        className="text-lg px-9"
      >
        {trades.map((trade) => (
          // <Link to={`/stock/${trade.symbol}`}>
          <Grid
            container
            className=" bg-slate-700"
            alignSelf={"center"}
            textAlign={"left"}
          >
            {/* <Grid item xs={3} className="">
                {stock.name}
              </Grid> */}
            <Grid item xs={2}>
              {trade.date}
            </Grid>
            <Grid item xs={1}>
              {trade.tradeType}
            </Grid>
            <Grid item xs={1.5}>
              {trade.symbol}
            </Grid>
            <Grid item xs={1.5}>
              {trade.price.toFixed(2)}
            </Grid>
            <Grid item xs={1.5}>
              {trade.quantity}
            </Grid>
            <Grid item xs={1.5}>
              {trade.amount.toFixed(2)}
            </Grid>
            <Grid
              item
              xs={1.5}
              style={{ color: trade.profitLoss >= 0 ? "green" : "red" }}
            >
              {trade.profitLoss.toFixed(2)}
            </Grid>
            <Grid item xs={1.5}>
              {trade.balance.toFixed(2)}
            </Grid>
          </Grid>
          // </Link>
        ))}
      </Grid>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/transactions");
  return response.data;
}

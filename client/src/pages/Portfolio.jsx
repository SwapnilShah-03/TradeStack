import React, { useState, useContext } from "react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { Grid, Button, Modal, Box } from "@mui/material";
import { UserContext } from "../userContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function Portfolio() {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [totalQuantity, setTottalQuantity] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const { portfolio, prices } = useLoaderData();
  let pl = 0;
  const stocks = [];

  const handleOpen = (symbol, currentPrice, profitLoss, totalQuantity) => {
    setOpen(true);
    setPrice(currentPrice);
    setSymbol(symbol);
    setProfit(profitLoss);
    setTottalQuantity(totalQuantity);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount(0);
    setQuantity(0);
    setProfit(0);
  };

  async function updatePortfolio(ev) {
    ev.preventDefault();
    if (quantity > totalQuantity || quantity < 1) {
      alert("Invalid Sale");
      handleClose();
    } else {
      const profits = quantity * profit;
      console.log(profits);
      const update = await axios.post("/portfolio/sellUpdate", {
        name: user.username,
        symbol,
        price,
        quantity,
        amount,
        profit: profits,
      });
      alert("Sale was successful");
      setRedirect(true);
    }
  }

  const change = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    setAmount(newQuantity * price);
  };

  for (let i = 0; i < prices.length; ++i) {
    pl = pl + (prices[i] - portfolio.stocks[i].avgPrice);
    stocks.push({
      symbol: String(portfolio.stocks[i].symbol),
      currentPrice: prices[i],
      profitLoss: prices[i] - portfolio.stocks[i].avgPrice,
      quantity: portfolio.stocks[i].quantity,
    });
  }

  if (redirect) {
    window.location.reload();
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex ">
            <form className="max-w-md mx-auto">
              <div className="mt-4 grow flex items-center justify-around">
                <div classname="mb-64 flex">
                  <h4 className="text-3xl text-center mb-4">
                    Selling of Shares
                  </h4>
                  <p>Stock Symbol : {symbol}</p>
                  <p>Stock latest Price : ₹{price.toFixed(2)}</p>
                  <p></p>
                  <label>Quantity : </label>
                  <input type="number" value={quantity} onChange={change} />
                  <p> Amount : ₹{amount.toFixed(2)}</p>
                  <p>
                    Profit/Loss :
                    <span
                      style={{
                        color: profit * quantity >= 0 ? "green" : "red",
                      }}
                    >
                      ₹{(profit * quantity).toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="primary  self-center bg-blue-900 border-emerald-200 rounded-xl px-5 py-3 my-5 text-center text-lg shadow-inherit mx-5"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="primary  self-center bg-blue-900 border-emerald-200 rounded-xl px-5 py-3 my-5 text-center text-lg shadow-inherit mx-5"
                    onClick={updatePortfolio}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <div>
        <div className="flex flex-row my-20">
          <div className=" bg-slate-500 rounded-lg ">
            <h3>Investment : ₹{portfolio.investment.toFixed(2)}</h3>
          </div>
          <div className=" bg-slate-500 rounded-lg ">
            <h3>Account Balance : ₹{portfolio.balance.toFixed(2)}</h3>
          </div>
          <div className=" bg-slate-500 rounded-lg ">
            <h3>
              <span style={{ color: "green" }}>Profit</span>/
              <span style={{ color: "red" }}>Loss</span>:
              <span style={{ color: pl >= 0 ? "green" : "red" }}>
                ₹{pl.toFixed(2)}
              </span>
            </h3>
          </div>
        </div>
        <div className="my-20">
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            // alignItems={"flex-start"}
            className="text-lg px-9"
          >
            {stocks.map((stock) => (
              <Grid
                container
                className=" bg-slate-700"
                alignSelf={"center"}
                textAlign={"left"}
              >
                {/* <Grid item xs={3} className="">
                {stock.name}
              </Grid> */}
                {/* <Link to={`/stock/${stock.symbol}`}> */}
                <Grid item xs={5}>
                  {stock.symbol}
                </Grid>

                <Grid item xs={1.5}>
                  {stock.currentPrice.toFixed(2)}
                </Grid>
                <Grid item xs={1.5}>
                  {stock.quantity}
                </Grid>
                <Grid
                  item
                  xs={1.5}
                  style={{ color: stock.profitLoss >= 0 ? "green" : "red" }}
                >
                  {stock.profitLoss.toFixed(2)}
                </Grid>

                {/* <Grid
                  item
                  xs={1.5}
                  style={{ color: stock.changePercent > 0 ? "green" : "red" }}
                  className=""
                >
                  {stock.changePercent.toFixed(2)}
                </Grid> */}
                {/* </Link> */}
                <Grid item xs={1.5}>
                  <Button
                    onClick={() =>
                      handleOpen(
                        stock.symbol,
                        stock.currentPrice,
                        stock.profitLoss,
                        stock.quantity
                      )
                    }
                  >
                    Sell
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/portfolio/info");
  const stocks = response.data.stocks;
  console.log(response.data.stocks);
  const res = await axios.post("/portfolio/prices", {
    stocks,
  });
  console.log(res.data);
  const portfolio = response.data;
  const prices = res.data;
  return { portfolio, prices };
}

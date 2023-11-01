import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useLoaderData } from "react-router-dom";
// import { Grid, Button, Modal, Box } from "@mui/material";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import {
  Card,
  CardHeader,
  CardBody,
  Dialog,
  DialogBody,
  Typography,
} from "@material-tailwind/react";

const fixedInputClass =
  "mt-2 rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-blue-gray-900 sm:text-md";

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
  const { list, portfolio, data, prolos } = useLoaderData();
  const [pl, setPl] = useState(prolos);
  const [stocklist, setStocklist] = useState(list);
  const [stocks, setStocks] = useState(data);
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
      setTimeout(() => {
        toast.error("Invalid Sale");
      }, 1000);
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
      setTimeout(() => {
        toast.success("Successfully sold shares!");
      }, 1000);
      handleClose();
      setTimeout(() => {
        setRedirect(true);
      }, 1400);
      // setTimeout(() => {
      // }, 1400);
    }
  }

  const change = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    setAmount(newQuantity * price);
  };

  useEffect(() => {
    async function check() {
      try {
        const response = await axios.get("/portfolio/info");
        const stocks = response.data.stocks;
        console.log(response.data.stocks);
        const res = await axios.post("/portfolio/prices", {
          stocks,
        });
        const prices = res.data;
        const data = [];
        let prolos = 0;
        for (let i = 0; i < prices.length; ++i) {
          prolos =
            prolos +
            (prices[i] - portfolio.stocks[i].avgPrice) *
              portfolio.stocks[i].quantity;
          data.push({
            symbol: String(portfolio.stocks[i].symbol),
            currentPrice: prices[i],
            profitLoss: prices[i] - portfolio.stocks[i].avgPrice,
            quantity: portfolio.stocks[i].quantity,
          });
        }
        setStocks(data);
        setPl(prolos);
        console.log("Stocks updated");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  if (redirect) {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-portfolio bg-no-repeat bg-cover bg-center p-10">
      <Dialog
        open={open}
        handler={handleOpen}
        size="xs"
        className="flex justify-center py-10"
      >
        <DialogBody variant="gradient" className="flex-row h-auto">
          <form onSubmit={updatePortfolio} className="w-64">
            <Typography className="mb-8 text-blue-gray-900 font-Outfit font-medium text-3xl">
              Selling of Shares
            </Typography>
            <Typography className="mb-6 text-blue-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Stock Symbol: {symbol}
            </Typography>
            <Typography className="mb-6 text-blue-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Latest Price: ₹{price.toFixed(2)}
            </Typography>
            <label
              htmlFor="quantity"
              className="text-blue-gray-900 text-opacity-70 font-Outfit font-normal text-xl"
            >
              Quantity:
            </label>
            <input
              type="number"
              onChange={change}
              id="quantity"
              name="quantity"
              value={quantity}
              className={`mb-6 text-blue-gray-900 text-opacity-100 font-Outfit font-normal text-md ${fixedInputClass}`}
              autoComplete="off"
            />
            <Typography className="mb-6 text-blue-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Amount: ₹{amount.toFixed(2)}
            </Typography>
            <Typography className="mb-6 text-blue-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Profit/Loss:{" "}
              <span
                style={{
                  color: profit * quantity >= 0 ? "green" : "red",
                }}
              >
                ₹{(profit * quantity).toFixed(2)}
              </span>
            </Typography>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleClose}
                className="bg-transparent hover:bg-red-700 text-red-700 hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-xl font-medium font-Outfit"
              >
                Cancel
              </button>
              <button
                onClick={updatePortfolio}
                className="bg-transparent hover:bg-green-700 text-green-700 hover:text-white py-2 px-4 border border-green-700 hover:border-transparent text-xl font-medium font-Outfit"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-16">
          <Card
            variant="gradient"
            className="w-80 text-center bg-blue-gray-900/80"
          >
            <CardBody>
              <Typography
                variant="h5"
                className="text-blue-gray-50 font-Outfit font-normal text-2xl"
              >
                Investment:
                <Typography className="font-Outfit font-normal text-xl">
                  ₹{portfolio.investment.toFixed(2)}
                </Typography>
              </Typography>
            </CardBody>
          </Card>
          <Card className="w-80 text-center bg-blue-gray-900/80">
            <CardBody>
              <Typography
                variant="h5"
                className="text-blue-gray-50 font-Outfit font-normal text-2xl"
              >
                Account Balance:
                <Typography className="font-Outfit font-normal text-xl">
                  ₹{portfolio.balance.toFixed(2)}
                </Typography>
              </Typography>
            </CardBody>
          </Card>
          <Card className="w-80 text-center bg-blue-gray-900/80">
            <CardBody>
              <Typography
                variant="h5"
                className="text-blue-gray-50 font-Outfit font-normal text-2xl"
              >
                <span style={{ color: "green" }}>Profit</span>/
                <span style={{ color: "red" }}>Loss</span>:{" "}
                <Typography
                  style={{ color: pl >= 0 ? "green" : "red" }}
                  className="font-Outfit font-normal text-xl"
                >
                  ₹{pl.toFixed(2)}
                </Typography>
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="mt-10 mx-10">
        <Card className="bg-opacity-80 p-2">
          <CardHeader
            floated={false}
            className="grid grid-cols-10 gap-4 items-center bg-transparent shadow-none mx-6"
          >
            <Typography className="col-span-2 text-blue-gray-900 font-Outfit font-medium text-2xl">
              Symbol
            </Typography>
            <Typography className="col-span-2 text-blue-gray-900 font-Outfit font-medium text-2xl">
              Current Price
            </Typography>
            <Typography className="col-span-2 text-blue-gray-900 font-Outfit font-medium text-2xl">
              Quantity
            </Typography>
            <Typography className="col-span-2 text-blue-gray-900 font-Outfit font-medium text-2xl">
              Profit/Loss
            </Typography>
          </CardHeader>
          <hr className="mx-6 mt-2 border-1 border-blue-gray-900" />
          <CardBody className="grid grid-cols-10 gap-4 items-center">
            {stocks.map((stock) => (
              <>
                <Typography
                  variant="h5"
                  className="text-blue-gray-900 font-Outfit font-normal col-span-2"
                >
                  {stock.symbol}
                </Typography>
                <Typography
                  variant="h5"
                  className="text-blue-gray-900 font-Outfit font-normal col-span-2"
                >
                  {stock.currentPrice.toFixed(2)}
                </Typography>
                <Typography
                  variant="h5"
                  className="text-blue-gray-900 font-Outfit font-normal col-span-2"
                >
                  {stock.quantity}
                </Typography>
                <Typography
                  variant="h5"
                  className="text-blue-gray-900 font-Outfit font-normal col-span-2"
                  style={{ color: stock.profitLoss >= 0 ? "green" : "red" }}
                >
                  {stock.profitLoss.toFixed(2)}
                </Typography>
                <Link
                  to={`/purchase/${stock.symbol}`}
                  className="flex justify-center bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit col-span-1"
                >
                  Buy
                </Link>
                <button
                  onClick={() =>
                    handleOpen(
                      stock.symbol,
                      stock.currentPrice,
                      stock.profitLoss,
                      stock.quantity
                    )
                  }
                  className="flex justify-center bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit col-span-1"
                >
                  Sell
                </button>
              </>
            ))}
          </CardBody>
        </Card>
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
  const data = [];
  let prolos = 0;
  for (let i = 0; i < prices.length; ++i) {
    prolos =
      prolos +
      (prices[i] - portfolio.stocks[i].avgPrice) * portfolio.stocks[i].quantity;
    data.push({
      symbol: String(portfolio.stocks[i].symbol),
      currentPrice: prices[i],
      profitLoss: prices[i] - portfolio.stocks[i].avgPrice,
      quantity: portfolio.stocks[i].quantity,
    });
  }
  return { stocks, portfolio, data, prolos };
}

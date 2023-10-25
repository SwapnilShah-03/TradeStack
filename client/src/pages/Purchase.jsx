import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLoaderData } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const fixedInputClass =
  "mt-2 rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-md";

export function Purchase() {
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const { symbol, balance, price } = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const change = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    setAmount(newQuantity * price);
  };

  async function updatePortfolio(ev) {
    ev.preventDefault();
    console.log(symbol, price, quantity, amount);
    if (amount > balance || quantity < 1) {
      toast.error("Invalid purchase!");
    } else {
      await axios.post("/portfolio/buyUpdate", {
        name: user.username,
        symbol,
        price,
        quantity,
        amount,
      });
      toast.success("Successfully purchased shares!");
      navigate("/portfolio");
    }
  }

  return (
    <div className="bg-purchase bg-no-repeat bg-cover bg-center h-[89.5vh] flex justify-center">
      <form onSubmit={updatePortfolio} className="my-auto">
        <Card
          variant="gradient"
          className="flex-row h-auto bg-white bg-opacity-95 py-4 px-8 shadow-2xl"
        >
          <CardBody>
            <Typography className="mb-8 text-gray-900 font-Outfit font-medium text-3xl">
              Buying of Shares
            </Typography>
            <Typography className="mb-6 text-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Stock Symbol: {symbol}
            </Typography>
            <Typography className="mb-6 text-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Latest Price: ₹{price.toFixed(2)}
            </Typography>
            <Typography className="mb-6 text-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Account Balance: ₹{balance.toFixed(2)}
            </Typography>
            <label
              htmlFor="quantity"
              className="text-gray-900 text-opacity-70 font-Outfit font-normal text-xl"
            >
              Quantity:
            </label>
            <input
              type="number"
              onChange={change}
              id="quantity"
              name="quantity"
              value={quantity}
              className={`mb-6 text-black text-opacity-100 font-Outfit font-normal text-md ${fixedInputClass}`}
              autoComplete="off"
            />
            <Typography className="mb-8 text-gray-900 text-opacity-70 font-Outfit font-normal text-xl">
              Amount: ₹{amount.toFixed(2)}
            </Typography>
            <div className="flex justify-center">
              <button className="bg-transparent hover:bg-blue-gray-900 text-blue-gray-900 hover:text-white py-2 px-4 border border-blue-gray-900 hover:border-transparent text-xl font-medium font-Outfit">
                Buy
              </button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}

export async function loader({ params }) {
  const symbol = params.symbol;
  const hist = false;
  const res = await axios.post("/stock", {
    symbol,
    hist,
  });
  const price = res.data;
  const portfolio = await axios.get("/portfolio/info");
  const balance = portfolio.data.balance;
  return { symbol, balance, price };
}

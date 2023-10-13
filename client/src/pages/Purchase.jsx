import React, { useState, useContext } from "react";
import axios from "axios";
import { Navigate, useLoaderData } from "react-router-dom";
import { UserContext } from "../userContext";
import cookieParser from "cookie-parser";

export function Purchase() {
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const { symbol, balance, price } = useLoaderData();
  const [redirect, setRedirect] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const change = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    setAmount(newQuantity * price);
  };

  async function updatePortfolio(ev) {
    ev.preventDefault();
    console.log(symbol, price, quantity, amount);
    if (amount > balance || quantity < 1) {
      alert("Invalid Purchase");
    } else {
      await axios.post("/portfolio/buyUpdate", {
        name: user.username,
        symbol,
        price,
        quantity,
        amount,
      });
      alert("Purchase was successful");
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/portfolio"} />;
  }

  return (
    <div className="my-20 flex ">
      <form className="max-w-md mx-auto" onSubmit={updatePortfolio}>
        <div className="mt-4 grow flex items-center justify-around">
          <div classname="mb-64 flex">
            <h4 className="text-3xl text-center mb-4">Buying of Shares</h4>
            <p>Stock Symbol : {symbol}</p>
            <p>Stock latest Price : ₹{price.toFixed(2)}</p>
            <p>Account Balance : ₹{balance.toFixed(2)}</p>
            <label>Quantity : </label>
            <input type="number" value={quantity} onChange={change} />
            <p> Amount : ₹{amount.toFixed(2)}</p>
            <button className="primary  self-center bg-blue-900 border-emerald-200 rounded-xl px-5 py-3 my-5 text-center text-lg shadow-inherit">
              Confirm
            </button>
          </div>
        </div>
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

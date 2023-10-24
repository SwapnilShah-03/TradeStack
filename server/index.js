import cors from "cors";
import axios from "axios";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
// import posts from "./routes/stock.js";
import Stock from "./models/Stock.js";
import Portfolio from "./models/Portfolio.js";
import Transaction from "./models/Transaction.js";
import Indices from "./models/Indices.js";
import User from "./models/User.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from "./controllers/authController.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use("/", require("./routes/authRoutes.js"));

// app.get("/", test);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/profile", getProfile);
app.get("/logout", logoutUser);

app.post("/stock", async (req, res) => {
  console.log(req.body.symbol);
  const symbol = req.body.symbol;

  if (req.body.hist) {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=0&period2=9999999999&interval=1d` // Update with your API endpoint
      );
      const prices = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?&interval=5m`
      );

      const histData = response.data;
      const results = prices.data.chart.result[0];
      const closePrices = results.indicators.quote[0].close;
      const l = closePrices.length;
      const prevClose = results.meta.previousClose;
      const lastprice = closePrices[l - 1];
      const change = closePrices[l - 1] - prevClose;
      const changePercent = (change * 100) / prevClose;
      res.json({ histData, lastprice, change, changePercent });
    } catch (err) {
      console.log(err);
    }
  } else {
    const prices = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?&interval=5m`
    );
    const results = prices.data.chart.result[0];
    const closePrices = results.indicators.quote[0].close;
    const l = closePrices.length;

    // const prevClose = results.meta.previousClose;
    const lastprice = closePrices[l - 1];
    // const change = closePrices[l - 1] - prevClose;
    // const changePercent = (change * 100) / prevClose;
    res.json(lastprice);
  }
});

app.get("/market", async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const data = await Stock.find({});
    const info = [];

    for (let i = 0; i < data.length; ++i) {
      const prices = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${data[i].symbol}?&interval=5m`
      );
      const results = prices.data.chart.result[0];
      const closePrices = results.indicators.quote[0].close;
      const l = closePrices.length;
      const prevClose = results.meta.previousClose;
      const change = closePrices[l - 1] - prevClose;
      const changePercent = (change * 100) / prevClose;
      info.push({
        name: String(data[i].name),
        symbol: String(data[i].symbol),
        currentPrice: Number(closePrices[l - 1]),
        change: Number(change),
        changePercent: Number(changePercent),
      });
    }
    console.log(info);
    res.json(info);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.get("/portfolio/info", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const cookie = req.cookies.token;
  console.log(cookie);
  let username = "";
  if (cookie) {
    // Verify and decode the JWT
    jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Fuckk");
      } else {
        // Successfully decoded JWT
        console.log(decoded);
        username = decoded.username;
      }
    });
  } else {
    console.log("JWT Cookie not found");
  }
  const portfolio = await Portfolio.find({ userName: username });
  // const stocks = [
  //   { symbol: "HDFCBANK.NS", avgPrice: 1425.12, quantity: 300 },
  //   { symbol: "INFY.NS", avgPrice: 1345.23, quantity: 255 },
  //   { symbol: "BHEL.NS", avgPrice: 124.25, quantity: 1000 },
  //   { symbol: "LT.NS", avgPrice: 3386.25, quantity: 200 },
  // ];
  // const investment = 1572069.65;
  // const balance = 145266.24;
  // const portfolio = await Portfolio.create({
  //   userName,
  //   stocks,
  //   investment,
  //   balance,
  // });
  res.json(portfolio[0]);
});

app.post("/portfolio/buyUpdate", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const body = req.body;
  let flag = true;

  const portfolio = await Portfolio.find({ userName: body.name });
  const stocks = portfolio[0].stocks;
  const investment = portfolio[0].investment + body.amount;
  const balance = portfolio[0].balance - body.amount;
  const quantity = parseFloat(body.quantity);

  for (let i = 0; i < stocks.length; ++i) {
    if (stocks[i].symbol == body.symbol) {
      const q = stocks[i].quantity;
      const p = stocks[i].avgPrice;
      stocks[i].avgPrice = (p * q + body.amount) / (q + quantity);
      stocks[i].quantity = q + quantity;
      flag = false;
      break;
    }
  }

  if (flag) {
    stocks.push({
      symbol: body.symbol,
      avgPrice: body.price,
      quantity: quantity,
    });
  }
  const update = await Portfolio.updateOne(
    { userName: body.name },
    { $set: { stocks: stocks, investment: investment, balance: balance } }
  );

  const response = await Transaction.find({ userName: body.name });
  var currentTime = new Date();
  var currentOffset = currentTime.getTimezoneOffset();
  var ISTOffset = 330; // IST offset UTC +5:30
  var ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  const trades = response[0].trades;
  trades.push({
    tradeType: "Buy",
    symbol: body.symbol,
    price: body.price,
    quantity: quantity,
    amount: body.amount,
    balance: balance,
    profitLoss: 0,
    date: ISTTime,
  });
  await Transaction.updateOne(
    { userName: body.name },
    { $set: { trades: trades } }
  );

  res.json(investment);
});

app.post("/portfolio/prices", async (req, res) => {
  const stocks = req.body.stocks;
  const prices = [];

  for (let i = 0; i < stocks.length; ++i) {
    const price = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${stocks[i].symbol}?&interval=5m`
    );
    const results = price.data.chart.result[0];
    const closePrices = results.indicators.quote[0].close;
    const l = closePrices.length;
    prices.push(closePrices[l - 1]);
  }
  res.json(prices);
});

app.post("/portfolio/sellUpdate", async (req, res) => {
  const body = req.body;
  mongoose.connect(process.env.MONGO_URL);
  const portfolio = await Portfolio.find({ userName: body.name });
  let stocks = portfolio[0].stocks;
  const balance = portfolio[0].balance + body.amount;
  let investment = 0;
  const quantity = parseFloat(body.quantity);

  for (let i = 0; i < stocks.length; ++i) {
    if (stocks[i].symbol == body.symbol) {
      if (quantity < stocks[i].quantity) {
        stocks[i].quantity = stocks[i].quantity - quantity;
        investment = portfolio[0].investment - quantity * stocks[i].avgPrice;
      } else {
        investment = portfolio[0].investment - quantity * stocks[i].avgPrice;
        stocks = stocks.filter((stock) => stock.symbol !== body.symbol);
      }
      break;
    }
  }

  const update = await Portfolio.updateOne(
    { userName: body.name },
    { $set: { stocks: stocks, investment: investment, balance: balance } }
  );

  const response = await Transaction.find({ userName: body.name });
  var currentTime = new Date();
  var currentOffset = currentTime.getTimezoneOffset();
  var ISTOffset = 330; // IST offset UTC +5:30
  var ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  const trades = response[0].trades;
  trades.push({
    tradeType: "Sell",
    symbol: body.symbol,
    price: body.price,
    quantity: quantity,
    amount: body.amount,
    balance: balance,
    profitLoss: body.profit,
    date: ISTTime,
  });
  await Transaction.updateOne(
    { userName: body.name },
    { $set: { trades: trades } }
  );

  res.json(200);
});

app.get("/transactions", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const cookie = req.cookies.token;
  console.log(cookie);
  let username = "";
  if (cookie) {
    // Verify and decode the JWT
    jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Fuckk");
      } else {
        // Successfully decoded JWT
        console.log(decoded);
        username = decoded.username;
      }
    });
  } else {
    console.log("JWT Cookie not found");
  }
  const response = await Transaction.find({ userName: username });
  res.json(response[0].trades);
});

app.get("/news", async (req, res) => {
  const news = [];
  const url = "https://www.moneycontrol.com/news/business/stocks/";

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const container = await page.$x('//*[@id="cagetory"]');
    const liTags = await container[0].$$(".clearfix");

    for (let liTag of liTags) {
      const anchorTag = await liTag.$("h2 a");
      const spanTag = await liTag.$("span");
      const pTag = await liTag.$$("p");
      const anchorTitle = await anchorTag.evaluate((anchor) => anchor.title);
      const anchorHref = await anchorTag.evaluate((anchor) => anchor.href);
      const pText = await pTag[0].evaluate((p) => p.textContent);
      const spanText = await spanTag.evaluate((span) => span.textContent);

      news.push({
        title: anchorTitle,
        description: pText,
        href: anchorHref,
        date: spanText,
      });
    }

    console.log(news);
    res.json(news);

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping the data." });
  }
});

app.get("/indices", async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const data = await Indices.find({});
    const info = [];

    for (let i = 0; i < data.length; ++i) {
      const prices = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${data[i].symbol}?&interval=5m`
      );
      const results = prices.data.chart.result[0];
      const closePrices = results.indicators.quote[0].close;
      const l = closePrices.length;
      const prevClose = results.meta.previousClose;
      const change = closePrices[l - 1] - prevClose;
      const changePercent = (change * 100) / prevClose;
      info.push({
        name: String(data[i].name),
        symbol: String(data[i].symbol),
        currentPrice: Number(closePrices[l - 1]),
        change: Number(change),
        changePercent: Number(changePercent),
      });
    }
    console.log(info);
    res.json(info);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(process.env.PORT);

// Alpha vantage Api key:DRVJFKCLK82Z4BOZ.
// Email is of Tradestack for the above

// Finhub Tradestack acc
// api : ckb6sc9r01ql5f1ncuq0ckb6sc9r01ql5f1ncuqg

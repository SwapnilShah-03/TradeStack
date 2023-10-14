import "./App.css";
import React from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import { Stock, loader as StockLoader } from "./pages/Stock";
import { Market, loader as MarketLoader } from "./pages/Market";
import { Purchase, loader as PurchaseLoader } from "./pages/Purchase";
import { Portfolio, loader as PortfolioLoader } from "./pages/Portfolio";
import News from "./pages/News";
import {
  Transactions,
  loader as TransactionsLoader,
} from "./pages/Transactions";
import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "stock/:symbol",
        element: <Stock />,
        loader: StockLoader,
      },
      {
        path: "market",
        element: <Market />,
        loader: MarketLoader,
      },
      {
        path: "purchase/:symbol",
        element: <Purchase />,
        loader: PurchaseLoader,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
        loader: PortfolioLoader,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "transactions",
        element: <Transactions />,
        loader: TransactionsLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

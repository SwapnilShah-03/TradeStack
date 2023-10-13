import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/logout");
      if (data.status) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
            TradeStack
          </span>
        </a>
        <div className="flex md:order-2">
          {!!user ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-blue-700 font-bold rounded-lg text-sm pe-4 py-2 text-center my-auto md:mr-0"
              >
                {user.username || user.given_name}
              </Link>
              <button
                onClick={logoutHandler}
                className="text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-white hover:text-blue-700 font-bold rounded-lg text-sm pe-4 py-2 text-center md:mr-0"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Login
              </Link>
            </>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-controls="navbar-sticky"
            aria-expanded={isHamburgerOpen}
            onClick={toggleHamburgerMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full ${
            isHamburgerOpen
              ? "md:flex md:w-auto md:order-1"
              : "hidden md:flex md:w-auto md:order-1"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="mr-8">
              <a
                href="/dashboard"
                className="block my-1 py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Dashboard
              </a>
            </li>
            <li className="mr-8">
              <a
                href="/market"
                className="block my-1 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Market
              </a>
            </li>
            <li className="mr-8">
              <a
                href="/portfolio"
                className="block my-1 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Portfolio
              </a>
            </li>
            <li className="mr-8">
              <a
                href="/transactions"
                className="block my-1 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Transactions
              </a>
            </li>
            <li>
              <a
                href="/news"
                className="block my-1 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                News
              </a>
            </li>
          </ul>
        </div>
        <div
          className={`hidden w-full ${isHamburgerOpen ? "block" : ""}`}
          id="navbar-hamburger"
        >
          <ul className="flex flex-col mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <li>
              <a
                href="/dashboard"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded dark:bg-blue-700"
                aria-current="page"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/market"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Market
              </a>
            </li>
            <li>
              <a
                href="/portfolio"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="/transactions"
                className="block py-4 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Transactions
              </a>
            </li>
            <li>
              <a
                href="/news"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                News
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

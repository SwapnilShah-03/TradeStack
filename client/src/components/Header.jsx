import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import axios from "axios";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

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

  const underline =
    "relative w-fit text-base font-Poppins after:block after:content-[''] after:absolute after:h-[1.5px] after:bg-gray-900 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center";

  const buttonHover =
    "relative -top-1 -left-1 font-Poppins bg-gray-900 py-2 px-3.5 text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0";

  const navList = (
    <ul className="my-4 flex flex-col gap-4 xl:mb-0 xl:mt-0 xl:flex-row xl:items-center xl:gap-10 justify-center">
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/dashboard" className={underline}>
          Dashboard
        </Link>
      </Typography>
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/watchlist" className={underline}>
          Watchlist
        </Link>
      </Typography>
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/market" className={underline}>
          Market
        </Link>
      </Typography>
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/portfolio" className={underline}>
          Portfolio
        </Link>
      </Typography>
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/transactions" className={underline}>
          Transactions
        </Link>
      </Typography>
      <Typography as="li" className="p-1 font-normal text-gray-900">
        <Link to="/news" className={underline}>
          News
        </Link>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-4 px-4 xl:px-8 xl:py-4">
      <div className="flex items-center justify-between text-gray-900">
        <a
          href="/"
          className="w-40 cursor-pointer py-1.5 text-xl font-bold font-Poppins"
        >
          TradeStack
        </a>
        <div className="hidden xl:block">{navList}</div>
        <div
          className={`flex justify-around gap-4 ${
            user && user.username && user.username.length > 10
              ? "flex-wrap"
              : ""
          }`}
        >
          {!!user ? (
            <>
              <Typography className="cursor-pointer py-1.5 font-medium font-Poppins">
                <Link to="/dashboard">{user.username || user.given_name}</Link>
              </Typography>
              <button className={buttonHover} onClick={logoutHandler}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Typography className="cursor-pointer py-1.5 font-normal hover:text-black font-Poppins">
                <Link to="/register">Register</Link>
              </Typography>
              <button className={buttonHover}>
                <Link to="/login">Login</Link>
              </button>
            </>
          )}
          <IconButton
            variant="text"
            className="self-center h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent xl:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>{navList}</Collapse>
    </Navbar>
  );
}

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import axios from "axios";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Card,
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
    "relative w-fit text-base font-Poppins after:block after:content-[''] after:absolute after:h-[1.5px] after:bg-blue-gray-900 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center";

  const buttonHover =
    "relative -top-1 -left-1 font-Poppins bg-blue-gray-900 py-2 px-3.5 text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0";

  const navList = (
    <ul className="my-4 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-10 justify-center">
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/" className={underline}>
          Dashboard
        </Link>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/market" className={underline}>
          Market
        </Link>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/portfolio" className={underline}>
          Portfolio
        </Link>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/transactions" className={underline}>
          Transactions
        </Link>
      </Typography>
      <Typography
        as="li"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/news" className={underline}>
          News
        </Link>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <a
            href="/"
            className="mr-4 cursor-pointer py-1.5 text-xl font-bold font-Poppins" 
          >
            TradeStack
          </a>
          <div className="ml-6 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-4">
            {!!user ? (
              <>
                <Typography className="cursor-pointer py-1.5 font-medium font-Poppins">
                  <Link to="/profile">{user.username || user.given_name}</Link>
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
            {/* <Typography className="cursor-pointer py-1.5 font-medium">
              <Link to="/register">Register</Link>
            </Typography>
            <Button
              variant="gradient"
              className="normal-case text-sm px-4 py-[0.6rem]"
              ripple={true}
            >
              <Link to="/login">Login</Link>
            </Button> */}
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
      {/* <div className="mx-auto max-w-screen-md py-12">
        <Card className="mb-12 overflow-hidden">
          <img
            alt="nature"
            className="h-[32rem] w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2717&q=80"
          />
        </Card>
        <Typography variant="h2" color="blue-gray" className="mb-2">
          What is Material Tailwind
        </Typography>
        <Typography color="gray" className="font-normal">
          Can you help me out? you will get a lot of free exposure doing this
          can my website be in english?. There is too much white space do less
          with more, so that will be a conversation piece can you rework to make
          the pizza look more delicious other agencies charge much lesser can
          you make the blue bluer?. I think we need to start from scratch can my
          website be in english?, yet make it sexy i&apos;ll pay you in a week
          we don&apos;t need to pay upfront i hope you understand can you make
          it stand out more?. Make the font bigger can you help me out? you will
          get a lot of free exposure doing this that&apos;s going to be a chunk
          of change other agencies charge much lesser. Are you busy this
          weekend? I have a new project with a tight deadline that&apos;s going
          to be a chunk of change. There are more projects lined up charge extra
          the next time.
        </Typography>
      </div> */}
    </>
  );
}

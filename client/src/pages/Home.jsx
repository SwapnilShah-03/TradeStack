import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-home bg-no-repeat bg-cover bg-center h-[89.5vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-white">
      <Typography className="bg-black/0 text-white text-center text-8xl font-medium font-Outfit">
        Welcome to TradeStack!
      </Typography>
      <Link
        to="/market"
        className="mt-6 px-6 py-5 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <Typography className="text-blue-gray-900 text-center text-2xl font-normal font-Outfit">
          Explore the market
        </Typography>
      </Link>
    </div>
  );
}

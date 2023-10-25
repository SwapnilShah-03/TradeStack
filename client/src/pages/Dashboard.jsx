import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export function Dashboard() {
  return (
    <div className="bg-home bg-no-repeat bg-cover bg-center h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
      <Typography className="flex mb-20 bg-black/0 text-[#eceff1] text-opacity-100 text-center text-8xl font-medium font-Outfit">
        Welcome to TradeStack!
      </Typography>
      <p>Boom Boom Motherfucker the king is back</p>
    </div>
  );
}

export async function loader() {
  const requestIndices = await axios.get("/indices");
  const requestPortfolio = await axios.get("/portfolio/info");
  const requestTransactions = await axios.get("/transactions");
  const indices = requestIndices.data;
  const portfolio = requestPortfolio.data;
  const transactions = requestTransactions.data;
  return { indices, portfolio, transactions };
}

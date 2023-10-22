import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function Home() {
  return (
    <div className="bg-home bg-no-repeat bg-cover bg-center h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
      <Card className="w-fit flex mb-16 bg-black/0">
        <CardBody>
          <Typography className="text-[#eceff1] text-opacity-100 mb-2 text-center text-8xl font-medium font-Outfit">
            Welcome to TradeStack!
          </Typography>
          {/* <Typography variant="h5" className="text-[#eceff1] text-opacity-100 text-center font-normal font-Outfit">
            Welcome to TradeStack!
          </Typography> */}
        </CardBody>
      </Card>
    </div>
  );
}

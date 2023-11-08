import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

export function News() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div className="bg-news bg-no-repeat bg-cover bg-center">
      <div className="grid grid-cols-3 gap-8 p-10">
        {data.map((news) => (
          <Link to={news.href}>
            <Card
              variant="gradient"
              className="flex-row min-h-auto bg-blue-gray-900/70 hover:shadow-md hover:shadow-blue-gray-600/70 ease-in transition duration-150"
            >
              <CardBody>
                <Typography
                  variant="h6"
                  className="mb-4 text-blue-gray-50 text-opacity-40 font-Outfit font-normal"
                >
                  {news.date}
                </Typography>
                <Typography
                  variant="h4"
                  className="mb-4 text-blue-gray-50 font-Outfit font-medium"
                >
                  {news.title}
                </Typography>
                <Typography className="text-blue-gray-50 text-opacity-60 font-Outfit font-medium">
                  {news.description.slice(0, 200)}...
                </Typography>
              </CardBody>
              {/* <CardHeader
              shadow={false}
              floated={false}
              className="m-0 w-2/5 shrink-0 rounded-l-none"
            >
              <img
                src={news.img}
                alt="card-image"
                className="h-full w-full object-cover"
              />
            </CardHeader> */}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/news");
  return response.data;
}

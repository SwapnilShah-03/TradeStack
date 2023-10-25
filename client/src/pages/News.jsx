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
    <div className="grid grid-cols-3 gap-8 p-10">
      {data.map((news) => (
        <Link to={news.href}>
          <Card variant="gradient" className="flex-row h-[17.5rem] bg-[#263238] hover:shadow-lg hover:shadow-[#546e7a] ease-in transition duration-150">
            <CardBody>
              <Typography
                variant="h6"
                className="mb-4 text-[#eceff1] text-opacity-40 font-Outfit font-normal"
              >
                {news.date}
              </Typography>
              <Typography
                variant="h4"
                className="mb-4 text-[#eceff1] font-Outfit font-medium"
              >
                {news.title}
              </Typography>
              <Typography className="text-[#eceff1] text-opacity-60 font-Outfit font-medium">
                {news.description.slice(0, 200)}...
              </Typography>
            </CardBody>
            {/* <CardHeader
          shadow={false}
          floated={false}
          className="m-0 w-2/5 shrink-0 rounded-l-none"
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="card-image"
            className="h-full w-full object-cover"
          />
        </CardHeader> */}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/news");
  return response.data;
}

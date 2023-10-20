import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";

export function News() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div>
      {data.map((news) => (
        <>
          <Link to={news.href}></Link>
          <h2>{news.title}</h2>
          <div>{news.date}</div>
          <div>{news.description}</div>
        </>
      ))}
    </div>
  );
}

export async function loader() {
  const response = await axios.get("/news");
  return response.data;
}

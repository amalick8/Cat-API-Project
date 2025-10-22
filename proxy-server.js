import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/carquery", async (req, res) => {
  const year = req.query.year;
  const url = `https://www.carqueryapi.com/api/0.3/?cmd=getModels&year=${year}&sold_in_us=1`;
  const response = await fetch(url);
  const text = await response.text();
  res.set("Access-Control-Allow-Origin", "*");
  res.send(text);
});

app.listen(5000, () => console.log("Proxy running on port 5000"));

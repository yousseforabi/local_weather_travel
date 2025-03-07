const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const getCityWeather = require("./weather");

require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const API_URL = process.env.TRAFIKVERKET_API_URL;
const AUTH_KEY = process.env.TRAFIKVERKET_API_KEY;
const xmlDataSituation = `
<REQUEST>
  <LOGIN authenticationkey="${AUTH_KEY}"/>
  <QUERY objecttype="Situation" schemaversion="1" limit="10">
    <FILTER>
      <NEAR name="Deviation.Geometry.WGS84" value="12.413973 56.024823"/>
    </FILTER>
  </QUERY>
</REQUEST>
`;

app.get("/fetchDataTrafficSituation", (req, res) => {
  axios
    .post(API_URL, xmlDataSituation, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
    .then((response) => {
      console.log("Response: ", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      res.status(500).send("Failed to fetch data");
    });
});

app.get("/weather", async (req, res) => {
  try {
    const response = await getCityWeather(req.query.city);
    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

const fetchWithTimeout = async (
  url,
  options = {},
  timeout = 5000,
  retries = 3
) => {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const text = await response.text();
      if (response.headers.get("content-type")?.includes("application/json")) {
        return JSON.parse(text);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout, retrying...");
      } else {
        console.error("Fetch error:", error.message);
      }
      if (i === retries - 1) {
        throw new Error("Failed after multiple attempts");
      }
    }
  }
};

app.get("/geocode", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    console.log("Received address:", address);
    const apiKey = process.env.GEO_API_KEY;
    const url = `https://geokeo.com/geocode/v1/search.php?q=${encodeURIComponent(
      address
    )}&api=${apiKey}`;

    const response = await fetch(url);

    console.log("Response status:", response.status);

    const text = await response.text();
    console.log("Response body:", text);

    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      return res.json(data);
    } else {
      return res
        .status(500)
        .json({ error: "Unexpected response format", body: text });
    }
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});

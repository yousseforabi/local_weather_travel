const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
{
  /* logic  */
}

const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";
const AUTH_KEY = "6997014603744628afdafa7896569623"

app.get("/traffic-incidents", async (req, res) => {
  try {
    const jsonReq = {
      REQUEST: {
        LOGIN: { 
          authenticationkey: AUTH_KEY,
        },
        QUERY: [
          {
            objecttype: "Situation",
            namespace: "Road.TrafficInfo",
            schemaversion: "1.5",
            limit: 1,
          },
        ],
      },
    };
    
    const response = await axios.post(API_URL, jsonReq, {
      headers: {
        "Authorization": `Bearer ${AUTH_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/road-condition", async (req, res) => {
  try {
    const jsonReq = {
      REQUEST: {
        LOGIN: { 
          authenticationkey: AUTH_KEY,
        },
        QUERY: [
          {
            objecttype: "RoadCondition",
            namespace: "Road.TrafficInfo",
            schemaversion: "1.3",
            limit: 1,
          },
        ],
      },
    };
    
    const response = await axios.post(API_URL, jsonReq, {
      headers: {
        "Authorization": `Bearer ${AUTH_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});


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

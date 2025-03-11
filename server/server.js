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

let frontendCoordinates = {};

const API_URL = process.env.TRAFIKVERKET_API_URL;
const AUTH_KEY = process.env.TRAFIKVERKET_API_KEY;

app.get("/fetchDataTrafficSituation", (req, res) => {
  const { lat, lon } = req.query; 

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const xmlDataSituation = `
  <REQUEST>
    <LOGIN authenticationkey="${AUTH_KEY}"/>
    <QUERY objecttype="Situation" schemaversion="1" limit="10">
      <FILTER>
        <NEAR name="Deviation.Geometry.WGS84" value="${lon} ${lat}"/>
      </FILTER>
    </QUERY>
  </REQUEST>
  `;

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

app.get("/fetchDataDepartures", (req, res) => {
 // const { lat, lon } = req.query; 
 const lat = 58.9035;
 const lon = 17.9479;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  // PSEUDO CODE
  const nearbyStations = `
<REQUEST>
    <LOGIN authenticationkey="1d8b48bc9b5f4df09c17df61a6b08899" />
    <QUERY objecttype="TrainStation" schemaversion="1">
        <FILTER>
            <WITHIN name="Geometry.WGS84" shape="center" value="17.9479 58.9035" radius="10"/>
        </FILTER>
    </QUERY>
</REQUEST>
  `;

  axios
    .post(API_URL, nearbyStations, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
    .then(async(response) => {
      console.log("Response about nearby stations: ", response.data);
      //res.json(response.data);

      // call another api to get the departures - PSEUDO CODE
      // USE FOREACH TO GET THE DEPARTURES FOR EACH STATION
      // SAVE THE DEPARTURES IN AN ARRAY DEPARTURES
      // RETURN THE ARRAY LIKE res.json(DEPARTURES));
      
      let departures = [];

      for (let i = 0; i < response.data.RESPONSE.RESULT.length; i++) {
        // AdvertisedLocationName
      const departures_for_a_station = `
      <REQUEST>
        <LOGIN authenticationkey="${AUTH_KEY}" />
        <QUERY objecttype="TrainAnnouncement" schemaversion="1.0">
          <FILTER>
            <EQ name="LocationSignature" value="17.9479 58.9035" />`;

            try {
                console.log("making request for station", departures_for_a_station);
            
                  // Make the fetch request
                const response = await fetch('https://api.trafikinfo.trafikverket.se/v2/data.xml', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'text/xml',
                      'Accept': 'application/xml'
                  },
                  body: departures_for_a_station
              });

              // Check if the response was successful
              if (!response.ok) {
                console.log("Response for a station was not ok:", response);
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              console.log("Response for a station was ok, attempting to add to departures array as response.data:", response.data);
              
              departures.push(response.data);
              
              console.log("Departures array after adding response.data:", departures);
            } catch (error) {
              console.error("Error fetching geocode data:", error);
              res.status(500).json({ error: "Internal Server Error" });
            } 
      }; // end of for loop
      res.json(departures);
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

app.post("/logCoordinates", (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  frontendCoordinates = { lat, lon };

  console.log("--------------------------------------------------");
  console.log("FRONTEND COORDINATES RECEIVED - START HERE:");
  console.log("--------------------------------------------------");
  console.log(JSON.stringify(frontendCoordinates, null, 2));
  console.log("--------------------------------------------------");
  console.log("FRONTEND COORDINATES RECEIVED - END HERE:");
  console.log("--------------------------------------------------");
  console.log(
    "FIND THESE COORDINATES IN CODE: 'frontendCoordinates' variable inside '/logCoordinates' POST route."
  );

  res.json({ message: "Coordinates received", lat, lon });
});

app.get("/geocode", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    console.log("Received address:", address);
    console.log("Current frontendCoordinates:", frontendCoordinates);

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

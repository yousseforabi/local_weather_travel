const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const proj4 = require("proj4");
const { getCityWeather, getCityWeatherForecast } = require("./weather");
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let frontendCoordinates = {};
// Configure the projection for SWEREF99TM required by Trafikverket API
proj4.defs("EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

const API_URL = process.env.TRAFIKVERKET_API_URL;
const AUTH_KEY = process.env.TRAFIKVERKET_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await getCityWeather(lat, lon, WEATHER_API_KEY);
    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get("/forecast", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await getCityWeatherForecast(lat, lon, WEATHER_API_KEY);
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

app.get("/findNearestStation", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  // Convert coordinates
  const { x, y } = convertToSWEREF99TM(parseFloat(lat), parseFloat(lon));

  // Compose XML with NEAR tag
  const xmlData = `<REQUEST>
      <LOGIN authenticationkey="${AUTH_KEY}" />
      <QUERY objecttype="TrainStation" schemaversion="1.0">
          <FILTER>
              <NEAR name="Geometry.SWEREF99TM" value="${x} ${y}" mindistance="1" maxdistance="2000" />
          </FILTER>
          <INCLUDE>Prognosticated</INCLUDE>
          <INCLUDE>AdvertisedLocationName</INCLUDE>
          <INCLUDE>LocationSignature</INCLUDE>
          <INCLUDE>Geometry.WGS84</INCLUDE>
      </QUERY>
  </REQUEST>`;
  
  try {
    const response = await axios.post(API_URL, xmlData, {
      headers: {
        "Content-Type": "text/xml",
        Accept: "application/xml",
      },
    });

    const jsonObj = parser.parse(response.data);
    
    const stations = jsonObj.RESPONSE.RESULT.TrainStation || [];

    const transformedStations = stations.map(station => ({
      AdvertisedLocationName: station.AdvertisedLocationName,
      Longitude: parseCoordinates(station.Geometry.WGS84).Longitude,
      Latitude: parseCoordinates(station.Geometry.WGS84).Latitude,
      LocationSignature: station.LocationSignature,
      Prognosticated: station.Prognosticated
    }));

    console.log("TRANSFORMED STATIONS FROM API RESPONSE:", transformedStations);

    if (!Array.isArray(transformedStations)) {
      return res.status(500).json({ error: "Invalid station data received" });
    }

    // Find the nearest station
    const nearestStation = transformedStations.reduce(
      (nearest, station) => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lon),
          station.Latitude,
          station.Longitude
        );
        return !nearest || distance < nearest.distance
          ? { station, distance }
          : nearest;
      },
      { station: null, distance: Infinity }
    );

    console.log("NEAREST STATION:", nearestStation);

    if (nearestStation.station) {
      res.json(nearestStation.station);
    } else {
      res.json({
        LocationSignature: "Cst",
        AdvertisedLocationName: "Stockholm Central",
        Latitude: 59.3307,
        Longitude: 18.0586,
        Prognosticated: true,
      });
    }
  } catch (error) {
    console.error("Error finding nearest station:", error);
    res.status(500).json({ error: "Failed to find nearest station" });
  }
});

app.get("/trainDepartures", async (req, res) => {
  const { stationId } = req.query;

  if (!stationId) {
    return res.status(400).json({ error: "Station ID is required" });
  }

  const [timeNow, timeInFuture] = getTimesWithFutureOffset(2);

  const xmlData = `<REQUEST>
    <LOGIN authenticationkey="${AUTH_KEY}" />
    <QUERY objecttype="TrainAnnouncement" orderby="AdvertisedTimeAtLocation" schemaversion="1.0">
        <FILTER>
            <AND>
                <EQ name="ActivityType" value="Avgang" />
                <EQ name="LocationSignature" value="${stationId}" />
                <GT name="AdvertisedTimeAtLocation" value="${timeNow}" />
                <LT name="AdvertisedTimeAtLocation" value="${timeInFuture}" />
                <EQ name="Canceled" value="false" />
            </AND>
        </FILTER>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>ProductInformation</INCLUDE>
    </QUERY>
  </REQUEST>`;

  try {
    const response = await axios.post(API_URL, xmlData, {
      headers: {
        "Content-Type": "text/xml",
        Accept: "application/xml",
      },
    });


    const jsonObj = parser.parse(response.data);
    
    res.json(jsonObj.RESPONSE.RESULT.TrainAnnouncement || []);
  } catch (error) {
    console.error("Error fetching train departures:", error);
    res.status(500).json({ error: "Failed to fetch train departures" });
  }
});

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function to parse the POINT string and return an object with longitude and latitude
function parseCoordinates(pointString) {
  const coords = pointString.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  return {
    Longitude: parseFloat(coords[1]),
    Latitude: parseFloat(coords[2])
  };
}

// Helper function to convert coordinates to SWEREF99TM
function convertToSWEREF99TM(lat, lon) {
  // WGS84 is the default projection in proj4
  const wgs84 = proj4.defs("WGS84");
  const sweref99tm = proj4.defs("EPSG:3006");

  // Convert coordinates
  const [x, y] = proj4(wgs84, sweref99tm, [lon, lat]);
  return { x, y };
}

function getTimesWithFutureOffset(hoursAhead) {
  const now = new Date(); // Current date and time
  const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000); // Adds specified hours

  // Convert both dates to ISO 8601 strings with 'Z' to indicate UTC time
  const nowIso = now.toISOString();
  const futureTimeIso = futureTime.toISOString();

  return [nowIso, futureTimeIso];
}

app.listen(8080, () => {
  console.log("server running on port 8080");
});

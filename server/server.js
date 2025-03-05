const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const app = express();

const corsOption = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOption));

{
  /* logic  */
}

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

    const data = await fetchWithTimeout(url);
    return res.json(data);
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});

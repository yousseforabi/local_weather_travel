async function getCityWeather(lat, lon, apiKey) {
  if (!lat || !lon) {
    throw new Error("Location coordinates is required to get weather details");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  return await response.json();
}

async function getCityWeatherForecast(lat, lon, apiKey) {
  if (!lat || !lon) {
    throw new Error("Location coordinates is required to get forecast details");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  return await response.json();
}

module.exports = { getCityWeather, getCityWeatherForecast };

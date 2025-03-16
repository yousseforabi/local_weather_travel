async function getCityWeather(cityName, apiKey) {
  if (!cityName) {
    throw new Error("City name is required to get weather details");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  );
  return await response.json();
}

async function getCityWeatherForecast(cityName, apiKey) {
  if (!cityName) {
    throw new Error("City name is required to get forecast details");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  );
  return await response.json();
}

module.exports = { getCityWeather, getCityWeatherForecast };

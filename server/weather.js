function getCityWeather(cityName) {
  if (!cityName) {
    throw new Error("City name is required to get weather details");
  }
  return {
    city: "Stockholm",
    data: "Sample",
  };
}

module.exports = getCityWeather;

import { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  WeatherForecastDay,
  WeatherTodayResponse,
} from "../../types/weather";
import "./Weather.css";
import { useAddressStore } from "../../store/store";

const WeatherComponent = () => {
  const coordinates = useAddressStore((state) => state.coordinates);

  const [currentWeather, setCurrentWeather] =
    useState<WeatherTodayResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coordinates) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentWeatherResponse = await axios.get(
          `http://localhost:8080/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );
        setCurrentWeather(currentWeatherResponse.data);

        const forecastResponse = await axios.get(
          `http://localhost:8080/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );

        processForecastData(forecastResponse.data.list);
      } catch (error: any) {
        setError(error.message || "Could not fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  const processForecastData = (list: List[]) => {
    const processedData: WeatherForecastDay[] = [];
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const timeOfTheDay = new Date(item.dt * 1000).getHours();
      /* Consider only noon temperature*/
      if (timeOfTheDay !== 13) {
        return;
      }

      processedData.push({
        day: date,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        icon: item.weather[0].icon,
      });
    });
    setWeatherData(processedData);
  };

  const getCurrentTime = (timeInMillis: number) =>
    new Date(timeInMillis * 1000).toLocaleTimeString();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentWeather || !weatherData) return null;

  return (
    <div>
      <div className="current-weather">
        <h2>
          {currentWeather.name}, {currentWeather.sys.country}
          <p className="time">{getCurrentTime(currentWeather.dt)}</p>
        </h2>
        <div className="temp">
          <img
            src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
            alt="Weather Icon"
          />
          <p>{currentWeather.main.temp}°C</p>
        </div>
      </div>
      <table className="table-auto">
        <thead>
          <tr className="bg-gray-500">
            <th className="w-1/4 px-2 py-2">Day</th>
            <th className="w-1/4 px-2 py-2 text-center">Artist</th>
            <th className="w-1/4 px-2 py-2 text-center">Year</th>
            <th className="w-1/4 px-2 py-2 text-center">Weather</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((weather) => (
            <tr className="odd:bg-gray-100 even:bg-gray-200">
              <td className="w-1/4 px-2 py-2">{weather.day}</td>
              <td className="w-1/4 px-2 py-2 text-center">
                {weather.temperature}
              </td>
              <td className="w-1/4 px-2 py-2 text-center">
                {weather.humidity}
              </td>
              <td className="w-1/4 px-2 py-2 text-center">
                <img
                  src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                  alt="Weather Icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherComponent;

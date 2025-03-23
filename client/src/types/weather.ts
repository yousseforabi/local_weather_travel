export type Coord = {
  lon: number;
  lat: number;
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type Temperature = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

export type Clouds = {
  all: number;
};

export type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

export type Daylight = {
  country: string;
  sunrise: number;
  sunset: number;
};

export type WeatherTodayResponse = {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Temperature;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Daylight;
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type WeatherForecastResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: List[];
  city: City;
};

export type List = {
  dt: number;
  main: Temperature;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Daylight;
  dt_txt: string;
};

export type City = {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

export type WeatherForecastDay = {
  day: string;
  icon: string;
  humidity: number;
  temperature: number;
};

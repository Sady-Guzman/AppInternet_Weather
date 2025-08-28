import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchWeatherApi } from 'openmeteo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const params = {
    latitude: -29.9059,
    longitude: -71.2501,
    hourly: "temperature_2m",
    bounding_box: "-90,-180,90,180",
  };
  const url = "https://api.open-meteo.com/v1/forecast";

  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const hourly = response.hourly()!;
  const weatherData = {
    hourly: {
      time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + response.utcOffsetSeconds()) * 1000)
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
    },
  };

  res.json(weatherData);
}

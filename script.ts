import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": -29.9059,
	"longitude": -71.2501,
	"hourly": "temperature_2m",
	"bounding_box": "-90,-180,90,180",
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const hourly = response.hourly()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	hourly: {
		time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
			(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
	},
};

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log("\nHourly data", weatherData.hourly)

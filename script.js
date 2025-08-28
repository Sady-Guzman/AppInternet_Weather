async function searchCity() {
  const city = document.getElementById("city").value;
  if (!city) {
	alert("Please enter a city name");
	return;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
	document.getElementById("results").innerHTML = "<p>❌ City not found.</p>";
	return;
  }

  let html = "<h2>Select a city:</h2><ul>";
  geoData.results.forEach(loc => {
	html += `<li><button onclick="getWeather(${loc.latitude}, ${loc.longitude}, '${loc.name}', '${loc.country}')">
	  ${loc.name}, ${loc.country}
	</button></li>`;
  });
  html += "</ul>";

  document.getElementById("results").innerHTML = html;
  document.getElementById("weather").innerHTML = "";
}

async function getWeather(latitude, longitude, name, country) {
  // Request daily forecast (max/min temperatures)
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  const weatherRes = await fetch(weatherUrl);
  const weatherData = await weatherRes.json();

  const dates = weatherData.daily.time;
  const maxTemps = weatherData.daily.temperature_2m_max;
  const minTemps = weatherData.daily.temperature_2m_min;

  // Build a nice table
  let html = `<h2>7-Day Forecast for ${name}, ${country}</h2>
	<table>
	  <tr>
		<th>Date</th>
		<th>🌡 Max (°C)</th>
		<th>❄ Min (°C)</th>
	  </tr>`;

  for (let i = 0; i < dates.length; i++) {
	html += `<tr>
	  <td>${dates[i]}</td>
	  <td>${maxTemps[i]}</td>
	  <td>${minTemps[i]}</td>
	</tr>`;
  }

  html += "</table>";

  document.getElementById("weather").innerHTML = html;
}

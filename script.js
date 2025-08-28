// Buscar ciudad en Open-Meteo Geocoding API
async function searchCity() {
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!data.results || data.results.length === 0) {
    resultsDiv.innerHTML = "<p>No se encontró la ciudad.</p>";
    document.getElementById("weather").innerHTML = "";
    return;
  }

  const place = data.results[0];
  resultsDiv.innerHTML = `<h2>${place.name}, ${place.country}</h2>`;

  fetchWeather(place.latitude, place.longitude);
}

// Obtener clima de 7 días
async function fetchWeather(lat, lon) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto`);
  const data = await res.json();

  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "";

  data.daily.time.forEach((date, i) => {
    const maxTemp = data.daily.temperature_2m_max[i];
    const minTemp = data.daily.temperature_2m_min[i];
    const rainProb = data.daily.precipitation_probability_mean[i];

    // Convertir fecha a dd/mm/yyyy
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${formattedDate}</h3>
      <p>🌡 Máx: ${maxTemp}°C</p>
      <p>❄️ Mín: ${minTemp}°C</p>
      <p>🌧 Prob. lluvia: ${rainProb}%</p>
    `;
    weatherDiv.appendChild(card);
  });
}

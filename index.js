document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cityInput");
  const weatherApiKey = "34655022a819e3d2dcf8cfbc0b4fb284";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const city = input.value.trim();
      getWeather(city);
      getForcast(city); // On appelle les deux en même temps !
    }
  });

  async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=fr`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error("Ville introuvable");

      updateUI(data);
    } catch (error) {
      console.error(error);
      input.value = "";
      input.placeholder = "Ville introuvable";
    }
  }

  function updateUI(data) {
    // Mise à jour Nom et Description
    const cityName = document.getElementById("city-name");
    const weatherDesc = document.getElementById("weather-desc");
    if(cityName) cityName.textContent = data.name;
    if(weatherDesc) weatherDesc.textContent = data.weather[0].description;

    // Mise à jour Températures (toutes les classes .temps)
    const tempEls = document.querySelectorAll(".temps");
    const tempValue = `${Math.round(data.main.temp)}°`;
    tempEls.forEach((el) => { el.textContent = tempValue; });

    // Mise à jour Détails
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('windSpeed');
    const pressure = document.getElementById('pressure');

    if(pressure) pressure.textContent = `${data.main.pressure} hPa`;
    if(wind) wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    if(humidity) humidity.textContent = `${data.main.humidity}%`;

    // Gestion de l'icône principale
    const icon = document.getElementById("weatherIcon");
    const condition = data.weather[0].main;
    const iconMap = {
      Clear: "Sunny_Weather_Icon-removebg-preview.png",
      Clouds: "WhatsApp_Image_2026-02-05_at_22.23.36-removebg-preview.png",
      Rain: "rain.png",
      Drizzle: "rain.png",
      Thunderstorm: "storm.png",
      Snow: "snow.png",
      Mist: "image-removebg-preview.png",
    };
    if(icon) icon.src = iconMap[condition] || "cloudy.png";
  }

  async function getForcast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric&lang=fr`;
    try {
      const answer = await fetch(forecastUrl);
      const donne = await answer.json();

      if (answer.ok) {
        getForcastUi(donne); // On passe 'donne' à la fonction UI
      }
    } catch (error) {
      console.error("Erreur forecast :", error);
    }
  }

  function getForcastUi(donne) {
    const forecastList = document.getElementById('forecast-list');
    if(!forecastList) return;
    
    forecastList.innerHTML = ""; 

    const dailyData = donne.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });

        const forecastHTML = `
            <div class="rec">
                <p class="day">${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</p>
                <div class="rec-content">
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
                    <h4>${day.weather[0].description}</h4>
                </div>
                <p class="temp-range"><b>${Math.round(day.main.temp_max)}°</b>/<span>${Math.round(day.main.temp_min)}°</span></p>
            </div>
        `;
        forecastList.innerHTML += forecastHTML;
    });
  }

  getWeather("Lome");
  getForcast("Lome");
});
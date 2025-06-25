const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const weatherEl = document.getElementById("weather");
const quoteEl = document.getElementById("quote");
const newQuoteBtn = document.getElementById("new-quote");
const themeToggle = document.getElementById("theme-toggle");

const quotes = [
  "Fais de ta vie un rêve, et d’un rêve une réalité. – Saint-Exupéry",
  "Le temps est la plus précieuse des ressources. – Jim Rohn",
  "Chaque seconde compte. – Anonyme",
  "Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours. – Gandhi",
  "Le futur dépend de ce que tu fais aujourd’hui. – Gandhi"
];

const apiKey = "38aecef79849e233a002c1d479b6452f";

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const mins = now.getMinutes().toString().padStart(2, "0");
  const secs = now.getSeconds().toString().padStart(2, "0");

  const date = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  timeEl.textContent = `${hours}:${mins}:${secs}`;
  dateEl.textContent = date;

  // Change theme automatiquement selon l'heure (jour/nuit)
  if (hours >= 7 && hours < 19) {
    if (!document.body.classList.contains("light")) {
      document.body.classList.add("light");
      themeToggle.textContent = "🌞";
    }
  } else {
    if (document.body.classList.contains("light")) {
      document.body.classList.remove("light");
      themeToggle.textContent = "🌙";
    }
  }
}

async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur API météo");
    const data = await response.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    weatherEl.textContent = `Météo : ${temp}°C, ${desc}`;
  } catch (error) {
    weatherEl.textContent = "Impossible de récupérer la météo.";
  }
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(48.8566, 2.3522) // fallback Paris
    );
  } else {
    fetchWeather(48.8566, 2.3522);
  }
}

function showQuote(index) {
  quoteEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.textContent = quotes[index];
    quoteEl.style.opacity = 1;
  }, 400);
}

function randomQuote() {
  const i = Math.floor(Math.random() * quotes.length);
  showQuote(i);
}

newQuoteBtn.addEventListener("click", randomQuote);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

window.addEventListener("load", () => {
  updateClock();
  setInterval(updateClock, 1000);

  getLocationAndWeather();

  randomQuote();
  setInterval(randomQuote, 12000);
});

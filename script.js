// ==============================
// DOM ELEMENTS
// ==============================
const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeather");
const resultSection = document.getElementById("resultSection");
const loader = document.getElementById("loader");

const displayCity = document.getElementById("displayCity");
const displayCountry = document.getElementById("displayCountry");
const displayTemp = document.getElementById("displayTemp");
const displayCondition = document.getElementById("displayCondition");
const displayHumidity = document.getElementById("displayHumidity");
const displayWindSpeed = document.getElementById("displayWindSpeed");
const displayLocalTime = document.getElementById("displayLocalTime");
const weatherIcon = document.getElementById("weatherIcon");

const historyTableBody = document.getElementById("historyTableBody");

const historyData = {};

// ==============================
// EVENTS
// ==============================
getWeatherBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => { if(e.key==="Enter") getWeather(); });

// ==============================
// MAIN FUNCTION
// ==============================
async function getWeather() {
  const cityName = cityInput.value.trim();
  if(!cityName){ alert("Please enter city name"); return; }

  const apiURL = `https://p2pclouds.up.railway.app/v1/learn/weather?city=${cityName}`;

  loader.hidden = false;
  resultSection.hidden = true;

  try {
    const response = await fetch(apiURL);
    if(!response.ok) throw new Error("City not found! Check spelling.");
    const data = await response.json();
    updateUI(data);
  } catch(error) {
    alert(error.message || "Something went wrong!");
  } finally {
    loader.hidden = true;
  }
}

// ==============================
// UPDATE UI
// ==============================
function updateUI(data){
  const city = data.location.name;
  const country = data.location.country;
  const temp = data.current.temp_c;
  const condition = data.current.condition.text;
  const humidity = data.current.humidity;
  const localTime = data.location.localtime;
  const windSpeed = (data.current.wind_mph*1.609).toFixed(1); // km/h
  const icon = data.current.condition.icon;

  displayCity.textContent = city + ", ";
  displayCountry.textContent = country;
  displayTemp.textContent = temp + " °C";
  displayCondition.textContent = condition;
  displayHumidity.textContent = humidity + " %";
  displayWindSpeed.textContent = windSpeed + " km/h";
  displayLocalTime.textContent = localTime;
  weatherIcon.innerHTML = `<img src="${icon}" alt="Weather Icon">`;

  resultSection.hidden = false;

  saveHistory(city,temp,condition,localTime);
}

// ==============================
// HISTORY
// ==============================
function saveHistory(city,temp,condition,localTime){
  const key = city.toLowerCase();
  historyData[key] = {city,temp,condition,localTime};
  renderHistory();
}

function renderHistory(){
  historyTableBody.innerHTML = "";
  Object.values(historyData).forEach(item=>{
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.city}</td><td>${item.temp} °C</td><td>${item.condition}</td><td>${item.localTime}</td>`;
    historyTableBody.appendChild(row);
  });
}

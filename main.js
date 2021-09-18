const api_key = '5053bf0831a345a79eb1d207b066c9f1';
const submit = document.getElementById('submit');
const statsContainer = document.querySelectorAll('.stat-container');
const categories = ['DATE', 'HIGH', 'LOW', 'CONDITION', 'WIND SPEED', 'HUMIDITY', 'UV INDEX'];
const search = document.getElementById('search');

// clear previous search results from DOM before new search
submit.addEventListener('click', (event) => {

  // clear previous weather data
  statsContainer.forEach(container => {
    container.innerHTML = '';
  })

  // append category titles
  statsContainer.forEach((container, category) => {
    const title = categories[category];
    container.textContent = title;
  })
  event.preventDefault();
})

// get user search input and initiate function chain to display weather
function getSearch() {
  const userSearch = search.value;
  getCityCoords(userSearch);
}

// get city coordinates from api call
async function getCityCoords(city, units) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=` +
      `${city}&units=imperial&appid=${api_key}`
      );
    const data = await response.json();
    const latitude = data.city.coord.lat;
    const longitude = data.city.coord.lon;
    const coords = { latitude, longitude };
    getWeather(coords);
  } catch (error) {
    console.log(error);
  }
}

// get weather data from city coordinates
async function getWeather(coords) {
  try {
    const cityCoords = await coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords.latitude}` +
      `&lon=${cityCoords.longitude}&exclude=minutely,hourly&units=imperial&appid=${api_key}`
      );
    const data = await response.json();
    processCurrentWeather(data);
    processDailyWeather(data);
  } catch (error) {
    console.log(error);
  }
}

// capitalize first letter of each word in condition
function caseCondition(condition) {
  const casedCondition = condition.toLowerCase().split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
  return casedCondition;
}

// processes current weather stats into an object/properties
async function processCurrentWeather(data) {
  try {
    const weather = await data;

    console.log(weather);

    const unixTimestamp =  weather.current.dt;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(unixTimestamp*1000).toLocaleDateString("en-us", dateOptions);

    const currentWeather = {
      currentCity: caseCondition(search.value),
      currentTemperature: Math.round(weather.current.temp),
      currentCondition: caseCondition(weather.current.weather[0].description),
      currentDate: date,
      currentHigh: Math.round(weather.daily[0].temp.max),
      currentLow: Math.round(weather.daily[0].temp.min),
      currentWindSpeed: Math.round(weather.current.wind_speed),
      currentHumidity: weather.current.humidity,
      currentUVIndex: Number(weather.current.uvi).toFixed(2)
    }

    if (search.value == "") {
      currentWeather.currentCity = "Los Angeles";
    }

    console.log(currentWeather.currentDate);
    console.log(currentWeather.currentHigh);
    console.log(currentWeather.currentLow);

    appendCurrentToDOM(currentWeather);
  } catch (error) {
    console.log(error);
  }
}

const currentCity = document.getElementById('current-city');
const currentTemperature = document.getElementById('current-temperature');
const currentCondition = document.getElementById('current-condition');
const currentDate = document.getElementById('current-date');
const currentHigh = document.getElementById('current-high');
const currentLow = document.getElementById('current-low');
const currentWindSpeed = document.getElementById('current-wind-speed');
const currentHumidity = document.getElementById('current-humidity');
const currentUVIndex = document.getElementById('current-uvi');

async function appendCurrentToDOM(weatherData) {
  const currentData = await weatherData;

  currentCity.textContent = currentData.currentCity;
  currentTemperature.textContent = currentData.currentTemperature + '°F';
  currentCondition.textContent = currentData.currentCondition;
  currentDate.textContent = currentData.currentDate;
  currentHigh.textContent = `High Temperature: ${currentData.currentHigh}°F`;
  currentLow.textContent = `Low Temperature: ${currentData.currentLow}°F`;
  currentWindSpeed.textContent = `Wind Speed: ${currentData.currentWindSpeed} mph`;
  currentHumidity.textContent = `Humidity: ${currentData.currentHumidity}%`;
  currentUVIndex.textContent = `UV Index: ${currentData.currentUVIndex}`;
}

// processes daily weather stats into an object
async function processDailyWeather(data) {
  try {
    const weather = await data;
    const dailyList = [];

    for (let i = 1; i < weather.daily.length; i++) {
      const unixTimestamp =  weather.daily[i].dt;
      const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      const date = new Date(unixTimestamp*1000).toLocaleDateString("en-us", dateOptions);
  
      const dailyWeather = {
        dailyDate: date,
        dailyHigh: Math.round(weather.daily[i].temp.max),
        dailyLow: Math.round(weather.daily[i].temp.min),
        dailyCondition: caseCondition(weather.daily[i].weather[0].description),
        dailyWindSpeed: Math.round(weather.daily[i].wind_speed) + ' mph',
        dailyHumidity: weather.daily[i].humidity,
        dailyUVIndex: Number(weather.daily[i].uvi).toFixed(2)
      }
      dailyList.push(dailyWeather);
    }
    appendDailyToDOM(dailyList);
  } catch(error) {
    console.log(error);
  }
}

const dailyCategoriesDiv = document.getElementById('daily-categories');
const dailyDateDiv = document.getElementById('daily-date');
const dailyHighTempsDiv = document.getElementById('high-temps');
const dailyLowTempsDiv = document.getElementById('low-temps');
const dailyConditionDiv = document.getElementById('daily-condition');
const dailyWindSpeedDiv = document.getElementById('daily-wind-speed');
const dailyHumidityDiv = document.getElementById('daily-humidity');
const dailyUVIndexDiv = document.getElementById('daily-uv-index');

// appends data from daily process function to DOM
async function appendDailyToDOM(weatherData) {
  const dailyData = await weatherData;

  dailyData.forEach(day => {

    const dailyDate = document.createElement('div');
    dailyDate.id = 'daily-date';
    dailyDate.classList = 'stat';
    dailyDate.textContent = day.dailyDate;
    dailyDateDiv.appendChild(dailyDate);

    const dailyHighTemp = document.createElement('div');
    dailyHighTemp.id = 'high-temp';
    dailyHighTemp.classList = 'stat';
    dailyHighTemp.textContent = day.dailyHigh + '°';
    dailyHighTempsDiv.appendChild(dailyHighTemp);

    const dailyLowTemp = document.createElement('div');
    dailyLowTemp.id = 'low-temp';
    dailyLowTemp.classList = 'stat';
    dailyLowTemp.textContent = day.dailyLow + '°';
    dailyLowTempsDiv.appendChild(dailyLowTemp);

    const dailyCondition = document.createElement('div');
    dailyCondition.id = 'daily-condition';
    dailyCondition.classList = 'stat';
    dailyCondition.textContent = day.dailyCondition;
    dailyConditionDiv.appendChild(dailyCondition);

    const dailyWindSpeed = document.createElement('div');
    dailyWindSpeed.id = 'daily-wind-speed';
    dailyWindSpeed.classList = 'stat';
    dailyWindSpeed.textContent = day.dailyWindSpeed;
    dailyWindSpeedDiv.appendChild(dailyWindSpeed);

    const dailyHumidity = document.createElement('div');
    dailyHumidity.id = 'daily-humidity';
    dailyHumidity.classList = 'stat';
    dailyHumidity.textContent = day.dailyHumidity + '%';
    dailyHumidityDiv.appendChild(dailyHumidity);

    const dailyUVIndex = document.createElement('div');
    dailyUVIndex.id = 'daily-uv-index';
    dailyUVIndex.classList = 'stat';
    dailyUVIndex.textContent = day.dailyUVIndex;
    dailyUVIndexDiv.appendChild(dailyUVIndex);
  })
}

function initialLoad() {
  // append category titles
  statsContainer.forEach((container, category) => {
    const title = categories[category];
    container.textContent = title;
  })
}

initialLoad();
getCityCoords('los angeles');
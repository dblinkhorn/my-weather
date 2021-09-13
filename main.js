const api_key = '5053bf0831a345a79eb1d207b066c9f1';
const submit = document.getElementById('submit');
const stats = document.getElementsByClassName('stat');
const statsContainer = document.getElementsByClassName('stat-container');

submit.addEventListener('click', (event) => {
  if (stats.length > 0) {
    for (let stat = 1; stat < 49; stat++) {
      statsContainer.removeChild(stat);
    }
  }
  event.preventDefault();
})

// get user search input and initiate function chain to display weather
function getSearch() {
  const search = document.getElementById('search');
  const userSearch = search.value;
  getCityCoords(userSearch);
}

// get city coordinates from api call
async function getCityCoords(city) {
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
async function getWeather(coords, units) {
  try {
    const cityCoords = await coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords.latitude}` +
      `&lon=${cityCoords.longitude}&exclude=minutely,hourly&units=imperial&appid=${api_key}`
      );
    const data = await response.json();
    processCurrentWeather(data);
    processDailyWeather(data);
    // return data;
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

    const currentWeather = {
      currentTemp: weather.current.temp,
      currentCondition: caseCondition(weather.current.weather[0].description),
      currentCloudCover: weather.current.clouds,
      currentWindSpeed: weather.current.wind_speed,
      currentHumidity: weather.current.humidity,
      currentUVIndex: weather.current.uvi
    }
  
    console.log('Current Temperature: ' + currentWeather.currentTemp + 'F');
    console.log('Condition: ' + currentWeather.currentCondition);
    console.log('Cloud Cover: ' + currentWeather.currentCloudCover + '%');
    console.log('Wind Speed (mph): ' + currentWeather.currentWindSpeed);
    console.log('Humidity: ' + currentWeather.currentHumidity + '%');
    console.log('UV Index: ' + currentWeather.currentUVIndex);

    return currentWeather;

  } catch (error) {
    console.log(error);
  }
}

// processes daily weather stats into an object/properties
async function processDailyWeather(data) {
  try {
    const weather = await data;
    const dailyList = [];

    for (let i = 1; i < weather.daily.length; i++) {
      const unixTimestamp =  weather.daily[i].dt;
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(unixTimestamp*1000).toLocaleDateString("en-us", dateOptions);
  
      const dailyWeather = {
        dailyDate: date,
        dailyHigh: weather.daily[i].temp.max,
        dailyLow: weather.daily[i].temp.min,
        dailyCondition: caseCondition(weather.daily[i].weather[0].description),
        dailyWindSpeed: weather.daily[i].wind_speed,
        dailyHumidity: weather.daily[i].humidity,
        dailyUVIndex: weather.daily[i].uvi
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

// appendToDOM(dailyList);

// const dw = dailyWeather;
// const cw = currentWeather;

// async function convertTime(data) {
//   const time_data = await data;
//   let unix_timestamp = time_data;
//   let date = new Date(unix_timestamp * 1000);
//   let hours = date.getHours();
//   let minutes = "0" + date.getMinutes();
//   let seconds = "0" + date.getSeconds();

//   // will display time in hh:mm:ss format
//   let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

//   return formattedTime;
// }

// processCurrentWeather(data);
// appendDailyToDOM(dailyList);
// processDailyWeather(data);

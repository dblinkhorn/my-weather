const api_key = '5053bf0831a345a79eb1d207b066c9f1'

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
    return coords;
  } catch (error) {
    console.log(error);
  }
}

const coords = getCityCoords('london');

// get weather data from city coordinates
async function getWeather(coords) {
  try {
    const cityCoords = await coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords.latitude}` +
      `&lon=${cityCoords.longitude}&exclude=minutely,hourly&units=imperial&appid=${api_key}`
      );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

const data = getWeather(coords);

// capitalize first letter of each word in condition
function caseCondition(condition) {
  const casedCondition = condition.toLowerCase().split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
  return casedCondition;
}

// process weather data into separate variables and for DOM
async function processWeather(data) {

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

  for (let i = 1; i < weather.daily.length; i++) {
    const unixTimestamp =  weather.daily[i].dt;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(unixTimestamp*1000).toLocaleDateString("en-us", dateOptions);

    const dailyWeather = {
      dailyHigh: weather.daily[i].temp.max,
      dailyLow: weather.daily[i].temp.min,
      dailyCondition: caseCondition(weather.daily[i].weather[0].description),
      dailyWindSpeed: weather.daily[i].wind_speed,
      dailyHumidity: weather.daily[i].humidity,
      dailyUVIndex: weather.daily[i].uvi
    }

    console.log(date)
    console.log('High Temperature: ' + dailyWeather.dailyHigh);
    console.log('Low Temperature: ' + dailyWeather.dailyLow);
    console.log('Condition: ' + dailyWeather.dailyCondition);
    console.log('Wind Speed (mph): ' + dailyWeather.dailyWindSpeed);
    console.log('Humidity: ' + dailyWeather.dailyHumidity + '%');
    console.log('UV Index: ' + dailyWeather.dailyUVIndex);
  }
}

// async function convertTime(data) {
//   const time_data = await data;
//   let unix_timestamp = time_data;
//   // Create a new JavaScript Date object based on the timestamp
//   // multiplied by 1000 so that the argument is in milliseconds, not seconds.
//   let date = new Date(unix_timestamp * 1000);
//   // Hours part from the timestamp
//   let hours = date.getHours();
//   // Minutes part from the timestamp
//   let minutes = "0" + date.getMinutes();
//   // Seconds part from the timestamp
//   let seconds = "0" + date.getSeconds();

//   // Will display time in 10:30:23 format
//   let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

//   return formattedTime;
// }

processWeather(data);
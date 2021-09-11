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

// process weather data into separate variables and for DOM
async function processWeather(data) {
  const weather = await data;
  console.log(weather);
  const currentTemp = weather.current.temp;
  console.log('Current Temperature: ' + currentTemp + 'F');
  const currentCondition = weather.current.weather[0].description;

  // capitalize first letter of each word in condition
  const currentCasedCondition = currentCondition.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

  console.log('Condition: ' + currentCasedCondition);
  const currentCloudCover = weather.current.clouds;
  console.log('Cloud Cover: ' + currentCloudCover + '%');
  const currentWindSpeed = weather.current.wind_speed;
  console.log('Wind Speed (mph): ' + currentWindSpeed);
  const currentHumidity = weather.current.humidity;
  console.log('Humidity: ' + currentHumidity + '%');
  const currentUVIndex = weather.current.uvi;
  console.log('UV Index: ' + String(currentUVIndex));

  for (let i = 1; i < weather.daily.length; i++) {
    const unixTimestamp = weather.daily[i].dt;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(unixTimestamp*1000).toLocaleDateString("en-us", dateOptions);
    const dailyHigh = weather.daily[i].temp.max;
    const dailyLow = weather.daily[i].temp.min;
    const dailyCondition = weather.daily[i].weather[0].description;
    const currentDailyCondition = currentCondition.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    const dailyWindSpeed = weather.daily[i].wind_speed;
    const dailyHumidity = weather.daily[i].humidity;
    const dailyUVIndex = weather.daily[i].uvi;
    console.log(`${date}`);
    console.log('High Temperature: ' + dailyHigh);
    console.log('Low Temperature: ' + dailyLow);
    console.log('Condition: ' + currentDailyCondition);
    console.log('Wind Speed (mph): ' + dailyWindSpeed);
    console.log('Humidity: ' + dailyHumidity + '%');
    console.log('UV Index: ' + dailyUVIndex);
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
const { App } = require('@slack/bolt');
const axios = require('axios');

const SLACK_BOT_TOKEN = 'your_slack_bot_token';
const SLACK_SIGNING_SECRET = 'your_slack_signing_secret';
const OPENWEATHERMAP_API_KEY = 'your_openweathermap_api_key';

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

app.command('/weather', async ({ command, ack, respond }) => {
  await ack();
  const location = command.text;

  try {
    const weatherData = await getWeatherData(location, OPENWEATHERMAP_API_KEY);
    const response = formatWeatherResponse(weatherData);
    await respond(response);
  } catch (error) {
    console.error(error);
    await respond('Error fetching weather data. Please try again.');
  }
});

async function getWeatherData(location, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
}

function formatWeatherResponse(data) {
  return {
    response_type: 'in_channel',
    text: `Weather for ${data.name}: ${data.weather[0].description}. Temperature: ${data.main.temp} °C. Humidity: ${data.main.humidity}%.`,
  };
}

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Slack bot is running!');
})();

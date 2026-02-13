const https = require("https");

// Fetch data using callbacks
function fetchInfo(url: string, callback: (error: Error | null, data?: any) => void): void {
  https
    .get(url, (res: any) => {
      let info = "";

      res.on("data", (chunk: any) => (info += chunk));

      res.on("end", () => {
        try {
          const json = JSON.parse(info);
          callback(null, json);
        } catch (err) {
          callback(err as Error);
        }
      });
    })
    .on("error", (err: Error) => callback(err));
}

// Weather fetch
function getWeather(callback: (error: Error | null, data?: any) => void) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
  fetchInfo(url, callback);
}

// News fetch
function getNews(callback: (error: Error | null, data?: any) => void) {
  const url = "https://dummyjson.com/posts?limit=5";
  fetchInfo(url, callback);
}

console.log("Getting weather and news using callbacks...");

// Callback demo
getWeather((weatherError, weatherInfo) => {
  if (weatherError) return console.log("Couldn't get the weather data.");
  console.log("Weather data received!");

  getNews((newsError, newsData) => {
    if (newsError) return console.log("Couldn't get the news.");
    console.log("News received!\n");

    console.log("🌦 Current Weather:");
    console.log(weatherInfo.current_weather);

    console.log("\n🗞 Latest News:");
    newsData.posts.forEach((post: any, i: number) =>
      console.log(`${i + 1}. ${post.title}`)
    );
  });
});
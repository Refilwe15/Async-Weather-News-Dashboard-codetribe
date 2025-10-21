import https from "https";

// Function to fetch data using callbacks
function fetchInfo(url: string, callback: (error: Error | null, data?: any) => void): void {
  https
    .get(url, (res) => {
      let info = "";

      res.on("data", (chunk) => {
        info += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(info);
          callback(null, json);
        } catch (err) {
          callback(err as Error);
        }
      });

      res.on("error", (err) => {
        callback(err);
      });
    })
    .on("error", (err) => {
      callback(err);
    });
}

// Function to get weather
function getWeather(callback: (error: Error | null, data?: any) => void) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
  fetchInfo(url, callback);
}

// Function to get news
function getNews(callback: (error: Error | null, data?: any) => void) {
  const url = "https://dummyjson.com/posts?limit=5";
  fetchInfo(url, callback);
}

// Just to update the user on what is happening
console.log("Getting weather and news using callbacks...");

// Callback hell starts here
getWeather((weatherError, weatherInfo) => {
  if (weatherError) {
    console.log("Couldn't find the weather data");
    return;
  } else {
    console.log("Weather data received");
  }

  getNews((newsError, newsData) => {
    if (newsError) {
      console.log("Couldn't get the news");
      return;
    } else {
      console.log("News received!");
      console.log("\nWeather:");
      console.log(weatherInfo.current_weather);

      console.log("\nLatest News:");
      newsData.posts.forEach((post: any, index: number) => {
        console.log(`${index + 1}. ${post.title}`);
      });
    }
  });
});

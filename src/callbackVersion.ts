import https from "https";

// 1. Function to fetch data using callbacks
function fetchData(url: string, callback: (error: Error | null, data?: any) => void) {
  https
    .get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          callback(null, json);
        } catch (err) {
          callback(err as Error);
        }
      });
    })
    .on("error", (err) => {
      callback(err);
    });
}

// 2. Function to get weather
function getWeather(callback: (error: Error | null, data?: any) => void) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
  fetchData(url, callback);
}

// 3. Function to get news
function getNews(callback: (error: Error | null, data?: any) => void) {
  const url = "https://dummyjson.com/posts?limit=5";
  fetchData(url, callback);
}

// 4. Use callback hell: first get weather, then get news
console.log("Getting weather and news using callbacks...");

getWeather((weatherError, weatherData) => {
  if (weatherError) {
    console.error("Error getting weather:", weatherError.message);
    return;
  }

  console.log(" Weather received!");

  getNews((newsError, newsData) => {
    if (newsError) {
      console.error("Error getting news:", newsError.message);
      return;
    }

    console.log(" News received!");
    console.log("\n Weather:");
    console.log(weatherData.current_weather);

    console.log("\Latest News:");
    newsData.posts.forEach((post: any, index: number) => {
      console.log(`${index + 1}. ${post.title}`);
    });
  });
});

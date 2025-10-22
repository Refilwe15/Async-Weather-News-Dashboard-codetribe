import * as https from "https";


//this function takes the url and return a Promise
function fetchInfo(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        });

        res.on("error", (err) => reject(err));
      })
      .on("error", (err) => reject(err));
  });
}

function getWeather(): Promise<any> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
  return fetchInfo(url);
}

function getNews(): Promise<any> {
  const url = "https://dummyjson.com/posts?limit=5";
  return fetchInfo(url);
}

console.log("Getting weather and news using Promises...");

getWeather()
  .then((weather) => {
    console.log("Weather data received!");
    console.log(weather.current_weather);
    return getNews();
  })
  .then((news) => {
    console.log("\nNews received!");
    news.posts.forEach((post: any, i: number) =>
      console.log(`${i + 1}. ${post.title}`)
    );
  })
  .catch((err) => console.error("Error:", err.message));

Promise.all([getWeather(), getNews()])
  .then(([weather, news]) => {
    console.log("\n=== Promise.all ===");
    console.log("Temperature:", weather.current_weather.temperature);
    console.log("First News:", news.posts[0].title);
  })
  .catch((err) => console.error("Error in Promise.all:", err.message));

Promise.race([getWeather(), getNews()])
  .then((result) => {
    console.log("\n=== Promise.race ===");
    if (result.current_weather) console.log("Weather finished first!");
    else console.log("News finished first!");
  })
  .catch((err) => console.error("Error in Promise.race:", err.message));

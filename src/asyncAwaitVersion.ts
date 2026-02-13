import * as https from "https";

// Helper function to fetch JSON data
function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

export async function getWeatherAndNews() {
  try {
    const weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=-25.74&longitude=28.19&current_weather=true";
    const newsURL = "https://dummyjson.com/posts";

    console.log("Fetching data...");

    // Fetch both at once using Promise.all()
    const [weather, news] = await Promise.all([
      fetchJSON(weatherURL),
      fetchJSON(newsURL),
    ]);

    console.log("\n Weather Data:");
    console.log(weather.current_weather);

    console.log("\n Latest News:");
    console.log(news.posts.slice(0, 3));

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Run it
getWeatherAndNews();

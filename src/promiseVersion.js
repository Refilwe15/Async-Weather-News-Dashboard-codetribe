"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
function fetchInfo(url) {
    return new Promise(function (resolve, reject) {
        https
            .get(url, function (res) {
            var data = "";
            res.on("data", function (chunk) { return (data += chunk); });
            res.on("end", function () {
                try {
                    var json = JSON.parse(data);
                    resolve(json);
                }
                catch (err) {
                    reject(err);
                }
            });
            res.on("error", function (err) { return reject(err); });
        })
            .on("error", function (err) { return reject(err); });
    });
}
function getWeather() {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
    return fetchInfo(url);
}
function getNews() {
    var url = "https://dummyjson.com/posts?limit=5";
    return fetchInfo(url);
}
console.log("Getting weather and news using Promises...");
getWeather()
    .then(function (weather) {
    console.log("Weather data received!");
    console.log(weather.current_weather);
    return getNews();
})
    .then(function (news) {
    console.log("\nNews received!");
    news.posts.forEach(function (post, i) {
        return console.log("".concat(i + 1, ". ").concat(post.title));
    });
})
    .catch(function (err) { return console.error("Error:", err.message); });
Promise.all([getWeather(), getNews()])
    .then(function (_a) {
    var weather = _a[0], news = _a[1];
    console.log("\n=== Promise.all ===");
    console.log("Temperature:", weather.current_weather.temperature);
    console.log("First News:", news.posts[0].title);
})
    .catch(function (err) { return console.error("Error in Promise.all:", err.message); });
Promise.race([getWeather(), getNews()])
    .then(function (result) {
    console.log("\n=== Promise.race ===");
    if (result.current_weather)
        console.log("Weather finished first!");
    else
        console.log("News finished first!");
})
    .catch(function (err) { return console.error("Error in Promise.race:", err.message); });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
// Function to fetch data using callbacks
function fetchInfo(url, callback) {
    https_1.default
        .get(url, function (res) {
        var info = "";
        res.on("data", function (chunk) {
            info += chunk;
        });
        res.on("end", function () {
            try {
                var json = JSON.parse(info);
                callback(null, json);
            }
            catch (err) {
                callback(err);
            }
        });
        res.on("error", function (err) {
            callback(err);
        });
    })
        .on("error", function (err) {
        callback(err);
    });
}
// Function to get weather
function getWeather(callback) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true";
    fetchInfo(url, callback);
}
// Function to get news
function getNews(callback) {
    var url = "https://dummyjson.com/posts?limit=5";
    fetchInfo(url, callback);
}
// Just to update the user on what is happening
console.log("Getting weather and news using callbacks...");
// Callback hell starts here
getWeather(function (weatherError, weatherInfo) {
    if (weatherError) {
        console.log("Couldn't find the weather data");
        return;
    }
    else {
        console.log("Weather data received");
    }
    getNews(function (newsError, newsData) {
        if (newsError) {
            console.log("Couldn't get the news");
            return;
        }
        else {
            console.log("News received!");
            console.log("\nWeather:");
            console.log(weatherInfo.current_weather);
            console.log("\nLatest News:");
            newsData.posts.forEach(function (post, index) {
                console.log("".concat(index + 1, ". ").concat(post.title));
            });
        }
    });
});

/* global require, undefined, console, module */
// File stream
var fs = require("fs");
// HTTP client makes http calls
var request = require("request");
// HTML perser
var cheerio = require("cheerio");
// MVC framework
var express = require("express");
var app = express();
app.get("/scrape", function(req, res) {
  "use strict";
  var url = "http://www.imdb.com/title/tt0076759/";

  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = {
        title: "",
        release: "",
        rating: ""
      };

      $(".header").filter(function() {
        var data = $(this);
        title = data.children().first().text();
        release = data.children().last().children().text();
        json.title = title;
        json.release = release;
      });

      $(".star-box-giga-star").filter(function() {
        var data = $(this);
        rating = data.text();
        json.rating = rating;
      });
    }

    fs.writeFile("output.json", JSON.stringify(json, null, 4), function(err) {
      if (err){
        res.send(err.text());
      } else {
        console.log("File successfully written! - Check your project directory for the output.json file.");
      }
    });

    res.send("Check your console!");
  });
});

app.listen("8081");
console.log("Magic happens on port 8081");
exports = module.exports = app;

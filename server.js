var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");
var path = require("path");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));
// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error){
  console.log("Database Error: ", error);
});

// Main route
app.get("/", function(req, res){
  res.send("Hey I'm here!");
});

// Retrieve all news stories from database
app.get("/all", function(req, res) {
  db.scrapedData.find({}, function (err,found){
    if(err) {
      console.log(err);
    }
    else {
      res.json(found);
      console.log("I'm here!!");
      for (i=0; i<found.length; i++) {
        console.log("counting ...");
      }
    }
  });
})

// Scrape data from news site with cheerio
app.get("/scrape", function(req, res) {
  request("https://news.ycombinator.com/", function(error, response, html){
    var $ = cheerio.load(html);

    $(".title").each(function(i, element){
      var title = $(this).children("a").text();
      var link = $(this).children("a").attr("href");

      // Save in database
      if (title && link){
        db.scrapedData.save({
          title: title,
          link: link
        },
        function(error, saved){
          if(error){
            console.log(error);
          }
          else {
            console.log(saved);
          }
        })
      }
    });
  });
  res.send("scrape done");
});

 
app.listen(3000, function() {
  console.log("app running on port 3000");
});
// Dependencies and configurations

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var db = require("./models");

var PORT = 8080;


var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper"

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// Scraper function

console.log("Grabbing the top 20 songs of 2018 from Pitchfork");
app.get("/scrape", function(req, res) {
  axios
    .get(
      "https://pitchfork.com/features/lists-and-guides/the-100-best-songs-of-2018/?page=5"
    )
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("div.list-blurb__tombstone").each(function(i, element) {
        // populate a result object with the key values from the scrape
        var result = {};
        result.artist = $(element)
          .find("div.list-blurb__artist-work")
          .find("ul")
          .find("li")
          .text();
        result.title = $(element)
          .find("div.list-blurb__artist-work")
          .find("h2")
          .text();
        result.img = $(element)
        .find("div.list-blurb__artwork")
        .find("img")
        .attr("src")
        

        // create a song for each one scraped from the page

        db.Song.create(result)
          .then(function(song) {
              console.log("Song added");
            })
            .catch(function(err) {
                console.log(err);
                res.end();
            });
        });
    });
    

});

app.get("/songs", function(req, res) {
    // Grab every document in the Articles collection
    db.Song.find({})
      .then(function(dbSong) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbSong);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

app.get("/songs/:id", function (req, res) {
    db.Song.findOne({_id: req.params.id}).populate("note").then(function(dbSong) {
        res.json(dbSong);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/songs/:id", function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Song.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    }).then(function(dbSong) {
        res.json(dbSong);
    }).catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

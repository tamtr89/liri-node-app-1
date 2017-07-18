//=============================================================================
// Initialization
//=============================================================================
var keys = require("./keys");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// Parse input
// Position 2 = command
var command = process.argv[2];
// Anything after that is an argument for that command
var args = process.argv.slice(3, process.argv.length).join(" ");

//=============================================================================
// Functions
//=============================================================================
// String utility, see: https://stackoverflow.com/a/196991/3424316
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
//-----------------------------------------------------------------------------
// Use twitter npm package to fetch latest tweets
function fetchTweets() {
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if (error) throw error;
    for (var i = 0; i < tweets.length; i++) {
      console.log("───────────────────────────────────────────");
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
    }
    console.log("───────────────────────────────────────────");
  });
}
//-----------------------------------------------------------------------------
// Use node-spotify-api to fetch track info from Spotify
function spotifyIt(song) {
  var spotify = new Spotify({
    id: "0c3e5d54acab475dbc54a4fad8abecc8",
    secret: "757553f49f3040c689ac8308562d498d"
  });
  spotify
    .search({
      type: 'track',
      query: song
    })
    .then(function(response) {
      var songInfo = response.tracks.items[0];
      if (songInfo) {
        console.log("───────────────────────────────────────────");
        console.log("SONG:   \"" + toTitleCase(song) + "\"");
        console.log("ARTIST: " + songInfo.artists[0].name);
        console.log("ALBUM:  " + songInfo.album.name);
        console.log("LINK:   " + songInfo.href);
      } else {
        console.log("Hmmm... couldn't find that song. Try another one.");
      }
      console.log("───────────────────────────────────────────");
    })
    .catch(function(err) {
      console.log(err);
    });
}
//-----------------------------------------------------------------------------
// Use request to fetch movie info from OMDB
function movieThis(title) {
  if (title == "") {
    title = "mr nobody";
  }
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";

  // This line is just to help us debug against the actual URL.
  request(queryUrl, function(error, response, body) {
    // If the request was successful...
    if (!error && response.statusCode === 200) {
      var content = JSON.parse(body);
      if (content.Title === undefined) {
        console.log("───────────────────────────────────────────");
        console.log("Hmm... I couldn't find that movie. Try another one.");
      } else {
        // Then log the body from the site!
        console.log("───────────────────────────────────────────");
        console.log("TITLE:           " + content.Title);
        console.log("YEAR:            " + content.Year);
        console.log("IMDB Rating:     " + content.Ratings[0].Value);
        console.log("Rotten Tomatoes: " + content.Ratings[1].Value);
        console.log("Country:         " + content.Country);
        console.log("Language:        " + content.Language);
        console.log("Plot:            " + content.Plot);
        console.log("Actors:          " + content.Actors);
      }
    } else {
      console.log(error);
    }
    console.log("───────────────────────────────────────────");
  });
}
//=============================================================================
// Runtime
//=============================================================================
switch (command) {
  case "my-tweets":
    fetchTweets();
    break;
  case "spotify-this-song":
    spotifyIt(args);
    break;
  case "movie-this":
    movieThis(args);
    break;
  case "do-what-it-says":
    console.log("You're trying to do what it says.");
    break;
  default:
    console.log("Sorry, I don't know how to do that yet.");
}

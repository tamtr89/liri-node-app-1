// Initialization
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// User input
var command = process.argv[2];

switch(command) {
  case "my-tweets":
    // console.log("You're trying to fetch tweets.");
    fetchTweets();
    break;
  case "spotify-this-song":
    console.log("You're trying to use Spotify.");
    break;
  case "movie-this":
    console.log("You're trying to query OMDB.");
    break;
  case "do-what-it-says":
    console.log("You're trying to do what it says.");
    break;
  default:
    console.log("Sorry, I don't know how to do that yet.");
}

function fetchTweets() {
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if(error) throw error;
    for (var i = 0; i < tweets.length; i++) {
      console.log("----------------------------------");
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
    }
    console.log("----------------------------------");
  });
}

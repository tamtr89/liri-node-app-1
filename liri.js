// Initialization
var keys = require("./keys");

// User input
var command = process.argv[2];

switch(command) {
  case "my-tweets":
    console.log("You're trying to fetch tweets.");
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

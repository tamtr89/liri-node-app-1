//=============================================================================
// Initialization
//=============================================================================
var keys = require("./keys");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var firstRun = require('first-run');
var chalk = require('chalk');
var inquirer = require('inquirer');
// Parse input
// These used to be from process.argv, but now they're coming from prompts
var command;
var args;

//=============================================================================
// Functions
//=============================================================================
//-----------------------------------------------------------------------------
// Prompts user for input
function init() {
  // If this is the first time the user is running the app, include title graphic
  if(firstRun()) {
    console.log('\033c'); // clears out the terminal... usually.
    console.log(chalk.magenta("   __ _      _ "));
    console.log(chalk.magenta("  / /(_)_ __(_)"));
    console.log(chalk.yellow(" / / | | '__| |"));
    console.log(chalk.green("/ /__| | |  | |"));
    console.log(chalk.blue("\\____/_|_|  |_|"));
    console.log(chalk.blue("Welcome to Liri, the world's lamest personal assistant."));
    console.log(chalk.gray("───────────────────────────────────────────"));
  }
  inquirer.prompt([
    {
      "name": 'commandChoice',
      "message": 'What would you like to do?',
      "type": 'list',
      "choices": ['my-tweets','spotify-this-song', 'movie-this', 'do-what-it-says', 'clear'],
      filter: function (str){
        return str.toLowerCase();
      }
    },
    {
      type: 'input',
      name: 'arg',
      message: 'Cool, what song?',
      when: function (answers) {
        return answers.commandChoice==="spotify-this-song";
      }
    },
    {
      type: 'input',
      name: 'arg',
      message: 'Nice, which movie?',
      when: function (answers) {
        return answers.commandChoice==="movie-this";
      }
    }
  ])
  .then(function(answers){
    console.log(answers.commandChoice);
    command = answers.commandChoice;
    args = answers.arg;
    brain(answers.commandChoice, answers.arg);
  });
}
//-----------------------------------------------------------------------------
// The command center of the app
function brain(command, args) {
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
      doIt();
      break;
    case "clear":
      clearFirstRun();
      break;
    default:
      console.log("Sorry, I don't know how to do that yet.");
  }
}
//-----------------------------------------------------------------------------
// String utility, see: https://stackoverflow.com/a/196991/3424316
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
//-----------------------------------------------------------------------------
// Use twitter npm package to fetch latest tweets
function fetchTweets() {
  var output = "";
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if (error) throw error;
    for (var i = 0; i < tweets.length; i++) {
      output += "───────────────────────────────────────────\n";
      output += tweets[i].created_at + "\n";
      output += tweets[i].text + "\n";
    }
    output += "───────────────────────────────────────────\n";
    logIt(output);
    console.log(output);
  });
}
//-----------------------------------------------------------------------------
// Use node-spotify-api to fetch track info from Spotify
function spotifyIt(song) {
  var output = "";
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
        output += "───────────────────────────────────────────\n";
        output += "SONG:   \"" + toTitleCase(song).trim() + "\"\n";
        output += "ARTIST: " + songInfo.artists[0].name+"\n";
        output += "ALBUM:  " + songInfo.album.name+"\n";
        output += "LINK:   " + songInfo.href+"\n";
      } else {
        output += "Hmmm... I couldn't find that song. Try another one.\n";
      }
      output += "───────────────────────────────────────────\n";
      logIt(output);
      console.log(output);
    })
    .catch(function(err) {
      console.log(err);
    });
}
//-----------------------------------------------------------------------------
// Use request to fetch movie info from OMDB
function movieThis(title) {
  var output = "";
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
        output += "\n───────────────────────────────────────────\n";
        output += "Hmm... I couldn't find that movie. Try another one.\n";
      } else {
        // Then log the body from the site!
        output += "───────────────────────────────────────────\n";
        output += "TITLE:           " + content.Title + "\n";
        output += "YEAR:            " + content.Year + "\n";
        output += "IMDB Rating:     " + content.Ratings[0].Value + "\n";
        output += "Rotten Tomatoes: " + content.Ratings[1].Value + "\n";
        output += "Country:         " + content.Country + "\n";
        output += "Language:        " + content.Language + "\n";
        output += "Plot:            " + content.Plot + "\n";
        output += "Actors:          " + content.Actors + "\n";
      }
    } else {
      output += error;
    }
    output += "\n───────────────────────────────────────────\n";
    logIt(output);
    console.log(output);
  });

}
//-----------------------------------------------------------------------------
// Execute the contents of a text file
function doIt() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    command = dataArr[0];
    args = dataArr[1];
    brain(command, args);
  });
}
//-----------------------------------------------------------------------------
// Log data to an external file
function logIt(output) {
  // Set up the output
  var sep = "═══════════════════════════════════════════\n";
  var argsText = "";
  if(args) {
    argsText = "Argument: "+args+"\n";
  }
  output = sep + "\n" + Date() + "\nCommand: "+command+"\n"+argsText+output;
  // Write/append to the file
  fs.appendFile("log.txt", output, function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log(err);
    }
    // Otherwise, it will print: "log.txt was updated!"
    console.log("The log file was updated!");
  });
}
//-----------------------------------------------------------------------------
// Reset the app state
function clearFirstRun() {
  // Clear out log file
  fs.writeFile("log.txt", "", function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log(err);
    }
    // Otherwise, it will print: "log.txt was updated!"
    console.log('\033c');
    console.log("The log file was cleared! I feel... young. Fresh. New.");
    console.log(chalk.gray("───────────────────────────────────────────"));
  });
  // See https://www.npmjs.com/package/first-run
  firstRun.clear();

}
//=============================================================================
// Runtime
//=============================================================================
//brain(command, args);
init();

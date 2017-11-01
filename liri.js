var Request = require('request');
var Spotify = require('spotify');
var Twitter = require('twitter');
var fs = require('fs');
var keys = require("./keys.js");

var client = new Twitter(keys.twitterKeys);

var action = process.argv[2];

switch (action) {
  case "my-tweets":
    listTweets();
    break;

  case "spotify-this-song":
    spotifyThis();
    break;

  case "movie-this":
    movieLookUp();
    break;

  case "do-what-it-says":
    doIt();
    break;
}

// TWITTER
function listTweets(){
	var params = {screen_name: "DummyMcpaterson"};

	client.get('search/tweets', {q: "DummyMcpaterson"}, function(error, tweets, response){
		if (error){
		  	console.log('error:', error);
		  	console.log('statusCode:', response && response.statusCode);
	  	} else {
	  		for (i=0;i<tweets("statuses").length;i++){
	  			console.log("----------------------");
	  			console.log("Dummy tweeted: '" + tweets("statuses")[i].text +"'");
	  			console.log("Tweeted on: " + tweets("statuses")[i]("created_at"));
	  		}
	  	}
	});
}

// SPOTIFY
function spotifyThis(){

	var nodeArgs = process.argv;
	var song = "";

	for (i=3;i<nodeArgs.length;i++){
  		song = song + " " + nodeArgs[i];
	}

	if (nodeArgs.length === 3){
		song = "Ace of Base";
	}

	console.log("Searching for: " + song);

	Spotify.search({ type: 'track', query: song }, function(error, data) {

	    if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    } else {
	    	console.log("---------------------");
	    	console.log("Artist(s): " + data("tracks").items[1].artists[0].name);
	    	console.log("Song Title: " + data("tracks").items[0].name);
	    	console.log("Preview Link: " + data("tracks").items[0].preview_url);
	    	console.log("Album Name: " + data("tracks").items[0].album.name);
	    	console.log("---------------------");
	    }

	});
}

// OMDB API
function movieLookUp(){

	var nodeArgs = process.argv;
	var movie = nodeArgs[3];

	for (i=4;i<nodeArgs.length;i++){
		movie += "+" + nodeArgs[i];
	}

	//  Default movie "Mr. Nobody."
	if (nodeArgs[3] === undefined){
		movie = "Mr+Nobody";
	}

	var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&r=json";

	Request(movieQueryURL, function (error, response, body) {

	  if (error){
	  	console.log('error:', error);
	  	console.log('statusCode:', response && response.statusCode);
	  } else {
	  	var obj = JSON.parse(body);

	  	console.log("----------");
	  	console.log("Title: " + obj("Title"));
	  	console.log("Year: " + obj("Year"));
	  	console.log("IMDB Rating: " + obj("imdbRating"));
	  	console.log("Produced in: " + obj("Country"));
	  	console.log("Language: " + obj("Language"));
	  	console.log("Plot: " + obj("Plot"));
	  	console.log("Actors: " + obj("Actors"));
	  	console.log("Rotten Tomatoes Rating: " + obj.Ratings[1].Value);
	  	console.log("Rotten Tomatoes URL: " + obj.tomatoURL);
	  	console.log("----------");
	  }
	});
}

function doIt(){

	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error){
		  	console.log('error:', error);
		  	console.log('statusCode:', response && response.statusCode);
		} else {
		  var cleanData = data.replace(/['"]+/g, '');
		  var commands = cleanData.split(",");
		  for(i=0;i<commands.length;i++)
		  	process.argv[i+2] = commands[i];

		  }

		  // TEST
		  var action = process.argv[2];

			switch (action) {
			  case "my-tweets":
			    listTweets();
			    break;

			  case "spotify-this-song":
			    spotifyThis();
			    break;

			  case "movie-this":
			    movieLookUp();
			    break;
			}
		});
}

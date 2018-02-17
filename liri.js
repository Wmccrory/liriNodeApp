//liri command line assistant//////////////////////////////

//node import and key creation//
	//dotenv node
	require("dotenv").config();
	var dotenv = require("dotenv");
	//var holding fs
	var fs = require("fs")
	//twitter node
	var Twitter = require('twitter');
	//spotify node
	var Spotify = require("node-spotify-api");
	//omdb node
	var omdb = require('omdb-client');
	//request node
	var request = require('request');
	//key imports
	var keys = require("./keys.js");
	//var holding twitter keys	
	var client = new Twitter(keys.twitter);
	//var holding spotify keys
	var spotify = new Spotify(keys.spotify);

	//var calling function in node command line
	var action = process.argv[2];
	//var calling keywords in appropriate functions
	var value = process.argv[3];

//functions//

//twitter tweet retriever
var tweetRetrieve = function() {
	var params = {screen_name: "realDonaldTrump", tweet_mode: "extended"};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i++) {
				console.log(tweets[i].user.name + " tweeted: \n'" + tweets[i].full_text + "' \non " + tweets[i].created_at + "\n===============");
			};
		} 
		else 
		{
			console.log(error);;
		}
		});
};

//spotify song retriever
var songRetrieve = function() {
	if (value === undefined) {
		value = "The Sign";
	}
	spotify.search({ type: 'track', query: value }, function(err, data) {
		if ( err ) {
			console.log('Error occurred: ' + err);
			return;
		}
		else
		{
			// console.log(data.tracks.items[0]); api response example
			var response = data.tracks.items[0];
			console.log("'" + response.name + "'\nPerformed by: " + response.artists[0].name + " on the album '" + response.album.name + "'" + "\nListen to a preview here:\n" + response.preview_url)
		}
	});
};

//omdb movie search
var movieRetrieve = function () {
	if (value === undefined) {
		value = "Mr. Nobody";
	}
	var params = {
		apiKey: 'trilogy',
		title: value,
	}
	omdb.get(params, function(err, data) {
		if (!err) {
			console.log(data.Title + "\n" + data.Year + "\nIMDB rating: " + data.Ratings[0].Value + "\nRotten Tomatoes rating: " + data.Ratings[1].Value + "\nProduced in " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nStarring: " + data.Actors)
		} else {
			console.log(err);
		}
	});
};

//run command set in random.txt. Arguments seperated by ','
var randomRetrieve = function () {
	fs.appendFile('log.txt', ("Turns into:" + "\n"), (err) => {  
		if (err) throw err;
	});

	fs.readFile('./random.txt', 'utf8', (err, data) => {
		if (err) throw err;
		
		if (data.indexOf(",") === -1) {
			action = data;
		} else {
			action = data.substring(0, data.indexOf(","));
			value = data.substring(data.indexOf(",") + 1, data.length).trim();
		}
		
		return appDeterminer()
	});
};

//node interaction//
function appDeterminer () {
	inputLogger()
	switch (action) {
		case "my-tweets":
			tweetRetrieve();
			break;

		case "spotify-this-song":
			songRetrieve();
			break;

		case "movie-this":
			movieRetrieve();
			break;

		case "do-what-it-says":
			randomRetrieve();
			break;

		default:
			console.log("I do not understand your commands or accept your authority.");
			break;
	}
}

//send user input into a log file
function inputLogger () {
	fs.appendFile('log.txt', (action + " : " + value + "\n==========\n"), (err) => {  
		if (err) throw err;
	});
}

//initializing javascript functions//////////////////////////////////
appDeterminer()
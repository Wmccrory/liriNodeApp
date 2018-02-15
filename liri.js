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
			console.log("'" + response.name + "'\n Performed by: " + response.artists[0].name + " on the album '" + response.album.name + "'" + "\nListen to a preview here:\n" + response.preview_url)
		}

		// Do something with 'data' 
		});
};

var movieRetrieve = function () {
var params = {
	apiKey: 'trilogy',
	title: 'Last Action Hero',
}
omdb.get(params, function(err, data) {
	if (!err) {
		console.log(data)
		console.log(data.Title + "\n" + data.Year + "\nIMDB rating: " + data.Ratings[0].Value + "\nRotten Tomatoes rating: " + data.Ratings[1].Value + "\nProduced in " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nStarring: " + data.Actors)
	} else {
		console.log(err);
	}
});
};

//node interaction//
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
}
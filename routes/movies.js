var Movie = require('../models/movieSchema')
			, MovieSet = require('../models/movieSetSchema')
			, mongoose = require('mongoose');

// Lists all of the movies.
exports.list = function(req, res) {
  var allMovies = Movie.find({}).sort('title').exec(function (err, response) {
  	if (err) {
  		console.log("error", err);
  	} else {
  		var movies = response;
  		res.render('movieList', {title: "All Movies", list: movies});
  	}
  });
};


// Adds movies/sets.
exports.add = function(req, res) {
	var newSet = new MovieSet({});
	var numSaved = 0;
	for (var i=0; i<3; i++) {
		getMovie(i, req, newSet, function() {
			numSaved++;
			if (numSaved == 3) {
				getMovieSet(newSet);
			}
		});
	}
};

// Checks to see if the movie exists in the database.
function getMovie(i, req, newSet, callback) {
	Movie.findOne({title: req.body.title[i]}).exec(function (err, response) {
		if (err) {
			console.log("Error", err);
		} else if (!response) {
			var newMovie = new Movie({title: req.body.title[i], genre: req.body.genre[i]});
			newMovie.save(function(err) {
				if (err) {
					console.log("Error", err);
				}
			});
			processMovie(newMovie, newSet, callback);
		} else {
			processMovie(response, newSet, callback);
		}
	});
};

// Adds the movie to the set, adds the set to the movie.
function processMovie(movie, newSet, callback) {
	newSet.movieset.addToSet(movie);
	newSet.save(function (err) {
		if (err) {
			console.log("Error", err);
		}
		movie.setIDs.addToSet(newSet);
		movie.save(function (err) {
			if (err) {
				console.log("Error", err);
			}
			callback();
		});
	});
};

// Gets the three movies that were in the set.
function getMovieSet(set) {
	MovieSet.findOne({"_id": set._id}).populate('movieset').exec(function (err, response) {
		if (err) {
			console.log("Error", err);
		} else if (response) {
			getSets(response.movieset, function(allSets) {
				cleanUp(allSets);
			});
		} else if (!response) {
			console.log("No response");
		}
	});
}

// For each movie in a set, get the sets the movie is in. Return a list of all sets.
function getSets(movies, callback) {
	var set0 = getMovieIdsPairedWithMovie(movies[0])
	var set1 = getMovieIdsPairedWithMovie(movies[1])
	var set2 = getMovieIdsPairedWithMovie(movies[2])
	var allSets = [].concat(set0, set1, set2);
	callback(allSets);
}

// Get the movie IDs paired with the movie.
function getMovieIdsPairedWithMovie(movie, callback) {
	var list = [];
	for(var i =0; i < movie.setIDs.length; i ++){
		for (var p = 0; p<movie.setIDs[i].movieset.length; p++) {
			list.push(movie.setIDs[i].movieset[p]);
		}
	}
	return list;
}

// Cleans up the list of movies. Still keeps the original set :(
function cleanUp(movies) {
	var recommendations = [];
	for (var m = 0; m<movies.length; m++) {
		if (recommendations.indexOf(movies[m]) >= 0) {
			continue;
		} else {
			recommendations.push(movies[m]);
		}
	}
	console.log(recommendations);
	finalized(recommendations);
}

function finalized(recommendations) {
	console.log("Here");
	Movie.find({_id: {$in: recommendations}}).exec(function (err, response) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log("Hi");
			console.log(response);

			// omg things are happening.
		}
	});
}


exports.moviesets = function(req, res) {
	var allSets = MovieSet.find({}).populate({}).exec(function (err, response) {
		if (err) {
			console.log("error", err);
		} else {
			console.log(allSets);
			res.render('movieSetList', {title: "All Movie Sets", list: response})
		}
	});
}

exports.delete = function(req, res) {
	var delMovies = Movie.find({}).remove();
	var delMovieSets = MovieSet.find({}).remove();
	res.redirect('/movies');
}
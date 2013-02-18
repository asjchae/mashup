var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
	title: String,
	genre: String,
	setIDs: Array
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
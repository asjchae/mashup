var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
	title: String,
	genre: {type: String, index: true},
	setIDs: Array
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
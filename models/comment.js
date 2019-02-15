var mongoose = require("mongoose")

//Schema Setup for films
var commentSchema = mongoose.Schema({
	text: String,
	author: String
})

module.exports = mongoose.model("Comment",commentSchema);
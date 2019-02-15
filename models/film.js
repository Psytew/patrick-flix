var mongoose = require("mongoose")

//Schema Setup for films
var filmSchema = new mongoose.Schema({
	name: String,
	description: String,
	img: String,
	video: String,
	genre: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})
module.exports = mongoose.model("Film",filmSchema);
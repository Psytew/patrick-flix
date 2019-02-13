var express = require("express"),
	app = express(),
	mongoose = require("mongoose")

//Link to my database
mongoose.connect("mongodb://Patrick:Password@cluster0-shard-00-00-l1try.mongodb.net:27017,cluster0-shard-00-01-l1try.mongodb.net:27017,cluster0-shard-00-02-l1try.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")

//Schema Setup for films
var filmSchema = new mongoose.Schema({
	name: String,
	description: String,
	img: String,
	video: String,
	genre: String
})
var Film = mongoose.model("Film",filmSchema);

//Sets up localhost settings
app.use(express.static(__dirname + '/public'));
const hostname = '127.0.0.1';
const port = 3000;

//Sets ejs as default view engine
app.set("view engine","ejs")

//Loads index page, passes in film data
app.get("/",function(req,res){
	Film.find({},function(err,allFilms){
		if(err){
			console.log(err)
		} else {
			res.render("landing",{films:allFilms})
		}
	})
})

app.get("/films/:id",function(req,res){
	Film.findById(req.params.id,function(err,foundFilm){
		if(err){
			console.log(err)
		} else {
			res.render("show",{film:foundFilm})
		}
	})
})

//Gets the server running
app.listen(port, hostname, function(){
	console.log("Running");
})

//If I want to add more films from here, use this as template

// Film.create({
// 		name:"Lizard Love",
// 		description:"Is there anyone who feels love more strongly than the lizard? Yeah, probably.",
// 		img:"film_data/thumbnails/lizard-love.png",
// 		video:"film_data/films/Lizard_Love.mp4",
// 		genre:"animated"
// 	},function(err,film){
// 		if(err){
// 			console.log(err)
// 		} else {
// 			console.log("New film is " + film)
// 		}
// 	})
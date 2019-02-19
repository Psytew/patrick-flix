var express = require("express"),
	app = express(),
	methodOverride = require("method-override")
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	Film = require("./models/film"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user")

var filmRoutes = require("./routes/films"),
	authRoutes = require("./routes/auth")

//Link to my database
mongoose.connect("mongodb://Patrick:Password@cluster0-shard-00-00-l1try.mongodb.net:27017,cluster0-shard-00-01-l1try.mongodb.net:27017,cluster0-shard-00-02-l1try.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")

//Allows us to parse form submissions
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride("_method"))

//Sets up localhost settings
app.use(express.static(__dirname + '/public'));
const hostname = '127.0.0.1';
const port = 3000;

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I own a pair of orange Heelys and I love them.",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Sets ejs as default view engine
app.set("view engine","ejs")

app.use(function(req,res,next){
	res.locals.currentUser = req.user
	next()
})

app.use(authRoutes)
app.use(filmRoutes)

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
// 		genre:"animated",
// 		comments: []
// 	},function(err,film){
// 		if(err){
// 			console.log(err)
// 		} else {
// 			console.log("New film is " + film)
// 		}
// 	})
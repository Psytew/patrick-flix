var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	Film = require("./models/film"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user")

//Link to my database
mongoose.connect("mongodb://Patrick:Password@cluster0-shard-00-00-l1try.mongodb.net:27017,cluster0-shard-00-01-l1try.mongodb.net:27017,cluster0-shard-00-02-l1try.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")

//Allows us to parse form submissions
app.use(bodyParser.urlencoded({extended: true}));

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

//Films Page
app.get("/films/:id",function(req,res){
	Film.findById(req.params.id,function(err,foundFilm){
		if(err){
			console.log(err)
		} else {
			res.render("show",{film:foundFilm})
		}
	})
})

//Comments Page
app.get("/films/:id/comments",function(req,res){
	Film.findById(req.params.id).populate("comments").exec(function(err,foundFilm){
		if(err){
			console.log(err)
		} else {
			res.render("comments",{film:foundFilm})
		}
	})
})

app.post("/films/:id/comments",isLoggedIn,function(req,res){
	Film.findById(req.params.id,function(err,film){
		if(err){
			console.log(err)
			res.redirect("/films")
		} else {
			// console.log(req.body.comment)
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err)
				} else {
					film.comments.push(comment);
					film.save()
					res.redirect("/films/" + film._id + "/comments")
				}
			})
		}
	})
})

//AUTHORIZATION ROUTES

app.get("/register",function(req,res){
	res.render("register")
})

app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password,function(err,user){
		if(err){
			console.log(err)
			return res.render("register")
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/")
		})
	})
})

app.get("/login",function(req,res){
	res.render("login")
})

app.post("/login",passport.authenticate("local",
	{successRedirect:"/",
	failureRedirect:"/login"
	}),function(req,res){
})

app.get("/logout",function(req,res){
	req.logout()
	res.redirect("/")
})

//MIDDLEWARE
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

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
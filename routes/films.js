var express = require("express")
var router = express.Router();
var Film = require("../models/film")
var Comment = require("../models/comment")

//Loads index page, passes in film data
router.get("/",function(req,res){
	Film.find({},function(err,allFilms){
		if(err){
			console.log(err)
		} else {
			res.render("landing",{films:allFilms})
		}
	})
})

//Films Page
router.get("/films/:id",function(req,res){
	Film.findById(req.params.id,function(err,foundFilm){
		if(err){
			console.log(err)
		} else {
			res.render("show",{film:foundFilm})
		}
	})
})

//Comments Page
router.get("/films/:id/comments",function(req,res){
	Film.findById(req.params.id).populate("comments").exec(function(err,foundFilm){
		if(err){
			console.log(err)
		} else {
			res.render("comments",{film:foundFilm})
		}
	})
})

router.post("/films/:id/comments",isLoggedIn,function(req,res){
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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username
					comment.save()
					film.comments.push(comment);
					film.save()
					res.redirect("/films/" + film._id + "/comments")
				}
			})
		}
	})
})

//MIDDLEWARE
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

module.exports = router
var express = require("express")
var router = express.Router({mergeParams: true});
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

router.get("/films/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if (err){
			res.redirect("back")
		} else {
			res.render('editComment',{film_id:req.params.id,comment:foundComment})
		}
	})
})

router.put("/films/:id/comments/:comment_id/",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if (err){
			res.redirect("back")
		} else {
			res.redirect("/films/" + req.params.id + "/comments")
		}
	})
})

router.delete("/films/:id/comments/:comment_id/",checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if (err){
			res.redirect("back")
		} else {
			res.redirect("back")
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

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back")
			} else {
				console.log("so close")
				if (foundComment.author.id.equals(req.user._id)){
					next()
				} else {
					res.redirect("back")
				}
			}
		})
	} else {
		res.redirect("back")
	}
}

module.exports = router
var express = require("express");
var router = express.Router({mergeParams : true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error","Campground not found");
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
           req.flash("Campground not found");
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.username = req.user.username ;
               comment.author.id = req.user._id;
               comment.save();
               
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
// edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
         if(err || !campground){
                     req.flash("error", "Campground not found");
                      res.redirect("/campgrounds");
         }else
         {
              Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err || !foundComment){
                     req.flash("error", "Comment not found");
                      res.redirect("/campgrounds");
        }else{
            res.render("comments/edit",{campground_id : req.params.id , comment : foundComment});
        }
    });
         }
    });
  
});

//update 
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
     Campground.findById(req.params.id,function(err, campground) {
         if(err || !campground){
                     req.flash("error", "Campground not found");
                      res.redirect("/campgrounds");
         }else
         {
             Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, foundComment){
          if(err || !foundComment){
                     req.flash("error", "Comment not found");
                    res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
         }
    });
  
    
});
//delete
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
              Comment.findByIdAndRemove(req.params.comment_id,function(err, foundComment){
                 if(err || !foundComment){
                     req.flash("error", "Comment not found");
                    res.redirect("back");
                }else{
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
    });

module.exports = router;
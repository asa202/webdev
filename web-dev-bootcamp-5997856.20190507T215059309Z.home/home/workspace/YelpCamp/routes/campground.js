var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
      var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image,price : price, description: desc, author : author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});
//Edit - Edit the already created campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
   Campground.findById(req.params.id,function(err,foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Campground not found");
           res.redirect("back");
       }else {
           res.render("campgrounds/edit", {campground : foundCampground});
       }
   }) ;
});
// Update - Update the edited campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) ;
});
// Delete - delete the campgound
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findByIdAndRemove(req.params.id,function(err){
           if(err ){
               res.redirect("back");
           } else{
               res.redirect("/campgrounds");
           }
        });
});
//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
           res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});



module.exports = router;
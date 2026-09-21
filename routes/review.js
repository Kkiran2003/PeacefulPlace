const express = require("express");
const listing = require("../model/listing.js");
const review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const { validatereview, isLoggedin, isreviewAuthor } = require("../middleware.js");
const router = express.Router({mergeParams : true});

router.post("/",validatereview,isLoggedin, wrapAsync(async(req,res,next)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);

     await newReview.save();
     await list.save();
      req.flash("success","new review created!")
     res.redirect(`/listing/${list._id}`)
}))

router.delete("/:reviewid",
    isLoggedin,isreviewAuthor ,wrapAsync(async(req,res,next)=>{
    let {id , reviewid} = req.params;
   let list = await listing.findByIdAndUpdate(id, {$pull : {reviews:reviewid}});
    console.log(list)
   await review.findByIdAndDelete(reviewid)
    req.flash("success","review deleted successfully!")
    res.redirect(`/listing/${id}`);
    
}));

module.exports = router;
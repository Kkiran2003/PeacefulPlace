const express = require("express");
const listing = require("../model/listing.js");
const review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../ExpressError.js")
const { reviewSchema} = require("../schema.js")
const router = express.Router({mergeParams : true});

const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((e1) => e1.message).join(",");
      return next(new ExpressError(400,errmsg));
    }
   next(); 
}

router.post("/",validatereview, wrapAsync(async(req,res,next)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    list.reviews.push(newReview);

     await newReview.save();
     await list.save();
     console.log("reviews succesfully added")
     res.redirect(`/listing/${list._id}`)
}))

router.delete("/:reviewid",wrapAsync(async(req,res,next)=>{
    let {id , reviewid} = req.params;
    console.log("running")

    
   let list = await listing.findByIdAndUpdate(id, {$pull : {reviews:reviewid}});
   console.log(list);

   await review.findByIdAndDelete(reviewid)
    res.redirect(`/listing/${id}`);
    
}));

module.exports = router;
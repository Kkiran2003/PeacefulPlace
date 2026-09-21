const listing = require("./model/listing.js");
const Review = require("./model/review.js");
const {listingSchema ,reviewSchema} = require("./schema.js")
const ExpressError = require("./ExpressError.js")



module.exports.isLoggedin = (req,res,next)=>{
 if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","you must be looged in to create a listing");
      return res.redirect("/login")  
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
}

module.exports.isowner = async(req,res,next)=>{
  let { id } = req.params;
   let list = await listing.findById(id);
      if(res.locals.currUser && !list.owener.equals(res.locals.currUser._id)){
      req.flash("error","you are not owner of listing");
       return res.redirect(`/listing/${id}`);
      }
      next()
}

module.exports.validatelisting = async (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((e1) => e1.message).join(",");
      return next(new ExpressError(400,errmsg));
    }
   next();
}

module.exports.validatereview = async(req,res,next)=>{
   let {error} = reviewSchema.validate(req.body);
      if(error){
          const errmsg = error.details.map((e1) => e1.message).join(",");
        return next(new ExpressError(400,errmsg));
      }
     next(); 
}

module.exports.isreviewAuthor = async(req,res,next)=>{
  let { id,reviewid } = req.params;
   let review = await Review.findById(reviewid);
      if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
      req.flash("error","you are not author of review");
       return res.redirect(`/listing/${id}`);
      }
      next()
}

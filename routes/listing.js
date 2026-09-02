const express = require("express");
const listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../ExpressError.js")
const {listingSchema} = require("../schema.js")


const router = express.Router();

const validatelisting = (req,res,next)=>{
    console.log("running...")
    let {error} = listingSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((e1) => e1.message).join(",");
      return next(new ExpressError(400,errmsg));
    }
   next();
}



//index route
router.get("/", wrapAsync(async (req, res,next) => {
    let alllistings = await listing.find();
    res.render("./listing/index.ejs", { alllistings });
}));


router.get("/create", (req, res) => {
    console.log("running")
    res.render("./listing/new.ejs")
})

//create route
router.post("/new", validatelisting, wrapAsync(async (req, res ,next) => {
    let newlisting = new listing(req.body.list);
    await newlisting.save()

    res.redirect("/listing")
}))

//show route
router.get("/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews")
    res.render("./listing/show.ejs", { list })
}))

//edit form
router.get("/:id/edit", wrapAsync(async (req, res ,next) => {
    let { id } = req.params;

    let list = await listing.findById(id);
    res.render("./listing/edit.ejs", { list })
}))

router.put("/edit/:id", validatelisting , wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listing/${id}`);
}))

router.delete("/delete/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deleteRecord = await listing.findByIdAndDelete(id);
    console.log(deleteRecord);
    
    res.redirect(`/listing`);
}))



module.exports = router;
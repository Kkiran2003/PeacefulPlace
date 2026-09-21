const express = require("express");
const listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {isLoggedin, isowner, validatelisting}= require("../middleware.js")

const router = express.Router();




//index route
router.get("/",  wrapAsync(async (req, res,next) => {
    let alllistings = await listing.find();
    res.render("./listing/index.ejs", { alllistings });
}));


router.get("/create",isLoggedin ,(req, res) => {
    console.log(req.user);
    res.render("./listing/new.ejs")
})

//create route
router.post("/new", validatelisting, wrapAsync(async (req, res ,next) => {
    let newlisting = new listing(req.body.list);
    newlisting.owener =req.user._id;
    await newlisting.save()
    req.flash("success","new listing created!")
    res.redirect("/listing")
}))

//show route
router.get("/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({path : "reviews" , populate:{path : "author"},}).populate("owener");
     if(!list){
        req.flash("error","listing you requested does not exist!");
       return res.redirect("/listing")
    }
    res.render("./listing/show.ejs", { list })
}))

//edit form
router.get("/:id/edit",isLoggedin,isowner, wrapAsync(async (req, res ,next) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    if(!list){
        req.flash("error","listing you requested does not exist!");
       return res.redirect("/listing")
    }
    res.render("./listing/edit.ejs", { list })
}))

router.put("/edit/:id", validatelisting , wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
     req.flash("success","listing updated successfully!")
    res.redirect(`/listing/${id}`);
}))

router.delete("/delete/:id",isLoggedin,isowner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deleteRecord = await listing.findByIdAndDelete(id);
    console.log(deleteRecord);
     req.flash("success","listing deleted successfully!")
    res.redirect(`/listing`);
}))



module.exports = router;
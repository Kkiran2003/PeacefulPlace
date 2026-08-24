const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const app = express();
const path = require("path")
const port = 8080;
const Mongo_DB = 'mongodb://127.0.0.1:27017/wonderlust'
const listing = require("./model/listing.js");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./ExpressError.js")
const {listingSchema , reviewSchema} = require("./schema.js")
const review = require("./model/review.js")


const validatelisting = (req,res,next)=>{
    console.log("running...")
    let {error} = listingSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((e1) => e1.message).join(",");
      return next(new ExpressError(400,errmsg));
    }
   next();
}

const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((e1) => e1.message).join(",");
      return next(new ExpressError(400,errmsg));
    }
   next(); 
}

main().then(() => {
    console.log("connetion successfully")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(Mongo_DB)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
res.redirect("/listing")
})

//index route
app.get("/listing", wrapAsync(async (req, res,next) => {
    let alllistings = await listing.find();
    res.render("./listing/index.ejs", { alllistings });
}));

//show route
app.get("/listing/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews")
    res.render("./listing/show.ejs", { list })
}))

app.get("/create", (req, res) => {
    res.render("./listing/new.ejs")
})

//create route
app.post("/new", validatelisting, wrapAsync(async (req, res ,next) => {
    let newlisting = new listing(req.body.list);
    await newlisting.save()

    res.redirect("/listing")
}))

//edit form
app.get("/listing/:id/edit", wrapAsync(async (req, res ,next) => {
    let { id } = req.params;

    let list = await listing.findById(id);
    res.render("./listing/edit.ejs", { list })
}))

app.put("/edit/:id", validatelisting , wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listing/${id}`);
}))

app.delete("/delete/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deleteRecord = await listing.findByIdAndDelete(id);
    console.log(deleteRecord);
    
    res.redirect(`/listing`);
}))

app.post("/listings/:id/review",validatereview, wrapAsync(async(req,res,next)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    list.reviews.push(newReview);

     await newReview.save();
     await list.save();
     console.log("reviews succesfully added")
     res.redirect(`/listing/${list._id}`)
}))

app.delete("/listings/:id/reviews/:reviewid",wrapAsync(async(req,res,next)=>{
    let {id , reviewid} = req.params;
    console.log("running")

    
   let list = await listing.findByIdAndUpdate(id, {$pull : {reviews:reviewid}});
   console.log(list);

   await review.findByIdAndDelete(reviewid)
    res.redirect(`/listing/${id}`);
    
}));

app.all("*splat",(req,res,next)=>{
    next ( new ExpressError(404,"page not found!"))
})

app.use((err,req,res,next)=>{
   let { status,message}=err;
   res.render("./layouts/error.ejs", {message});
})

app.listen(port, () => {
    console.log("server running on port", port)
})
if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}

const dns = require("dns");

// Configure DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const app = express();
const path = require("path")
const port = 8080;
const Mongo_DB = process.env.MONGO_TOKEN
const ejsMate = require("ejs-mate")
const reviewRouter = require("./routes/review.js");
const listRouter = require("./routes/listing.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");


async function main() {
    try {
        await mongoose.connect(Mongo_DB);

        console.log("MongoDB connection successfully");


    } catch (err) {
        console.log("MongoDB connection failed:", err.message);
    }
}

main();

console.log("Environment:", process.env.NODE_ENV);
console.log("MongoDB URL available:", !!Mongo_DB);

if (Mongo_DB) {
    console.log("MongoDB hostname:", new URL(Mongo_DB).hostname);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: Mongo_DB,
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Error in mongo session", err);
});

const sessionOption = {
     store: store,
    secret : "mytopsecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires  : Date.now() + 1000 * 60 * 60 *24 *3,
        maxAge :    1000 * 60 * 60 *24 *3 ,
        httpOnly  : true
    },
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listing",listRouter);
app.use("/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
res.redirect("/listing")
})


// app.all("*splat",(req,res,next)=>{
//     next ( new ExpressError(404,"page not found!"))
// })

app.use((err,req,res,next)=>{
   let { status,message}=err;
   res.render("./layouts/error.ejs", {message});
})

app.listen(port, () => {
    console.log("server running on port", port)
})
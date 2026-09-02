const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const app = express();
const path = require("path")
const port = 8080;
const Mongo_DB = 'mongodb://127.0.0.1:27017/wonderlust'
const ejsMate = require("ejs-mate")
const review = require("./routes/review.js");
const list = require("./routes/listing.js")
const session = require("express-session")


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

const sessionOption = {
    secret : "mytopsecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires  : Date.now() + 1000 * 60 * 60 *24 *3,
        maxAge :    1000 * 60 * 60 *24 *3 ,
        httpOnly  : true
    },
}

app.use(session(sessionOption))


app.use("/listing",list);
app.use("/:id/reviews",review);

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
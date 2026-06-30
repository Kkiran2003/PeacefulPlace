const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const app = express();
const path = require("path")
const port = 8080;
const Mongo_DB = 'mongodb://127.0.0.1:27017/wonderlust'
const listing = require("./model/listing.js");
const ejsMate = require("ejs-mate")


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
app.get("/listing", async (req, res) => {
    let alllistings = await listing.find();
    res.render("./listing/index.ejs", { alllistings });
})
//show route
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id)
    res.render("./listing/show.ejs", { list })
})

app.get("/create", (req, res) => {
    res.render("./listing/new.ejs")
})

//create route
app.post("/new", async (req, res) => {
    let newlisting = new listing(req.body.list);
    await newlisting.save()

    res.redirect("/listing")
})

//edit form
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;

    let list = await listing.findById(id);
    res.render("./listing/edit.ejs", { list })
})

app.put("/edit/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/listing/${id}`);
})

app.delete("/delete/:id", async (req, res) => {
    let { id } = req.params;
    let deleteRecord = await listing.findByIdAndDelete(id);
    console.log(deleteRecord);
    
    res.redirect(`/listing`);
})

app.listen(port, () => {
    console.log("server running on port", port)
})
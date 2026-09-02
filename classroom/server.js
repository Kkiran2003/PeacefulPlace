const express = require("express");
const app = express();
const users = require("./user.js");
const posts = require("./post.js")
const cookieParser = require('cookie-parser');
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path");
const ejsMate = require("ejs-mate")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
})

app.get("/register", (req, res, next) => {
  const { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not register")
  } else {
    req.flash("success", "user register succesfully!")
  }
  res.redirect("/hello")
})

app.get("/hello", (req, res) => {


  res.render("page.ejs", { name: req.session.name })
})

//   app.get("/count",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`session count is ${req.session.count} number`);
//   })

// app.use(cookieParser("seceratecode"))

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("kiran","Diksha");
//     res.send("cookie send")
// })

// app.get("/greet",(req,res)=>{
//     let {name = "annoymous"} = req.cookies;
//     res.send(`hello ${name}`)
// })

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","india", {signed : true})
//     res.send("cookie send")
// })

// app.get("/",(req,res,next)=>{
//     console.log(req.cookies)

//     console.log(req.signedCookies)

//     res.send("hii,I am Root")
// })

// app.use("/user",users)
// app.use("/posts",posts)





app.listen(3000, () => {
  console.log("server running on 3000");

})
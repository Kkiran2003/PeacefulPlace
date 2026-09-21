const express = require("express");
const User = require("../model/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveredirectUrl } = require("../middleware.js");

const router = express.Router();

router.get("/signup",async(req,res)=>{
    res.render("./users/from.ejs")
})

router.post("/signup",async(req,res)=>{
    try{let {username,email,password} = req.body;
    let user = new User({
        username ,email
    });
    let registerdeduser = await User.register(user,password);
    req.login(registerdeduser , (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wonderlust")
        res.redirect("/listing")
    })
   }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup")
}
})

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
});

router.post("/login",saveredirectUrl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),(req,res)=>{
    let {username} = req.body
    req.flash("success",`welcome back to wonderlust ${username}`)
    let redirectUrl = res.locals.redirectUrl || "/listing" ;
    console.log("URL",redirectUrl)
    res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
         req.flash("success",`you logged out!`)
    res.redirect("/listing");
    })
});


module.exports = router
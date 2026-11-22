 const User = require("../model/user.js");

 module.exports.rendersignup = async (req, res) => {
    res.render("./users/from.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let user = new User({
            username, email
        });
        let registerdeduser = await User.register(user, password);
        req.login(registerdeduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wonderlust")
            res.redirect("/listing")
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.renderlogin = (req, res) => {
    res.render("./users/login.ejs")
}

module.exports.login =  (req, res) => {
    let { username } = req.body
    req.flash("success", `welcome back to wonderlust ${username}`)
    let redirectUrl = res.locals.redirectUrl || "/listing";
    console.log("URL", redirectUrl)
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", `you logged out!`)
        res.redirect("/listing");
    })
}
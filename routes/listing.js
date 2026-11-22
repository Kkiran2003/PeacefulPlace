const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedin, isowner, validatelisting}= require("../middleware.js")
const router = express.Router();
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

//index route
router.get("/",  wrapAsync(listingController.index));
router.get("/create",isLoggedin , listingController.create)
//create route
router.post("/new",validatelisting,upload.single('list[image][url]'), wrapAsync(listingController.new))
router.post("/search", wrapAsync(listingController.search))

//show route
router.get("/:id", wrapAsync(listingController.show))
//edit form
router.get("/:id/edit",isLoggedin,isowner, wrapAsync(listingController.getEdit))
router.put("/edit/:id", validatelisting ,upload.single('list[image][url]'), wrapAsync(listingController.edit))
router.delete("/delete/:id",isLoggedin,isowner, wrapAsync(listingController.delete))

module.exports = router;
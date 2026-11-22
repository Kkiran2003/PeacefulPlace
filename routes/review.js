const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const { validatereview, isLoggedin, isreviewAuthor } = require("../middleware.js");
const router = express.Router({mergeParams : true});
const reviewController = require("../controllers/review.js")

router.post("/",validatereview,isLoggedin, wrapAsync(reviewController.add));
router.delete("/:reviewid",
    isLoggedin,isreviewAuthor ,wrapAsync(reviewController.delete));

module.exports = router;
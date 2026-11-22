const listing = require("../model/listing");
const passport = require("passport");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    let alllistings = await listing.find();
       res.render("./listing/index.ejs", {
        alllistings,
        searchTerm: ""
    });
}

module.exports.create = (req, res) => {
    res.render("./listing/new.ejs")
}

module.exports.new = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.list.location,
        limit: 1
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new listing(req.body.list);
    newlisting.owener = req.user._id;
    newlisting.image.url = url;
    newlisting.image.filename = filename;
    newlisting.geometry = response.body.features[0].geometry;
    let result = await newlisting.save()
    console.log(result)

    req.flash("success", "new listing created!")
    res.redirect("/listing")
}

module.exports.search = async (req, res) => {
    let { q } = req.body;
    let alllistings = await listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });
    res.render("./listing/index.ejs", {
        alllistings,
        searchTerm: q
    });
};
module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owener");
    if (!list) {
        req.flash("error", "listing you requested does not exist!");
        return res.redirect("/listing")
    }
    res.render("./listing/show.ejs", { list })
}

module.exports.getEdit = async (req, res, next) => {

    let { id } = req.params;
    let list = await listing.findById(id);
    if (!list) {
        req.flash("error", "listing you requested does not exist!");
        return res.redirect("/listing")
    }
    let originalimage = list.image.url;
    originalimage = originalimage.replace("/upload", "/upload/h_200,w_200");
    res.render("./listing/edit.ejs", { list, originalimage })
}

module.exports.edit = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.list.location,
        limit: 1
    })
        .send()
    let { id } = req.params;
    let list = await listing.findByIdAndUpdate(id, { ...req.body.list });
    list.geometry = response.body.features[0].geometry;
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = { url, filename }
        await list.save()
    }
    await list.save();
    req.flash("success", "listing updated successfully!")
    res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res, next) => {
    let { id } = req.params;
    let deleteRecord = await listing.findByIdAndDelete(id);
    console.log(deleteRecord);
    req.flash("success", "listing deleted successfully!")
    res.redirect(`/listing`);
}
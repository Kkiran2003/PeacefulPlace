const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {

        filename: {
            type: String,
            default: "HomeImage"
        },
        url: {
            type: String,
            default: "https://a0.muscache.com/im/pictures/hosting/Hosting-1748984296110710437/original/cfa7f64e-8148-4edf-8b45-6b1e3099d550.jpeg?im_w=320",
            set: (v) => v === "" ? "https://a0.muscache.com/im/pictures/hosting/Hosting-1748984296110710437/original/cfa7f64e-8148-4edf-8b45-6b1e3099d550.jpeg?im_w=320" : v,
        },
    },
    reviews:[{
        type : schema.Types.ObjectId,
        ref:'Review'

    }],
    owener:{
        type:schema.Types.ObjectId,
        ref:'User'
    },
    price: Number,
    location: String,
    country: String,
     geometry :  {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
  coordinates: {
    type: [Number],
    required: true
  }}
   

})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        console.log("hiiiiii..")
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

let listing = new mongoose.model("listing", listingSchema);


module.exports = listing;
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
            default: "https://images.unsplash.com/photo-1781633793478-7e8ad6705d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1781633793478-7e8ad6705d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        },
    },
    reviews:[{
        type : schema.Types.ObjectId,
        ref:'Review'

    }],
    price: Number,
    location: String,
    country: String

})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        console.log("hiiiiii..")
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

let listing = new mongoose.model("listing", listingSchema);


module.exports = listing;
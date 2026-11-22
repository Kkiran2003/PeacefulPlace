const mongoose = require("mongoose");
const initData = require("./data.js")
const listing = require("../model/listing.js")
const Mongo_DB = 'mongodb://127.0.0.1:27017/wonderlust'

main().then(() => {
    console.log("connetion successfully")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(Mongo_DB)
}

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owener:'6b00824cf9e8e8c9fb55e639'}));
    result  = await listing.insertMany(initData.data);

    console.log("data initialize",result[0])
}

initDB();

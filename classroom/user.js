const express  = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.send("see user")
})

router.post("/new",(req,res,next)=>{
    res.send("add user")
})

router.delete("/:id",(req,res,next)=>{
    res.send("delete user")
})

router.put("/:id",(req,res,next)=>{
    res.send("update user")
})

module.exports = router;
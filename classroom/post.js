const express = require("express");
const router = express.Router();

router.get("/",(req,res,next)=>{
    res.send("see posts")
})

router.post("/new",(req,res,next)=>{
    res.send("add posts")
})

router.delete("/:id",(req,res,next)=>{
    res.send("Delete posts")
})

router.put("/:id",(req,res,next)=>{
    res.send("update posts")
})

module.exports = router;
const express = require("express");
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
try {fs.mkdirSync("data");}catch(error){}
app.get("/", (req, res)=>{
    res.send("hello!");
});
app.use(fileUpload({safeFileNames:true, preserveExtension:true}));
app.listen(80);
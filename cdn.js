const express = require("express");
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
fs.mkdirSync("data");
app.get("/", (req, res)=>{
    console.log(req.ip);
});
app.use(fileUpload({safeFileNames:true, preserveExtension:true}));
app.listen(80);
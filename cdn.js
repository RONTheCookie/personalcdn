/* personalcdn - tiny cdn in >100 lines.
*  built by https://ronthecookie.me
*  optimized for https://getsharex.com
*/
const express = require("express");
const app = express();
app.use(require("helmet")());
const fs = require("fs");
const randomstring = require("randomstring");
const mime = require("mime-types");
const hash = (/**
    * Just a tiny trick for IntelliSense to work properly.
    * @returns {String}
    */()=>{return require("./hash.json");})();
const sha512 = require("sha512");
const fileUpload = require("express-fileupload");
try {fs.mkdirSync("data");}catch(error){}
app.get("/", (req, res)=>{
    res.redirect("https://ronthecookie.me");
});
app.use(express.static("data"));
app.use(fileUpload({preserveExtension: true, safeFileNames: true}))
app.post("/upload/:token", (req, res) => {
    let token = sha512(req.params.token).toString("hex");
    let issue = null;
    if (hash == token) {
        if (!req.files) return res.send("no files");
        let v = req.files.file;
        if (!v) return res.send("no files file")
        let rdm = randomstring.generate(7);
        let ext = mime.extension(v.mimetype);
        if (!ext) return issue = "invalid mimetype.";
        //TODO: maybe I should I implement something to stop self-XSSing.
        let fn = rdm+"."+ext;
        v.mv("data/"+fn)
        if (issue) return res.json({error:issue});
        res.json({message:"uploaded", file:fn});
    } else {
        res.sendStatus(403);
    }
});
app.use(fileUpload({safeFileNames:true, preserveExtension:true}));
app.listen(process.env.PORT || 8080);

/* personalcdn - tiny cdn in >100 lines.
*  built by https://ronthecookie.me
*  optimized for https://getsharex.com
*/
const express = require("express");
const app = express();
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
    res.send("Ron's personal CDN.");
});
app.use(express.static("data"));
app.post("/upload/:token", (req, res) => {
    let token = sha512(req.params.token).toString("hex");
    let issue = null;
    console.log(req.files);
    if (hash == token) {
        if (req.files == null) return res.send("no files");
        let uploadedAmount = 0;
        for (let k of req.files) {
            let v = req.files[k];
            let rdm = randomstring.generate(7);
            let ext = mime.extension(v.mimetype);
            if (!ext) return issue = "invalid mimetype.";
            //TODO: maybe I should I implement something to stop self-XSSing.
            let fn = rdm+"."+ext;
            v.mv("data/"+fn)
            uploadedAmount++;
        }
        if (issue) return res.json({error:issue});
        res.json({message:"uploaded", count:uploadedAmount, file:fn});
    } else {
        res.sendStatus(403);
    }
});
app.use(fileUpload({safeFileNames:true, preserveExtension:true}));
app.listen(8080);
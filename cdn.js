/* personalcdn - tiny cdn in >100 lines.
*  built by https://ronthecookie.me
*  optimized for https://getsharex.com
*/
const express = require("express");
const app = express();
const fs = require("fs");
const randomstring = require("randomstring");
const mime = require("mime-types");
const hashes = (/**
    * Just a tiny trick for IntelliSense to work properly.
    * @returns {Array<String>}
    */()=>{return require("./hashes.json");})();
const sha512 = require("sha512");
const fileUpload = require("express-fileupload");
try {fs.mkdirSync("data");}catch(error){}
app.get("/", (req, res)=>{
    res.send("Ron's personal CDN.");
});
app.use(express.static("data"));
app.post("/upload/:token", (req, res) => {
    let token = sha512(req.params.token);
    let issue = null;
    console.log(hashes.indexOf(token));
    if (hashes.indexOf(token) != -1) {
        if (req.files == null) return res.send("no files");
        let uploadedAmount = 0;
        for (let k of Object.keys(req.files)) {
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
const express = require("express");
const app = express();
const ca = require("chalk-animation");
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const bp = require("body-parser");
app.use(
    bp.urlencoded({
        extended: false
    })
);
app.use(bp.json());
// used in POST reqs
const s3 = require("./s3");
const config = require("./config");
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => console.log(err));
});
//get pictures with specific tag
app.get("/images/:tag", function(req, res) {
    let tag = req.params.tag;
    db.selectTagImages(tag)
        .then(result => {
            res.json(result.rows);
        })
        .catch(function(err) {
            console.log("Error occured in gettting pictures with tags:", err);
        });
});
// get big Image data after click on the small photo icon
app.get("/big-photo/:id", (req, res) => {
    db.getCurrentImage(req.params.id)
        .then(result => {
            var imgInfo = result.rows;
            db.selectComments(req.params.id).then(result => {
                // console.log("Second Results", result.rows);
                var totalInfo = imgInfo.concat(result.rows);
                // console.log("All Results: ", totalInfo);
                res.json(totalInfo);
            });
            // console.log("hello", result.rows);
        })
        .catch(err => console.log(err));
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//upload new picture
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // console.log("POST upload!", req.body);
    // If nothing went wrong the file is already in the uploads directory
    db.saveFile(
        config.s3Url + req.file.filename,
        req.body.title,
        req.body.desc,
        req.body.username
    )
        .then(({ rows }) => {
            res.json({
                image: rows[0]
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
//upload comments to the picture
app.post("/big-photo/:id", (req, res) => {
    // console.log("Our request: ", req);
    console.log("Our Body: ", req.body.comment);
    db.insertComments(req.params.image_id, req.body.comment, req.body.username)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("Error in writeFileTo: ", err);
            res.status(500).json({
                success: false
            });
        });
});

app.listen(
    // process.env.PORT ||
    8080,
    () => ca.rainbow("I am listening,bro")
);

const express = require("express");
const app = express();
const ca = require("chalk-animation");
const db = require("./db.js");
const bp = require("body-parser");
app.use(bp.json());
app.use(
    bp.urlencoded({
        extended: false
    })
);

// used in POST reqs
const s3 = require("./s3");
const config = require("./config");
app.use(express.static("./public"));

/*                   File Upload header Declarations                   */
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
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

app.get("/getImages", (req, res) => {
    db.getImages()
        .then(results => {
            res.json({ images: results.rows });
            console.log(results.rows);
        })
        .catch(err => console.log(err));
});
//get pictures with specific tag
app.get("/images/:tag", function(req, res) {
    let tag = req.params.tag;
    db.selectTagImages(tag)
        .then(results => {
            res.json({ images: results.rows });
        })
        .catch(function(err) {
            console.log("Error occured in gettting pictures with tags:", err);
        });
});
// get big Image data after click on the small photo icon
app.get("/getImage/:id", (req, res) => {
    db.getImage(req.params.id)
        .then(results => {
            res.json({ image: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting the image based on id!", err);
            res.json({
                image: {}
            });
        });
});

app.get("/getComments/:id", (req, res) => {
    let imageId = req.params.id;
    db.getComments(imageId)
        .then(function(results) {
            res.json({ comments: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting images !", err);
        });
});

app.get("/getMoreImages/:id", (req, res) => {
    let lastimageid = req.params.id;
    db.getMoreImages(lastimageid)
        .then(function(results) {
            res.json({ moreimages: results.rows });
        })
        .catch(function(err) {
            console.log("error in getting mores image based on lastid!", err);
        });
});

//upload new picture
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // console.log("POST upload!", req.body);
    // If nothing went wrong the file is already in the uploads directory
    db.upLoad(
        config.s3Url + req.file.filename,
        req.body.title,
        req.body.description,
        req.body.username,
        req.body.tag
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
app.post("/submitComment/:id", (req, res) => {
    let imageId = req.params.id;
    db.writeComments(imageId, req.body.comment, req.body.username)
        .then(results => {
            res.json({
                comment: results.rows
            });
        })
        .catch(err => {
            console.log("error from submit comments", err);
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

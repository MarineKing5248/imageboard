const express = require("express");
const app = express();
const ca = require("chalk-animation");
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
); // used in POST reqs
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
// get big Image data after click on the small photo icon
app.get("/big-photo/:id", (req, res) => {
    db.getCurrentImage(req.params.id)
        .then(result => {
            console.log("hello", result.rows);
            res.json(result.rows);
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

app.listen(
    // process.env.PORT ||
    8080,
    () => ca.rainbow("I am listening,bro")
);

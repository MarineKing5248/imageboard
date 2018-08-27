const express = require("express");
const app = express();
const ca = require("chalk-animation");
const db = require("./sql/db.js");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(response => {
            res.json(response);
        })
        .catch(err => console.log(err));
});

app.listen(
    // process.env.PORT ||
    8080,
    () => ca.rainbow("I am listening,bro")
);

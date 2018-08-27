const express = require("express");
const app = express();
const ca = require("chalk-animation");

app.use(express.static("./public"));
app.get("/cities", (req, res) => {
    res.json({
        cities: [
            {
                name: "Berlin",
                country: "Germany"
            },
            {
                name: "Hamburg",
                country: "Germany"
            }
        ]
    });
});

app.listen(
    // process.env.PORT ||
    8080,
    () => ca.rainbow("I am listening,bro")
);

var box = $("#box");
$.ajax({
    url: "ticker.json",
    method: "GET",
    success: function(data) {
        data.forEach(function(data) {
            var html = "";
            html += "<a href=" + data.links + ">" + data.info + "</a>";
            console.log(data);
            box.append(html);
            ticker();
        });
    }
});

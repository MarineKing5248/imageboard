console.log("yo, man!");

(function() {
    var app = new Vue({
        el: "#main",
        data: {
            heading: "图样图森破",
            color: "tomato",
            headingClassName: "heading"
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            axios.get("/cities").then(function(res) {
                app.cities = res.data.cities;
            });
        },
        method: {
            handleClick: function(name) {
                this.changeGreetee = name;
            },
            changeGreetee: function() {}
        }
    });
    // setTimeout(function() {
    //     app.heading = "OMG VUE IS AMAZING";
    // }, 2000);
})();

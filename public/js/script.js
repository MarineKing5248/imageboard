(function() {
    var app = new Vue({
        el: "#main",
        data: {
            heading: "Illusion",
            class: "photo",
            images: []
        },
        // created: function() {
        //     console.log("created!");
        // },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data.rows;
            });
        },
        method: {
            handleClick: function(name) {
                this.changeGreetee = name;
            }
        }
    });
    // setTimeout(function() {
    //     app.heading = "OMG VUE IS AMAZING";
    // }, 2000);
})();

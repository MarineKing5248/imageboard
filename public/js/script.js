(function() {
    var app = new Vue({
        el: "#main",
        data: {
            heading: "Illusion",
            class: "photo",
            images: [],
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data;
            });
        }, //client side 'get' and 'render',user cant see anything changed,the url stay the same, it runs when the page loads or refreshes
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $('input[type="file"]').get(0).files[0];
                var formData = new FormData();
                formData.append("file", file); //using API to sent the file from client to server
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                axios.post("/upload", formData).then(function(res) {
                    app.images.unshift(res.data.image);
                });
            } //close upload file
        } //close:methods
    }); //close Vue instance
})(); //close iife

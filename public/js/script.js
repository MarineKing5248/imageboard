(function() {
    //component for pop up photo to show bigger photo
    Vue.component("big-photo", {
        data: function() {
            return {
                info: []
            };
        },
        props: ["id"],
        template: "#tmpl1",
        //mount here to get data from the database for the component
        mounted: function() {
            var app = this; //scope thing, this ???
            axios.get("/big-photo/" + this.id).then(function(res) {
                app.info = res.data[0];
                console.log(this.info);
            });
        },
        methods: {
            close: function() {
                this.$emit("close");
            }
        }
    });
    var app = new Vue({
        el: "#main",
        data: {
            heading: "Illusion",
            class: "photo",
            images: [],
            currentId: null,
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
            }, //close upload file
            getCurrentId: function(img_id) {
                this.currentId = img_id;
                console.log("click", id);
            },
            close: function() {
                this.currentId = null;
            }
        } //close:methods
    }); //close Vue instance
})(); //close iife

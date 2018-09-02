(function() {
    //component for pop up photo to show bigger photo
    Vue.component("big-photo", {
        data: function() {
            return {
                image: {},
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        props: ["id"],
        template: "#template1",
        watch: {
            id: function() {
                this.getImageforModal();
            }
        },
        //mount here to get data from the database for the component
        mounted: function() {
            var app = this; //scope thing, this ???
            this.getImageforModal();
            axios.get("/getComments/" + this.id).then(function(res) {
                app.comments = res.data.comments;
            });
        },
        methods: {
            emitClose: function() {
                this.$emit("close");
            },
            getImageforModal: function() {
                var app = this;
                axios.get("/getImage/" + this.id).then(function(res) {
                    app.image = res.data.image[0];
                    if (!app.image) {
                        console.log("in component image doesnot exist");
                        app.currentImageId = null;
                        location.hash = "";
                    }
                });
            }, //get image end
            submitComment: function() {
                var component = this;
                axios.post("/submitComment/" + this.id, this.form).then(function(resp) {
                    component.comments.unshift(resp.data.comment[0]);
                });
            }
        }
    });
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            lastImageId: null,
            hasMore: true,
            currentImageId: location.hash.length > 1 && location.hash.slice(1),
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            axios.get("/getImages").then(function(res) {
                app.images = res.data.images;
                app.lastImageId = app.images[app.images.length - 1].id;
                setTimeout(app.infiniteScroll, 2000);
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
                formData.append("tag", this.form.tag);
                axios.post("/upload", formData).then(function(res) {
                    app.images.unshift(res.data.image);
                });
            }, //close upload file
            infiniteScroll: function() {
                var app = this;
                var docHeight = document.body.clientHeight - 200;
                var windowHeight = window.innerHeight;
                var offSetY = pageYOffset;
                var height = windowHeight + offSetY;
                // console.log("Document Height: ", docHeight);
                // console.log("Window Height: ", windowHeight);
                // console.log("offset Y: ", offSetY);
                if (height > docHeight) {
                    // $(".spinne").css({ visibility: "visible" });
                    setTimeout(this.getMoreImages(), 2000);
                } else {
                    setTimeout(app.infiniteScroll, 2000);
                }
            },
            hideModal: function() {
                this.currentImageId = null;
                location.hash = "";
            },
            getMoreImages: function() {
                //ajax request get next < last images id
                axios.get("/getMoreImages/" + this.lastImageId).then(function(res) {
                    app.hasMore = !!res.data.moreimages.length;
                    app.images = app.images.concat(res.data.moreimages);
                    // $(".spinne").css({ visibility: "visible" });
                });
            },
            getImageId: function(id) {
                this.currentImageId = id;
            }, //close getImageDetails
            changeFile: function(e) {
                this.file = e.target.files[0];
            }
        } //close:methods
    }); //close Vue instance
    $(window).on("hashchange", function() {
        app.currentImageId = location.hash.slice(1);
    });
})(); //close iife

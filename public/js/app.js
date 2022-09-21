import * as Vue from "./vue.js";

import showImageComponent from "./showImageComponent.js";

const app = Vue.createApp({
    data: function () {
        return {
            readyData: [],
            images: [],
            message: "Please upload a file",
            imgId: 0,
            idOnScreen: [],
            lowestId: null,
            moreButton: true,
        };
    },
    components: {
        "show-image-component": showImageComponent,
    },
    methods: {
        onFormSubmit(e) {
            // console.log("form trying to submit!");
            // do some validation!

            const form = e.currentTarget;
            const fileInput = form.querySelector("input[type=file]");
            // console.log("fileInput.files: ", fileInput.files);

            if (fileInput.files.length < 1) {
                alert("You must add a file!");
                return;
            }

            //really submit the form!
            const formData = new FormData(form);
            fetch("/image", {
                method: "post",
                body: formData,
            })
                .then((result) => result.json())
                .then((serverData) => {
                    // console.log("serverData:", serverData);
                    //update the view!
                    //
                    // console.log("serverData: ", serverData);
                    this.message = serverData.message;
                    //if there is an image, add it t the list in data!
                    if (serverData.file) {
                        // serverData.file =
                        //     "https://s3.amazonaws.com/spicedling" +
                        //     serverData.file;
                        this.images.push(
                            "https://s3.amazonaws.com/spicedling" +
                                serverData.file
                        );
                    }
                });
        },
        showID(id) {
            // console.log("this is the id of the clicked picture: ", id);
            this.imgId = id;
            // console.log("this.imgId: ", this.imgId);
        },
        closeModalInApp() {
            this.imgId = 0;
            history.pushState(null, null, "/");
            // console.log("close fn in the parent is running!");
        },
        askForMoreImages(lowestId) {
            // console.log("More button was clicked");
            // console.log("lowestId in getMoreImages: ", lowestId);
            fetch("/moreImages/" + this.lowestId)
                .then((responserows) => {
                    // console.log("responserows in fetch: ", responserows);
                    return responserows.json();
                })
                .then((newData) => {
                    // console.log("newData: ", newData);
                    // console.log("lowestId: ", lowestId);
                    // console.log("newData[0].endId: ", newData[0].endId);

                    newData.map((img) => {
                        // console.log("img: ", img);
                        this.readyData.push(img);
                        if (img.endId == img.id) {
                            this.moreButton = false;
                        }
                    });
                    newData.map((el) => {
                        // console.log(el.id);
                        this.idOnScreen.push(el.id);
                    });
                    // console.log("this.idOnScreen: ", this.idOnScreen);
                    this.lowestId = Math.min(...this.idOnScreen);
                    // console.log(this.lowestId);
                })
                .catch((err) => console.log("err in fetch /moreImages: ", err));
        },
    },
    mounted: function () {
        // console.log("location.pathname in app mounting: ", location.pathname);
        if (
            location.pathname.indexOf("/image/") == 0 &&
            parseInt(location.pathname.substring(7)) != NaN
        ) {
            this.imgId = parseInt(parseInt(location.pathname.substring(7)));
            // console.log("this.imgId in if app mounting: ", this.imgId);
        } else {
            this.imgId = 0;
            // console.log("this.imgId in else app mounting: ", this.imgId);
        }
        fetch("/table")
            .then((responserows) => {
                // console.log("responserows: ", responserows);
                // this.imgId = 0;
                // history.pushState(null, null, "/");
                // console.log("location.pathname: ", location.pathname);
                return responserows.json();
            })
            .then((readyData) => {
                // console.log("readyData in fetch: ", readyData);
                this.readyData = readyData;
                readyData.map((el) => {
                    // console.log(el.id);
                    this.idOnScreen.push(el.id);
                });

                // console.log("this.idOnScreen: ", this.idOnScreen);
                this.lowestId = Math.min(...this.idOnScreen);
                // console.log(this.lowestId);
            })
            .catch((err) => console.log("err in fetch: ", err));

        addEventListener("popstate", (e) => {
            // console.log(location.pathname);
            if (
                location.pathname.indexOf("/image/") == 0 &&
                parseInt(location.pathname.substring(7)) != NaN
            ) {
                this.imgId = parseInt(parseInt(location.pathname.substring(7)));
            } else {
                this.imgId = 0;
            }

            // console.log("event triggered, this.imgId: ", this.imgId);
            // show whatever is appropriate for the new url
            // if you need it, e.state has the data you passed to `pushState`
        });
    },
});

app.mount("#main");

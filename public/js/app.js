import * as Vue from "./vue.js";

const app = Vue.createApp({
    data: function () {
        return {
            readyData: [],
            images: [],
            message: "Please upload a file",
        };
    },
    methods: {
        onFormSubmit(e) {
            console.log("form trying to submit!");
            // do some validation!

            const form = e.currentTarget;
            const fileInput = form.querySelector("input[type=file]");
            console.log("fileInput.files: ", fileInput.files);

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
                    console.log("serverData: ", serverData);
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
    },
    mounted: function () {
        fetch("/table")
            .then((responserows) => {
                console.log("responserows: ", responserows);

                return responserows.json();
            })
            .then((readyData) => {
                console.log("readyData: ", readyData);
                this.readyData = readyData;

                // console.log("db.getTable(): ", db.getTable());
            })
            .catch((err) => console.log("err in fetch: ", err));
    },
});

app.mount("#main");

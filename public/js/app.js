import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            heading: [],
        };
    },
    methods: {
        // getTable: db.getTable(),
    },
    mounted() {
        fetch("/table")
            .then((responserows) => {
                console.log("responserows: ", responserows);
                // return response;

                return responserows.json();
            })
            .then((data) => {
                console.log("data: ", data);
                this.heading = data.heading;

                // console.log("db.getTable(): ", db.getTable());
            })
            .catch((err) => console.log("err in fetch: ", err));
    },
});

app.mount("#main");

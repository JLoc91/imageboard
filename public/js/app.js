import * as Vue from "./vue.js";

const app = Vue.createApp({
    data: function () {
        return {
            readyData: [],
        };
    },
    methods: {
        // getTable: db.getTable(),
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

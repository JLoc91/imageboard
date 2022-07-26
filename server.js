const path = require("path");
const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/table", (req, res) => {
    db.getTable()
        .then((data) => {
            console.log("data.rows: ", data.rows);
            res.json(data.rows);
            return;
        })
        .catch((err) => console.log("err in getTable: ", err));
});

app.listen(8080, () => console.log(`I'm listening.`));

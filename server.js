const path = require("path");
const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/table", (req, res) => {
    db.getTable()
        .then((imageData) => {
            console.log("imageData.rows: ", imageData.rows);
            res.json(imageData.rows);
            return;
        })
        .catch((err) => console.log("err in getTable: ", err));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log(`I'm listening.`));

const path = require("path");
const express = require("express");
// const uploader = require("./middleware.js").uploader;
const { uploader } = require("./middleware.js");
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

//from encounter
app.post("/image", uploader.single("image"), (req, res) => {
    //grab the image that was sent [multer]
    //save it somewhere [multer]
    //respond to the client - success/failure

    //req.file is created by MUlter if the upload worked!
    if (req.file) {
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log(`I'm listening.`));

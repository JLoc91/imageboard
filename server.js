const path = require("path");
const express = require("express");
// const uploader = require("./middleware.js").uploader;
const { uploader } = require("./middleware.js");
const app = express();
const db = require("./db.js");
const s3 = require("./s3.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
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
app.post("/image", uploader.single("photo"), s3.upload, (req, res) => {
    //grab the image that was sent [multer]
    //save it somewhere [multer]
    //respond to the client - success/failure

    //req.file is created by MUlter if the upload worked!
    req.body.awsurl = path.join(
        "https://s3.amazonaws.com/spicedling/",
        req.file.filename
    );
    console.log("req.body in app.post : ", req.body);
    console.log("req.file in app.post : ", req.file);
    if (req.file) {
        // console.log("req.file: ", req.file);
        db.insertImage(req.body)
            .then(() => {
                res.json({
                    success: true,
                    message: "File uploaded. Good job! 🚀",
                    file: `/${req.file.filename}`,
                });
            })
            .catch((err) => console.log("err in insertImage: ", err));
    } else {
        res.json({
            success: false,
            message: "File upload failed. 😥",
        });
    }
});

// app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
//     console.log("req.file: ", req.file);
//     req.file ? res.json()
// });

app.listen(8080, () => console.log(`I'm listening.`));

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

app.get("/table/:id", (req, res) => {
    console.log("we made it here: ");
    console.log("req.params.id: ", req.params.id);
    db.getImage(req.params.id)
        .then((imageData) => {
            console.log("imageData.rows: ", imageData.rows);
            res.json(imageData.rows);
            return;
        })
        .catch((err) => console.log("err in getTable: ", err));
});

app.get("/getComments/:id", (req, res) => {
    console.log("we made it to '/getComments'");
    console.log("req.params.id getComments: ", req.params.id);
    db.getComments(req.params.id)
        .then((commentData) => {
            console.log("commentData.rows: ", commentData.rows);
            res.json(commentData.rows);
            return;
        })
        .catch((err) => console.log("err in getComments: ", err));
});

app.get("/moreImages/:lowestId", (req, res) => {
    console.log("get request for more images");
    console.log("req.params: ", req.params);

    db.getMoreImages(req.params.lowestId)
        .then((response) => {
            console.log("response.rows in getMoreImages: ", response.rows);
            res.json(response.rows);
            return;
        })
        .catch((err) => console.log("err in getMoreImages: ", err));
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

app.post("/comment", (req, res) => {
    console.log("req.body in app.post /comment : ", req.body);
    db.insertComment(req.body)
        .then((result) => {
            res.json({
                success: true,
                message: "Comment inserted",
                commentData: result.rows[0],
            });
        })
        .catch(() => {
            res.json({
                success: false,
                message: "Inserting Comment failed",
            });
        });
    // if (req.file) {
    //     // console.log("req.file: ", req.file);
    //     db.insertImage(req.body)
    //         .then(() => {
    //             res.json({
    //                 success: true,
    //                 message: "File uploaded. Good job! 🚀",
    //                 file: `/${req.file.filename}`,
    //             });
    //         })
    //         .catch((err) => console.log("err in insertImage: ", err));
    // } else {
    //     res.json({
    //         success: false,
    //         message: "File upload failed. 😥",
    //     });
    // }
});
// app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
//     console.log("req.file: ", req.file);
//     req.file ? res.json()
// });

app.listen(8080, () => console.log(`I'm listening.`));

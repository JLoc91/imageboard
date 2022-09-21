const commentComponent = {
    data() {
        return {
            comment: "",
            username: "",
            comments: [],
        };
    },
    props: ["img-id-prop-comment"],

    methods: {
        commentSubmit(e) {
            // console.log("comment form trying to submit!");
            // console.log("username: ", this.username);
            // console.log("comment: ", this.comment);
            let commentBody = {
                username: this.username,
                comment: this.comment,
                imgId: this.imgIdPropComment,
            };
            // this.comments.push(commentBody);
            // console.log("this.comments after pushing: ", this.comments);
            commentBody = JSON.stringify(commentBody);
            // console.log("commentBody: ", commentBody);
            fetch("/comment", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: commentBody,
            })
                .then((result) => {
                    // console.log("result: ", result);
                    // console.log("result.json(): ", result.json());
                    return result.json();
                })
                .then((addedComment) => {
                    // console.log("addedComment:", addedComment);
                    this.comments.push(addedComment.commentData);
                    //update the view!
                    //
                    // console.log("serverData: ", serverData);
                    // this.message = serverData.message;
                    // //if there is an image, add it t the list in data!
                    // if (serverData.file) {
                    //     // serverData.file =
                    //     //     "https://s3.amazonaws.com/spicedling" +
                    //     //     serverData.file;
                    //     this.images.push(
                    //         "https://s3.amazonaws.com/spicedling" +
                    //             serverData.file
                    //     );
                    // }
                });
        },
    },
    mounted() {
        // console.log("comment component mounted");
        // console.log("img-id-prop-comment: ", this.imgIdPropComment);
        fetch("/getComments/" + this.imgIdPropComment)
            .then((responserows) => {
                // console.log(
                //     "responserows in fetch/'getcomments': ",
                //     responserows
                // );

                return responserows.json();
            })
            .then((comment) => {
                this.comments = comment;

                // console.log("db.getTable(): ", db.getTable());
            })
            .catch((err) => console.log("err in fetch in component: ", err));
    },

    template: `
        <div id='commentSection'>
            <h2>Add a Comment!</h2>
            <br>
            <input type="text" v-model="comment">
            <p>Comment</p>
            <br>
            <input type="text" v-model="username">
            <p>Username</p>
            <br>
            <button @click="commentSubmit">Submit</button>
            <div id="showComments" v-for="comment in comments">
                <h3>{{comment.comment_text}}</h3>
                <h4>{{comment.username}} on {{comment.created_at.slice(0,10)}} {{comment.created_at.slice(11,16)}}h</h4>
                <br>
            </div>
        </div>
    `,
    // template: `
    //     <div id='commentSection'>
    //         <h2>Add a Comment!</h2>
    //     </div>
    // `,
};

export default commentComponent;

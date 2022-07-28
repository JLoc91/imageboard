// const db = require("./db.js");

const showImageComponent = {
    data() {
        return {
            name: "Layla",
            num: 0,
            clickImage: [],
            // imgId: 0,
        };
    },
    props: ["img-id-prop"],
    mounted() {
        console.log("our first component mounted");
        console.log("props: ", this.imgIdProp);
        fetch("/table/" + this.imgIdProp)
            .then((responserows) => {
                console.log("responserows: ", responserows);

                return responserows.json();
            })
            .then((image) => {
                console.log("image[0] in component: ", image[0]);
                this.clickImage = image[0];

                // console.log("db.getTable(): ", db.getTable());
            })
            .catch((err) => console.log("err in fetch in component: ", err));
    },

    methods: {
        closeModalComponent: function () {
            // console.log("closeModal fn in component is running");
            console.log("about to emit an event from the component!");
            // here we need to tell the parent to do something for us please!!!!
            this.$emit("close");
        },
    },

    template: `
        <div class='component images'>
            <div id="transparentCover">
                <div id="popUp" class="imagebox shadow">
                    <h3 id="closeButton"  @click='closeModalComponent'>CLOSE</h3>
                    <img id="enlargedImage"
                        v-bind:src="clickImage.url"
                        v-bind:alt="clickImage.description">
                    <h2>{{clickImage.title}}</h2>
                    <h3>{{clickImage.description}}</h3>
                    <h4>Uploaded by {{clickImage.username}} on {{clickImage.created_at}}</h4>        
                </div>
            </div>
        </div>
    `,
    // template: `
    //     <div class='imgComponent'>
    //         <div id="enlargedImage" class="imagebox shadow">
    //             <h1>Versuch das Bild zu rendern</h1>

    //         </div>
    //     </div>
    // `,
};

export default showImageComponent;

import commentComponent from "./commentComponent.js";

const showImageComponent = {
    data() {
        return {
            num: 0,
            clickImage: [],
            // imgIdComment: 0,
        };
    },
    props: ["img-id-prop"],
    mounted() {
        // console.log("our first component mounted");
        // console.log("img-id-prop: ", this.imgIdProp);

        fetch("/image/" + this.imgIdProp)
            .then((responserows) => {
                // console.log("responserows: ", responserows);
                history.pushState(null, null, "/image/" + this.imgIdProp);
                // console.log(
                //     "location.pathname showImageComponent: ",
                //     location.pathname
                // );
                return responserows.json();
            })
            .then((image) => {
                // console.log("image[0] in component: ", image[0]);
                this.clickImage = image[0];

                // console.log("db.getTable(): ", db.getTable());
            })
            .catch((err) => console.log("err in fetch in component: ", err));
    },
    components: {
        "comment-component": commentComponent,
    },
    methods: {
        closeModalComponent: function () {
            // console.log("closeModal fn in component is running");
            // console.log("about to emit an event from the component!");
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
                    <h4>Uploaded by {{clickImage.username}} on {{clickImage.created_at && clickImage.created_at.slice(0, 10)}} {{clickImage.created_at && clickImage.created_at.slice(11, 16)}}h</h4>
                    <br>
                    <comment-component :img-id-prop-comment="imgIdProp"></comment-component>        
                </div>
            </div>
        </div>
    `,
};

export default showImageComponent;

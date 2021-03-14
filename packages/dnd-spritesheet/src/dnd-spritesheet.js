import { html, css, LitElement } from 'lit-element';

export class DnDSpritesheet extends LitElement {
    static get styles() {
        return css`
         :host{
           margin:0px;
           padding: 0px;
           display:inline-block;
         }   
        `;
    }
    constructor() {
        super();
    }


    firstUpdated() {
        // get the image width and height from the url
        console.log('connectedcallback');
        this.updatesprites();
    }
    // map properties
    static get properties() {
        return {
            spritenr: { type: Number,reflect: true },
            src: { type: String , reflect: true},
            width: { type: Number, reflect: true },
            height: { type: Number, reflect: true },
        };
    }

    updatesprites(){
        console.log('update');
        try {
            this.loadSpritesheet().then(res => {
                this.generateSprites(res);
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    /*
    * load the image for a spritesheet
    */
    loadSpritesheet() {
        console.log("loadspritesheet")
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            console.log("url:", import.meta.url);
            let newUrl = new URL(`${this.src}`, import.meta.url);
            console.log("newurl: ",newUrl);
            img.src = newUrl.href;
        })
    }

    /*
    * update tag with spriteclass. Set the id to a new value
    */
    updateSpritenr(val){
        console.log("updatespritenr");
        let sprite = this.shadowRoot.querySelector('.sprite');
        sprite.id = `sprite${val}`;
    }

    generateSprites(img) {
        console.log("generatesprites");
        let spritewidth = img.width / this.width; // width of the image devided by the number of x sprites
        let spriteheight = img.height / this.height; // height of the image devided by the number of y sprites
        let newUrl = new URL(`${this.src}`, import.meta.url);
        let styles = `
            .sprite{
                 #opacity: 0.8;
                width: ${spritewidth}px;
                height: ${spriteheight}px;
                background: url('${newUrl.href}') no-repeat;
            }
        `;

        // total nr of possible sprites
        let total = this.width * this.height;
        let step = 1;

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {

                let negativex = x * spritewidth;
                let negativey = y * spriteheight;
                styles = styles + `
                #sprite${step}{
                    background-position: -${negativex}px -${negativey}px ;
                }`;
                step += 1;
            }
        }
        let el = this.shadowRoot.getElementById("stylesheet");
        el.innerHTML = styles;
        let sprite = this.shadowRoot.querySelector('.sprite');
        sprite.id = `sprite${this.getAttribute('spritenr')}`;

    }



    render() {
        console.log("render");
        return html`
            <div class="container">
            <style id="stylesheet"></style>
            <div class="sprite" id="sprite${this.spritenr}"></div>
            </div>
        `;
    }
}

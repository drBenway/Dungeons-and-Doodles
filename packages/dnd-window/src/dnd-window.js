import { html, css, LitElement } from 'lit-element';

export class DnDWindow extends LitElement {
    static get styles() {
        return css`
        :host {
              width: 100%;
    display: block;
    height: 100%;    
    position: absolute;
        }
            .window{
              border: 1px solid black;
              width: 200px;
              height: 200px;
              position: absolute;
            }
           .title{
             text-align: center;
             font-weight: bold;
             height: 20px;
             background-color: red;
            }
            `;
    }
    // map properties
    static get properties() {
        return {
            title: { type: String,reflect: true },
            width: {type: Number, reflect: true},
            height: {type:Number, reflect: true},
            draggable: {type: Boolean, reflect: true}
        };
    }

    setWidthHeight(){
        let style= "";
        if(this.width){
            style += `width: ${this.width}px; `;
        }
        if(this.height) {
            style += `height: ${this.height}px; }`
        }
        return style
    }

    constructor() {
        super();
    }
    firstUpdated(){
        console.log("first update");
        this.pos1 = this.pos1 || 0
        this.pos2 = this.pos2 || 0
        this.pos3 = this.pos3 || 0
        this.pos4 = this.pos4 || 0
        this.mover = this.shadowRoot.querySelector('.title');
        this.cont = this.shadowRoot.querySelector('.window');
        this.dragElement();
    }

    render(){
        return html `
            <div class="window" style="${this.setWidthHeight()}">
                <div class="title" draggable="${this.draggable}" >${this.title}</div>
            </div>
        `;
   }

    dragElement (event) {
        this.mover.addEventListener('mousedown', (event) => {
            document.onmousemove = this.elementDrag.bind(this)
            this.sender(event)
        })

        this.mover.addEventListener('mouseup', (event) => {
            this.closeDragElement(event)
        })
    }

    elementDrag (event) {
        event = event || window.event
        this.moveWindow(event.clientX, event.clientY)
    }

    moveWindow (x, y) {
        this.pos1 = this.pos3 - x
        this.pos2 = this.pos4 - y
        this.pos3 = x
        this.pos4 = y
        this.style.top = this.offsetTop - this.pos2 + 'px'
        this.style.left = this.offsetLeft - this.pos1 + 'px'
    }

    closeDragElement () {
        /* stop moving when mouse button is released: */

        document.onmouseup = null
        document.onmousemove = null
    }

    // Events
    sender (event) {
        event = event || window.event
        this.pos3 = event.clientX
        this.pos4 = event.clientY

    }
};

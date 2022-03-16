import { html, css, LitElement } from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

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
              border-radius: 5px;
            }
            .window div{
              margin: 0;
              padding: 0;
            }
           .title{
             text-align: center;
             font-weight: normal;
             height: 20px;
             color: black;
            }
            .window.fancycorners{
            border-image: var(--fancyborders-image);
            border-image-slice: var(--fancyborders-image-slice);
            border-image-width: var(--fancyborders-image-width);
            }
            .title-actions{
            display: inline-block;
            color: white;
            border: 2px solid red;
            width: 40px;
            height: 20px;
            }
            .content ::slotted(){
            width: 100%;
            height: 100%;
            text-align : left;
            }
            `;
    }
    // map properties
    static get properties() {
        return {
            width: {type: Number, reflect: true},
            height: {type:Number, reflect: true},
            draggable: {type: Boolean, reflect: true},
            fancycorners : {type: Boolean, reflect: true}
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
        if(this.draggable){
            this.dragElement();
        }
    }

/*    fancyCorners(){
        return html `
            <div class="topLeftCorner"><slot name="top-left-corner"></slot></div>
            <div class="topRightCorner"><slot name="top-right-corner"></slot></div>
            <div class="bottomLeftCorner"><slot name="bottom-left-corner"></slot></div>
            <div class="bottomRightCorner"><slot name="bottom-right-corner"></slot></div>
            <div class="topBorder"><slot name="top-border"></slot></div>
            <div class="rightBorder"><slot name="right-border"></slot></div>
            <div class="bottomBorder"><slot name="bottom-border"></slot></div>
            <div class="leftBorder"><slot name="left-border"></slot></div>
        `;
    }*/

    render(){
        let classes = { fancycorners: false, window: true};
        if(this.fancycorners){classes.fancycorners = true;}
        return html `
            <div class="${classMap(classes)}" style="${this.setWidthHeight()}">
                
                <div class="title" draggable="${this.draggable}" >
                    <slot name="windowtitle"></slot>
                    <slot name="windowactions></slot>
                </div>
                <div class="content">
                     <slot name="content"></slot>
                </div>
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
}

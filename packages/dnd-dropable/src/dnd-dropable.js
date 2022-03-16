import { html, css, LitElement } from 'lit-element';

export class DndDropable extends LitElement {
    static get styles() {
        return css`
         :host{
           margin:0px;
           padding: 0px;
           display:inline-block;
           width: 100%
         }  
 `
    }

    constructor() {
        super();
        this.setAttribute("draggable", true);
        this.dragstartListener = this.addEventListener("dragstart", this.dragStart);
        this.dragListener = this.addEventListener("drag", this.drag);
        this.dragendListener =this.addEventListener("dragend",this.dragEnd);
  }

    dragStart(e){
      console.log("dragstart");
      e.dataTransfer("text",)
    }
    drag(e){
        console.log("drag");
    }
    dragEnd(e){
        console.log("dragend");
    }

    static get properties() {
        return {

        };
    }


    render() {
       return html`<div><slot></slot></div>`
    }
}

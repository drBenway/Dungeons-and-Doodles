import { html, css, LitElement } from 'lit-element';

export class DnDTicker extends LitElement {
    static get styles() {
        return css`
         :host{
           margin:0px;
           padding: 0px;
           display:inline-block;
           width: 100%
         }   
         span{
                opacity: 0;
         }
         span.visible{
           color:red;
           opacity: 1;
         }
 
 `
    }

    static get properties() {
        return {
            value: { type: String , reflect: false},
            pof:{type:Number},
            speed: {type: Number}
        };
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log('attribute change: ', name, newVal);
        super.attributeChangedCallback(name, oldVal, newVal);
        if(name === "value" && oldVal !== newVal){
        this.valueArray = this.textToArray(this.value);
        this.pos = 0;
        this._timerInterval = setInterval(() => {
            console.log("this.pos",this.pos, "interval:", this._timerInterval);
            if(this.pos <= this.valueArray.length) { this.pos++; console.log("interval:",this._timerInterval);}
            else{
                this.stopInterval();
            }
            //this.requestUpdate();
        }, 500 );
        }
    }
    constructor() {
        super();
        this.value= "";
        this.valueArray = this.textToArray(this.value);
        this._pos = -1;

  }
    connectedCallback() {
            super.connectedCallback();
      }

     stopInterval(){
        console.log("stop interval");
         clearInterval(this._timerInterval);
     }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopInterval();
    }


    set pos(val) {
        this._pos = val;
        console.log("setting val", this._pos);
        this.requestUpdate();
    }

    get pos() { return this._pos; }

     textToArray(text){
        return text.split("");
     }


    static get properties() {
        return {
            value: { type: String , reflect: true},
            pof:{type:Number},
            speed: {type: Number}
        };
    }

    generateTemplate= ()=>{
        console.log("generate template");
        const template = [];
        let invisibleChar = (char) =>html`<span>${char}</span>`;
        let visibleChar = (char) => html`<span class="visible">${char}</span>`;
        // put evenything invisible
        if (this.pos === 0){
            for (const i of this.valueArray){
                template.push(invisibleChar(i));
            }
        }
        else {
            console.log("pos > 0");
            for (let i=0; i < this.valueArray.length; i++){
                // character is already revealed
                if(i < this.pos){
                    template.push(visibleChar(this.valueArray[i]));
                }else{
                    template.push(invisibleChar(this.valueArray[i]));
                }
            }
        }

        return html`${template}`

    }


    render() {
         let template = this.generateTemplate();
       return  template;


    }
}

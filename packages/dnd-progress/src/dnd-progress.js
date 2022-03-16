import { html, css, LitElement } from 'lit-element';

export class DndProgress extends LitElement {
    static get styles() {
        return css`
         :host{
           margin:0px;
           padding: 0px;
           display:inline-block;
           width: 100%
         }   
         meter::-webkit-meter-optimum-value, meter::-webkit-meter-suboptimum-value, meter::-webkit-meter-even-less-good-value {
            transition: 1s width;
         }
        :host([type="mana"]){
            background-color: var(--dnd-progress-mana, blue);
            -webkit-animation: move 5s linear 0 infinite;
        }
        :host([type="health"]){
            background-color: var(--dnd-progress-mana, red);
            -webkit-animation: move 5s linear 0 infinite;
        }
        :host([type="stamina"]){
            background-color: var(--dnd-progress-stamina, green);
            -webkit-animation: move 5s linear 0 infinite;
        }
 `
    }

    constructor() {
        super();

  }




    static get properties() {
        return {
            max: { type: Number,reflect: true },
            value: { type: String ,
                reflect: true,
            },
            label: {type: Boolean}
        };
    }




    render() {
        console.log("render");
        let anistyle = html`
        <style>
            .animate{
                animation: progress 3s ease-in-out forwards;
            }
            @keyframes progress {
                from {
                    width: ${this._old}%
                }
                to {
                    width: ${this.value}%
                }
            }
        </style>
        `;
        let noLabelTemplate = html` <meter max="${this.max}" $class="animate" value="${this.value}"></meter>`;
        let labelTemplate = html` <meter max="${this.max}" $class="animate"  value="${this.value}"></meter><label>${this.value}/${this.max}</label>`;

        if(this.label){
            return labelTemplate;
        } else{
            return noLabelTemplate;
        }
    }
}

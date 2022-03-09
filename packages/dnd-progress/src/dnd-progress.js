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
         progress[value] {
  /* Reset the default appearance */
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  
  /* Get rid of default border in Firefox. */
  border: none;
        width: 100%;
        height: var(--dnd-progress-height,5px);
        }
        
        progress[value]::-webkit-progress-bar {
            background-color:  var(--dnd-progress-backgroundcolor,#eee);
            border-radius: 5px;
        }
        
        progress[value]::-webkit-progress-value {
            background-color: blue; 
            background-size: 35px 20px, 100% 100%, 100% 100%;
        } 
        
        /* Chrome bar styling  */
        
        :host([type="mana"]) progress[value]::-webkit-progress-value{
            background-color: var(--dnd-progress-mana, blue);
            -webkit-animation: move 5s linear 0 infinite;
        }
        :host([type="health"]) progress[value]::-webkit-progress-value{
            background-color: var(--dnd-progress-mana, red);
            -webkit-animation: move 5s linear 0 infinite;
        }
        :host([type="stamina"]) progress[value]::-webkit-progress-value{
            background-color: var(--dnd-progress-stamina, green);
            -webkit-animation: move 5s linear 0 infinite;
        }
        
        
        /* Firefox bar styling  */
        :host([type="mana"]) progress::-moz-progress-bar{
            background-color: var(--dnd-progress-mana, blue);
        }
        :host([type="health"]) progress::-moz-progress-bar{
            background-color: var(--dnd-progress-mana, red);
        }
        :host([type="stamina"]) progress::-moz-progress-bar {
              background-color: var(--dnd-progress-stamina, green);
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
        let noLabelTemplate = html`<progress $class="animate" max="${this.max}" value="${this.value}"></progress>`;
        let labelTemplate = html`<progress max="${this.max}" value="${this.value}"></progress><label>${this.value}/${this.max}</label>`;

        if(this.label){
            return labelTemplate;
        } else{
            return noLabelTemplate;
        }
    }
}

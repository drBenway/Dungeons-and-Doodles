[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Spritesheet

`DnD-spritesheet` provides a spritesheet implementation.

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-spritesheet.js';

export default {
  title: 'spritesheet',
};
```

```js preview-story
export const main = () => html`source image:<br /> 
<img src="./packages/dnd-spritesheet/assets/flare_armor.png" /> <br /> 
sprite 17:<br />  
<dnd-spritesheet src="../assets/flare_armor.png" spritenr="17" width="5" height="5">
</dnd-spritesheet>`;

```

## Features

- works with any even spaced sprites (width and height get divided by the amount of slots)
- you define the x and y sprites
- pick any spot in the sheet

## How to use

### Installation

```bash
npm i --save @dungeons_and_doodles/spritesheet
```

```js
import { DnDSpritehseet } from '@dungeons_and_doodles/spritesheet';
```

### Example

```html
<dnd-spritesheet src="../../assets/flare_armor.png" spriten=2 width=5 height="5"></dnd-spritesheet>
```



```js preview-story
export const handler = () => html`
  <p>test</p>
`;
```

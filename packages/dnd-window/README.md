[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Window

`DnD-window` provides a window implementation.

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-window.js';
import './../dnd-spritesheet/dnd-spritesheet.js'

export default {
  title: 'window',
};
```

```js preview-story
export const main = () => html`
<style>
#testcontainer{
   width: 500px;
   height: 500px;
   postion: relative;
}
</style>
<div id ="testcontainer">

 <dnd-window width="300" height="200" draggable >
   <span slot="windowtitle">Preview</span>
   <div slot="windowactions"></div>
   <div slot="content">this is a test</div>
 </dnd-window>
 
 <div>

`;
```

## Features

- takes a title
- default 200x200 pixels
- draggable

## How to use

### Installation

```bash
npm i --save @dungeons_and_doodles/window
```

```js
import { DnDWindow } from '@dungeons_and_doodles/window';
```

### Example

```html
<dnd-window title="Inventory">
    <div slot="title-actions">
       <span style="color:white; border: 1px solid red">X</span> 
    </div>
    
</dnd-window>
<p>example with ui from https://opengameart.org/content/rpg-game-ui</p>
```



```js preview-story
export const handler = () => html`
  <dnd-window title="test">
      <div slot="titleactions">
       <span style="color:white; border: 1px solid red">X</span> 
    </div>
  </dnd-window>
`;
```

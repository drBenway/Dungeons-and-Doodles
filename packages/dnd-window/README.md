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
<div style="width: 500px; height:500px; postion: relative">
 <dnd-window title="test" width="300" height="200" draggable >
 <div slot="top-left-corner">
 <dnd-spritesheet  src="../../dnd-window/assets/window.png" spriten=1 width=4 height="4" /></dnd-spritesheet>
 </div>
<div  slot="top-right-corner">
<dnd-spritesheet  src="../../dnd-window/assets/window.png" spriten=1 width=4 height="4" /></dnd-spritesheet></div>
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
<dnd-window title="test"></dnd-window>
<p>example with ui from https://opengameart.org/content/rpg-game-ui</p>
```



```js preview-story
export const handler = () => html`
  <dnd-window title="test"></dnd-window>
`;
```

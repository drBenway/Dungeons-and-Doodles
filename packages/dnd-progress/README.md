[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Progress

`DnD-progress` provides a progress bar wrapper for mana, stamina, health,...

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-progress.js';

export default {
  title: 'progress',
};
```

```js preview-story
export const main = () => html`<dnd-progress max="100" value="80"></dnd-progress>`;
```

## Features

- custom animation
- supports color tweaking via css property
- 3 optional default types: mana, health, stamina  with colors blue,red and green

## How to use

### Installation

```bash
npm i --save @dungeons_and_doodles/progress
```

```js
import { DnDProgress } from '@dungeons_and_doodles/progress';
```

### Example

```html
<dnd-progress max="100" value="60" type="mana" label></dnd-progress>
<dnd-progress max="165" value="84" type="health" ></dnd-progress>
<dnd-progress max="65" value="30" type="stamina" label></dnd-progress>
```



```js preview-story
export const types = () => html`
<dnd-progress max="100" value="60" type="mana"  label></dnd-progress> <br />
<dnd-progress max="165" value="84" type="health" ></dnd-progress><br />
<dnd-progress max="65" value="30" type="stamina" label></dnd-progress>
`;
```

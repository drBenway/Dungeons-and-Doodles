[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# draggable

`DnD-progress` provides a progress bar wrapper for mana, stamina, health,...

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-draggable.js';

export default {
  title: 'draggable',
};
```

```js preview-story
export const main = () => html`<dnd-draggable data-type="item">sword</dnd-progress>`;
```

## Features

- makes item draggable


## How to use

### Installation

```bash
npm i --save @dungeons_and_doodles/draggable
```

```js
import { DnDDraggable} from '@dungeons_and_doodles/draggable';
```

### Example

```html
<dnd-draggable data-type="item">test</dnd-draggable>

```



```js preview-story
export const draggable = () => html`
<dnd-draggable data-type="item">test</dnd-draggable>
`;
```

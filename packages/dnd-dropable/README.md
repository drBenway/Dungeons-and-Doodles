[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# dropable

`DnD-dropable` provides an implementation of the native drag and drop interface

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-dropable.js';

export default {
  title: 'droppable',
};
```

```js preview-story
export const main = () => html`<dnd-dropable >sword</dnd-progress>`;
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

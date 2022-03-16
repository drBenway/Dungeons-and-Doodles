[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Ticker

`DnD-ticker` provides a text ticker

```js script
import { html, css, LitElement } from 'lit-element';

import './dnd-ticker.js';

export default {
  title: 'ticker',
};
```

```js preview-story
export const main = () => html`<dnd-ticker value="a text" speed="slow"></dnd-progress>`;
```

## Features

- value contains text to show
- speed can be slot, normal and fast


## How to use

### Installation

```bash
npm i --save @dungeons_and_doodles/ticker
```

```js
import { DnDTicker } from '@dungeons_and_doodles/ticker';
```

### Example

```html
<dnd-ticker value="welcome to DnD Ticker" speed="normal"></dnd-ticker>

```



```js preview-story
export const ticker = () => html`
<dnd-ticker value="welcome to DnD Ticker" speed="normal"></dnd-ticker>

`;
```

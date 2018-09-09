# WorfDown
Markdown parser written in TypeScript.

It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.

## Example
```js
import worfdown from 'worfdown';

const text = `
Some text -- Some more --strike text-- __underline__ ''italic'' **bold**

   var x = 5;
   console.log(x);
 
* list item
** Subitem
* list item 2

> some text
`;
// Pass a Markdown string, get back an HTML string.
const html = worfdown(text);
console.log(html);
```

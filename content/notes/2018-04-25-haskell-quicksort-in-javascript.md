---
title: Haskell Quicksort in JavaScript
type: text
---

Haskell is a really neat language! In fact, you can implement quicksort in [just one line](https://wiki.haskell.org/Introduction#Brevity).
While this is tremendously inefficient, I thought it would be fun to create a JS version of the one-liner, should I ever need it in an interview.

```javascript
const quicksort = ([h, ...arr]) =>
  [h, ...arr].length === 0
    ? []
    : [
        ...quicksort(arr.filter(a => h >= a)),
        h,
        ...quicksort(arr.filter(a => h < a)),
      ]
```

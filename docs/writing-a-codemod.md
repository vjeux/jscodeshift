# Writing a codemod

Your codemod is likely going to be structured in the following way:
- you want to find an AST node
- mutate the AST to reflect the changes you want to make
- generate the new source code

```js
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(/* ... */)
    .forEach(/* ... */)
    .toSource();
};
```

## Avoid doing work

Because `jscodeshift` mutation API relies on direct mutation of the AST, it cannot know that you changed something and therefore will try to print the entire file all the time. A handy trick to reduce the time it takes to run the codemod in cases where there are a lot of false positives is to only return `toSource()` from `transformer` function when something has changed.

```js
export default function transformer(file, api) {
  const j = api.jscodeshift;
  let hasChanged = false;

  const root = j(file.source)
    .find(/* ... */)
    .forEach(path => {
      hasChanged = true;
      // ...
    });
    
  if (hasChanged) {
    return root.toSource();
  }
};
```

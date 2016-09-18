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


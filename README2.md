# jscodeshift [![Build Status](https://travis-ci.org/facebook/jscodeshift.svg?branch=master)](https://travis-ci.org/facebook/jscodeshift)

## Running jscodeshift

You want to put your JavaScript transform file outside of the folder under source control where you are going to apply the codemod. This will make your life easier when you want to revert the changes.

The simplest way to run `jscodeshift` is the following

```zsh
jscodeshift . -t ../transform.js
```

The downside of this approach is that it's going to run through every single file in your codebase. This is going to be slower than needed as it's going to parse files that will not be affected by your codemod.

The suggested approach is to first `grep` for a pattern that you know files affected by your codemod will contain. For example, if we want to remove all the `describe` calls, we can `grep` for the string `describe(`. This doesn't need to be precise, we just want to trim down the number of total files to process.

```zsh
grep -R 'describe(' .
```

Once you are happy with the results, then you can append `-l` to `grep` which will only print the filenames and use `xargs` to pass it to `jscodeshift`.

```zsh
grep -R 'describe(' . -l | xargs jscodeshift -t ../transform.js
```

Another handy unix utility is `find` which lets you find all the files with a specific name.

```zsh
find . -name '*-test.js'
```

## Writing a codemod

Your codemod is likely going to be structured in the following way:
- you want to find an AST node
- filter the results such that it only captures the pattern you want to transform
- mutate the AST to reflect the changes you want to make
- generate the new source code

```js
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(...)
    .filter(path => { ... })
    .forEach(path => { ... })
    .toSource();
};
```

### Finding a node

If you want to do a simple pattern-matching agains the AST, you can use `find`. For example if your AST looks like

```js
{
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'describe'
  }
}
```

you can write

```js
  .find(j.CallExpression, {callee: {type: 'Identifier', name: 'describe'}})
```

In practice, the above method is not very flexible and it is likely that you will want to write actual code to find the node you are looking for. You can combine `find` and `filter`.

```js
  .find(j.CallExpression)
  .filter(path =>
    path.node.callee.type === 'Identifier' &&
    path.node.callee.name === 'describe'
  )
```


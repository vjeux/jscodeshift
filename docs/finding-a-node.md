# Finding a node

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

## Second argument of `find`

you can write

```js
  .find(j.CallExpression, {callee: {type: 'Identifier', name: 'describe'}})
```

## `filter`

In practice, the method above is not very flexible and it is likely that you will want to write actual code to find the node you are looking for. You can combine `find` and `filter`.

```js
  .find(j.CallExpression)
  .filter(path =>
    path.node.callee.type === 'Identifier' &&
    path.node.callee.name === 'describe'
  )
```

By writing conditions like we've done above, there is a lot of repetition between the lines: in this tiny example `path.node.callee` is repeated twice. You should resist the urge to be DRY (Do not Repeat Yourself) and put all of those in variables! It is easier to understand what is going on when you have the full path written in code.

## Helper functions

If you need to extract those out, you can write function helpers for it.

```js
function isDescribeNode(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'describe'
  );
}

// ...

  .filter(path => isDescribeNode(node.path))
```

## Always check the `type` of a node

If you read the code closely enough, you may realize that I didn't check that `node.callee` existed before dereferencing it. The rule of thumb is that you always (yes, always!) want to check the `type` field of every node you read from the AST and then you are usually good assuming that all the attributes will be there.

## Nested calls

If you have a node or a path, you can wrap it in `j` and call `find` again.

```js
  .find(j.CallExpression)
  .forEach(path => {
    j(path.node).find(j.Identifier).forEach(/* ... */);
  }
```

## Length of a collection

The object you get from a `j` call are not real arrays, so unfortunately `.length` doesn't work on them. Instead you can call `.size()` to get the length of a collection.

```js
  .find(j.CallExpression)
  .size()
```

## Traversing up

There are two concepts that is worth understanding:

- A `node` is a plain JS object which represents the AST node that you are familiar with
- A `path` is an object that
  - you can call methods like `find` and `forEach` and has two useful attributes:
  - `parentPath` which allows you to traverse the AST upward
  - `node` which gives you the raw AST node

If you want to traverse the AST upwards, the `parentPath` attribute is handy. A common use case is to find out if you are inside of an AST node of a specific type.

```js
function isInsideOfFunctionDeclaration(path) {
  while (path) {
    if (path.node.type === 'FunctionDeclaration') {
      return true;
    }
    path = path.parentPath;
  }
  return false;
}
```

### Getting a `node` from a `path`

If you have a reference to a `node`, you can get a `path` back by wrapping it into `j`, but you lose the ability to traverse up the tree because `parentPath` no longer exists. You can only go down from this point.

```js
  .forEach(path => {
    var node = path.node;
    var path = j(node); // You lost the ability to access parentPath!
    path.find(/* ... */)
  })
```

# Modifying the AST

Now that you found the node you were looking for, it is time to actually change it.

## Mutate nodes directly

The easiest way is to just mutate the ast nodes in place. When you are going to eventually call `toSource()`, recast will detect what changed and only reprint those sections.

For example, if you want to reverse the name of all the identifiers, you can write

```js
  .find(j.Identifier)
  .forEach(path => {
    path.node.name = path.node.name.split('').reverse().join('');
  })
```

## Creating a new node

In order to create a new node, you want to use a node builder. For example if you want to create a node of type `ArrowFunctionExpression`, you build it by calling `j.arrowFunctionExpression()`: the type of the node but the first letter being lowercase.

The easiest way to know what arguments the builder takes is to call it with no arguments and read the error message.

```js
j.arrowFunctionExpression()
// Error: no value or default function given for field "params" of
// ArrowFunctionExpression(
//   "params": [Pattern],
//   "body": BlockStatement | Expression,
//   "expression": boolean
// )
```

The builders are hand-written in order provide an easy way to specify the most common ways of creating new nodes. They do not encode all the possible values a node can have. If you want to modify an attribute that a builder doesn't have, you can just edit the raw node returned from the builder after the fact.

```js
var arrow = j.arrowFunctionExpression([], j.blockStatement([]));
arrow.async = true;
```

If you are curious, check out the [list of all the specified builders](https://github.com/benjamn/ast-types/tree/master/def).

## Replacing nodes

You are likely going to want to replace a node by another you just created. There's a helper for this imaginatively called `replaceWith`. It only works on collections that have access to their parents, so you need to have a reference to a `path` variable if you want to do that.

```js
var node = j.identifier('kikoo');
j(path).replaceWith(node);
```

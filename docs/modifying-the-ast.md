# Modifying the AST

Now that you found the node you were looking for, it is time to modify the AST! The first step is to figure out what the AST looks like before and after the transformations. For this, the easiest way is to write both versions in [ASTExplorer.net](http://astexplorer.net/) and inspect the AST in the right pane.

![](https://cloud.githubusercontent.com/assets/197597/18655379/3972e6fa-7e9d-11e6-96a6-bc082a57298b.gif)

## Mutate nodes directly

The AST is a set of nodes which are just plain JavaScript values, you can and should mutate them directly. At the end of the codemod when you call `toSource()`, `jscodeshift` will detect what you mutated and only reprint those sections. This is useful to preserve as much of the original formatting as possible.

For example, if you want to reverse the name of all the identifiers, you can write

```js
  .find(j.Identifier)
  .forEach(path => {
    path.node.name = path.node.name.split('').reverse().join('');
  })
```

## Creating a new node

In order to create a new node, you want to use a node builder. For example if you want to create a node of type `ArrowFunctionExpression`, you invoke its builder by calling `j.arrowFunctionExpression()`. The builders are named the same as the node type but with the first character being lowercase.

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

The builders are hand-written in order provide an easy way to specify the most common ways of creating new nodes. They do not encode all the possible attributes a node can have. If you want to modify an attribute that a builder doesn't have, you can mutate the raw node returned from the builder after the fact.

```js
var arrow = j.arrowFunctionExpression([], j.blockStatement([]));
arrow.async = true;
```

If you are curious, check out the [list of all the specified builders](https://github.com/benjamn/ast-types/tree/master/def).

## Template helpers

The code using builder can become hard to understand if you don't know the AST representation very well. `jscodeshift` has a nifty feature which lets you use the es6 template strings in order to build the AST.

For example, if you write to create the AST representation of `foo[foo.length - 1]`, using builders it would look like

```js
var name = 'foo';
var node = j.memberExpression(
  j.identifier(name),
  j.binaryExpression(
    '-',
    j.memberExpression(
      j.identifier(name),
      j.identifier('length')
    ),
    j.literal(1)
  )
);
```

or you can use `j.template.expression`

```js
var name = 'foo';
var node = j.template.expression`${name}[${name} - 1]`
```

There are also `j.template.statement` and `j.template.statements` if you need them.

## Replacing a node

If you have access to the parent node and know in which attribute the node you want to update is, you can mutate it directly.

```js
path.node.callee = j.identifier('kikoo');
```

In many cases howerver, you are querying for the node you want to replace and you don't know the type of the parent nor in which attribute that node resides. For those cases, there's a handy helper called `replaceWith` that can be used. Note that you cannot use it if you just have a `node`, you need its `path` as it contains the information to traverse up (`parentPath`).

```js
j(path).replaceWith(j.identifier('kikoo'));
```

It's important to realize that there is no validation of the AST structure after you modify it. `jscodeshift` will happily pretty-print an ill-formed AST resulting in a code that doesn't parse properly anymore.

## Removing a node

Node removal behaves very similarly as replacement, you can either do it the mutative way or use the `remove` helper when you don't know the parent.

```js
j(path).remove();
```

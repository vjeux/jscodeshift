# jscodeshift [![Build Status](https://travis-ci.org/facebook/jscodeshift.svg?branch=master)](https://travis-ci.org/facebook/jscodeshift)

`jscodeshift` is a toolkit for writing and running JavaScript codemods.

### Usage

Implement your codemods using [ASTExplorer.net](http://astexplorer.net/): Transform > `jscodeshift`

<a href="http://astexplorer.net/"><img width="502" height="275" src="https://cloud.githubusercontent.com/assets/197597/18656125/6bf22e64-7ea3-11e6-9b96-d770c14b0d9d.png"></a>

And run them over your codebase using the command line tool

```zsh
npm install -g jscodeshift
```

<a href="docs/writing-a-codemod.md"><img width="250" height="240" src="https://cloud.githubusercontent.com/assets/197597/18656034/7db256f2-7ea2-11e6-9dd3-42a20e6eedfd.png"></a>

### Guides



- [Writing a codemod](docs/writing-a-codemod.md)
- [Finding a node](docs/finding-a-node.md)
- [Modifying the AST](docs/modifying-the-ast.md)
- [Optimizing runtime](docs/optimizing-runtime.md)

### Example Codemods

- [react-codemod](https://github.com/reactjs/react-codemod) - React codemod scripts to update React APIs.
- [js-codemod](https://github.com/cpojer/js-codemod/) - Codemod scripts to transform code to next generation JS.
- [js-transforms](https://github.com/jhgg/js-transforms) - Some documented codemod experiments to help you learn.

### Support

* Discord - [#codemod](https://discordapp.com/channels/102860784329052160/103748721107292160) on [Reactiflux](http://www.reactiflux.com/)

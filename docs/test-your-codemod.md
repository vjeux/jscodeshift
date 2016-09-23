# Test your codemod

`jscodeshift` integrates nicely with [jest](https://facebook.github.io/jest/) in order to let you unit test your codemods.

First, you want to create a new folder and setup jscodeshift, jest and babel:

```zsh
echo '{ "scripts": { "test": "jest" } }' > package.json
echo '{ "presets": ["es2015"] }' > .babelrc
npm install --save jscodeshift jest babel-jest babel-preset-es2015
```

And then use the following code structure to test your codemod:

- `__tests__/`
  - `my-codemod-test.js`
- `__testfixtures__/`
  - `my-codemod.input.js`
  - `my-codemod.output.js`
- `my-codemod.js`

The important file is `__tests__/my-codemod-test.js` as it uses the `defineTest` utility function exposed by `jscodeshift`.

```js
// __tests__/my-codemod-test.js
const { defineTest } = require('jscodeshift/dist/testUtils');
defineTest(__dirname, 'my-codemod');
```

`my-codemod.js` is the file that implements the codemod. In this case we use the short codemod that reverses the letters of all the identifiers in the file.

```js
// my-codemod.js
export default function transformer(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.Identifier)
    .replaceWith(path => j.identifier(path.node.name.split('').reverse().join('')))
    .toSource();
}
```

The fixtures are your test cases, `.input.js` is the file pre-transformed and `.output.js` is the file after the codemod has ran through it.

```js
// __testfixtures__/my-codemod.input.js
function printTips() {
  tips.forEach((tip, i) => console.log(`Tip ${i}:` + tip));
}
```

```js
// __testfixtures__/my-codemod.output.js
function spiTtnirp() {
  spit.hcaErof((pit, i) => elosnoc.gol(`Tip ${i}:` + pit));
}
```

Once those files are there, you can simply run

```zsh
npm test
```

```
 PASS  __tests__/my-codemod-test.js
  my-codemod
    ✓ transforms correctly

Test Summary
 › Ran all tests.
 › 1 test passed (1 total in 1 test suite)
```

## Multiple tests for a single codemod

It is likely that you are going to want to run multiple tests against the same codemod. For this, you want to use the optional arguments of `defineTest`.

For example if you want to have a test dedicated to functions and one to strings, you would create the following fixtures

- `__testfixtures__/`
  - `my-codemod-functions.input.js`
  - `my-codemod-functions.output.js`
  - `my-codemod-strings.input.js`
  - `my-codemod-strings.output.js`
  
And the test file would look like that:

```js
// __tests__/my-codemod-test.js
const { defineTest } = require('jscodeshift/dist/testUtils');
defineTest(__dirname, 'my-codemod', null, 'my-codemod-functions');
defineTest(__dirname, 'my-codemod', null, 'my-codemod-strings');
```

The second argument is the name of the codemod and the fourth is the name of the fixture.

Notice how we put `null` as third argument, it is the `options` arguments forwarded to the transformer function `transformer(file, api, options)`. Most transforms do not use it but this can be useful in some cases.

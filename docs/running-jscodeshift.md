# Running jscodeshift

You want to put your JavaScript transform file outside of the folder under source control where you are going to apply the codemod. This will make your life easier when you want to revert the changes.

The simplest way to run `jscodeshift` is the following

```zsh
jscodeshift . -t ../transform.js
```


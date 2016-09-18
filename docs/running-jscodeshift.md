# Running jscodeshift

You want to put your JavaScript transform file outside of the folder under source control where you are going to apply the codemod. This will make your life easier when you want to revert the changes.

The simplest way to run `jscodeshift` is the following

```zsh
jscodeshift . -t ../transform.js
```

## `grep` and `xargs`

The downside of this approach is that it's going to run through every single file in your codebase. This is going to be slower than needed as it's going to parse files that will not be affected by your codemod.

The suggested approach is to first `grep` for a pattern that you know files affected by your codemod will contain. For example, if we want to remove all the `describe` calls, we can `grep` for the string `describe(`. This doesn't need to be precise, we just want to trim down the number of total files to process.

```zsh
grep -R 'describe(' .
```

Once you are happy with the results, then you can append `-l` to `grep` which will only print the filenames and use `xargs` to pass it to `jscodeshift`.

```zsh
grep -R 'describe(' . -l | xargs jscodeshift -t ../transform.js
```

## `find`

Another handy unix utility is `find` which lets you find all the files with a specific name.

```zsh
find . -name '*-test.js'
```

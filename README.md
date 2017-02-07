# gitterjs

[![Join the chat at https://gitter.im/cope/gitterjs](https://badges.gitter.im/cope/gitterjs.svg)](https://gitter.im/cope/gitterjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Shortcut for recursive git pull/commit/push

## Install:
    npm i -g gitterjs

## Options:
    -h, --help       output usage information
    -V, --version    output the version number

    -l, --pull       Execute git pull recursively in all subfolders
    -c, --commit     Execute git commit recursively in all subfolders
    -p, --push       Execute git commit and push recursively in all subfolders

    <no params>      Same as using -l:
                     Execute git pull recursively in all subfolders

## Usage:
    > gitter
    Already up-to-date.

# gitterjs
[![build status](https://img.shields.io/travis/cope/gitterjs.svg?branch=master)](https://travis-ci.org/cope/gitterjs)
[![codacy](https://img.shields.io/codacy/grade/1a630d0861ef45b9b2eee0e7d0da47f2.svg)](https://www.codacy.com/project/cope/gitterjs/dashboard)
[![coverage](https://img.shields.io/coveralls/github/cope/gitterjs/master.svg)](https://coveralls.io/github/cope/gitterjs?branch=master)
[![dependencies](https://david-dm.org/cope/gitterjs.svg)](https://www.npmjs.com/package/gitterjs)
[![npm](https://img.shields.io/npm/dt/gitterjs.svg)](https://www.npmjs.com/package/gitterjs)

[![Join the chat at https://gitter.im/cope/gitterjs](https://badges.gitter.im/cope/gitterjs.svg)](https://gitter.im/cope/gitterjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Greenkeeper badge](https://badges.greenkeeper.io/cope/gitterjs.svg)](https://greenkeeper.io/)
Shortcut for recursive git pull/commit/push

## Install:
    npm i -g gitterjs

## Options:
    -h, --help             output usage information
    -V, --version          output the version number

    -l, --pull             Execute git pull recursively in all subfolders
    -c, --commit           Execute git commit recursively in all subfolders
    -p, --push             Execute git commit and push recursively in all subfolders
    -m, --message [value]  An optional message
    -v, --verbose          Verbose

    <no params>            Same as using -l:
                           Execute git pull recursively in all subfolders

## Usage:
    > gitter
    Already up-to-date.

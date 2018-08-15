#!/usr/bin/env node

"use strict";

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Usage:
 * -l, --pull             Execute git pull recursively in all subfolders
 * -c, --commit           Execute git commit recursively in all subfolders
 * -p, --push             Execute git commit and push recursively in all subfolders
 * -m, --message [value]  An optional message
 * -v, --verbose          Verbose
 *
 * <no params>            Same as using -l:
 *                        Execute git pull recursively in all subfolders
 */

var commander = require("commander");

commander
	.version("0.1.2")
	.option("", "")
	.option("-l, --pull", "Execute git pull recursively in all subfolders", false)
	.option("-c, --commit", "Execute git commit recursively in all subfolders", false)
	.option("-p, --push", "Execute git commit and push recursively in all subfolders", false)
	.option("-m, --message [value]", "An optional message")
	.option("-v, --verbose", "Verbose")
	.option("", "")
	.option("<no params>", "Same as using -l:")
	.option("", "Execute git pull recursively in all subfolders")
	.parse(process.argv);

commander.pull = true === commander.pull;
commander.commit = true === commander.commit;
commander.push = true === commander.push;

if (!commander.commit && !commander.push) commander.pull = true;

var gitterjs = require("./lib/gitterjs");
gitterjs.run(commander);

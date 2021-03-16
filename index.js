#!/usr/bin/env node
"use strict";

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Usage:
 * -l, --pull             Execute git pull recursively in all subfolders
 * -c, --commit           Execute git commit recursively in all subfolders
 * -p, --push             Execute git commit and push recursively in all subfolders
 * -m, --message [value]  Commit message (optional)
 * -n, --name [value]     Execute git config user.name recursively in all subfolders
 * -e, --email [value]    Execute git config user.email recursively in all subfolders
 * -v, --verbose          Verbose
 *
 * <no params>            Same as using -l:
 *                        Execute git pull recursively in all subfolders
 */

const commander = require("commander");

const packageJson = require('./package.json');
commander
	.version(packageJson.version)
	.option("", "")
	.option("-l, --pull", "Execute git pull recursively in all subfolders", false)
	.option("-c, --commit", "Execute git commit recursively in all subfolders", false)
	.option("-p, --push", "Execute git commit and push recursively in all subfolders", false)
	.option("-m, --message [value]", "Commit message (optional)")
	.option("-n, --name [value]", "Execute git config user.name \"[value]\" recursively in all subfolders")
	.option("-e, --email [value]", "Execute git config user.email \"[value]\" recursively in all subfolders")
	.option("-v, --verbose", "Verbose", false)
	.option("", "")
	.option("<no params>", "Same as using -l:")
	.option("", "Execute git pull recursively in all subfolders")
	.parse(process.argv);

commander.pull = true === commander.pull;
commander.commit = true === commander.commit;
commander.push = true === commander.push;

if (!commander.commit && !commander.push && !commander.name && !commander.email) commander.pull = true;

const gitterjs = require("./lib/gitterjs");
gitterjs.run(commander);

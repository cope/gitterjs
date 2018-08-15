#!/usr/bin/env node

"use strict";

var fs = require("fs");
var _ = require("lodash");
var moment = require("moment");
var execSync = require("child_process").execSync;

var options = {};

function goto(dir, print) {
	print && console.log("\nIn " + dir);
	process.chdir(dir);
}

function run(commander) {
	options = commander;

	var gits = _.uniq(find(process.cwd()));

	var commands = [
		"git remote prune origin",
		"git fetch --prune"
	];

	if (options.pull) {
		commands.push("git pull");

	} else {
		var message = options.message || "gitterjs autocommit " + moment().format("YYYY-MM-DD HH:mm:ss");

		commands.push("git add .");
		commands.push("git commit -a -m "
		" + message + "
		""
	)
		;

		if (options.push) {
			commands.push("git pull");
			commands.push("git config --global push.default matching");
			commands.push("git push");
		}
	}

	_.forEach(gits, function (dir) {
		goto(dir, true);
		_.forEach(commands, function (command) {
			options.verbose && console.log(command);
			execute(command);
		});
	});
}

function isGit(path) {
	try {
		goto(path);
		var git = execSync("git rev-parse --is-inside-work-tree", {encoding: "utf8"});
	} catch (e) {
	}
	return !!git;
}

function execute(command) {
	try {
		console.log(execSync(command, {encoding: "utf8"}).trim());
	} catch (e) {
	}
}

function find(path) {

	var ret = [];
	if (isGit(path)) ret.push(path);

	var done = !_.isEmpty(ret);
	if (!done) {
		var id, childPath, child, children = fs.readdirSync(path);
		for (id in children) {
			if (children.hasOwnProperty(id)) {
				childPath = path + "/" + children[id];
				child = fs.lstatSync(childPath);
				if (child.isDirectory()) {
					if (isGit(childPath)) ret.push(childPath);
					ret = ret.concat(find(childPath));
				}
			}
		}
	}
	return ret;
}

module.exports = {
	run: run
};

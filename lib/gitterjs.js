#!/usr/bin/env node
"use strict";

const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");
const execSync = require("child_process").execSync;

let options = {};

const goto = (dir, print) => {
	print && console.log("\nIn " + dir);
	process.chdir(dir);
};

const isGit = (path) => {
	let git;
	try {
		goto(path);
		git = execSync("git rev-parse --is-inside-work-tree", {encoding: "utf8"});
	} catch (e) {
	}
	return !!git;
};

const find = (path) => {
	let ret = [];
	if (isGit(path)) ret.push(path);

	let done = !_.isEmpty(ret);
	if (!done) {
		let id, childPath, child, children = fs.readdirSync(path);
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
};

const execute = (command) => {
	try {
		console.log(execSync(command, {encoding: "utf8"}).trim());
	} catch (e) {
	}
};

module.exports = {
	run: function (commander) {
		options = commander;

		let gits = _.uniq(find(process.cwd()));

		let commands = [
			"git remote prune origin",
			"git fetch --prune"
		];

		if (options.pull) {
			commands.push("git pull");

		} else {
			let message = options.message || "gitterjs autocommit " + moment().format("YYYY-MM-DD HH:mm:ss");

			commands.push("git add .");
			commands.push("git commit -a -m " + message + "");

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
};

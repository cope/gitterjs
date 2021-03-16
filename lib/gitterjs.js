#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require('os');
const path = require('path');
const execSync = require("child_process").execSync;

const _ = require("lodash");
const moment = require("moment");

let options = {};

const _goto = (dir, print) => {
	print && console.log("\nIn " + dir);
	process.chdir(dir);
};

const _error = (e, source, value) => {
	console.error('Check ERROR:', e.message);
	const tmplog = path.join(os.tmpdir(), 'gitterjs-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.log');
	e.gitterjs = {};
	e.gitterjs[source] = value;
	fs.writeFileSync(tmplog, JSON.stringify(_.omit(e, ['envPairs', 'options']), null, 4));
	console.error('Logfile:', tmplog, '\n');
};

const _isGit = (path) => {
	let git;
	try {
		_goto(path);
		git = execSync("git rev-parse --is-inside-work-tree", {encoding: "utf8"});
	} catch (e) {
		_error(e, 'path', path);
	}
	return !!git;
};

const _find = (path) => {
	let ret = [];
	if (_isGit(path)) ret.push(path);

	let done = !_.isEmpty(ret);
	if (!done) {
		let id, childPath, child, children = fs.readdirSync(path);
		for (id in children) {
			if (children.hasOwnProperty(id)) {
				childPath = path + "/" + children[id];
				child = fs.lstatSync(childPath);
				if (child.isDirectory()) {
					if (_isGit(childPath)) ret.push(childPath);
					ret = ret.concat(_find(childPath));
				}
			}
		}
	}
	return ret;
};

const _execute = (command) => {
	try {
		console.log(execSync(command, {encoding: "utf8"}).trim());
	} catch (e) {
		_error(e, 'command', command);
	}
};

module.exports = {
	run(commander) {
		options = _.pick(commander, ['pull', 'commit', 'push', 'message', 'name', 'email', 'verbose']);

		let gits = _.uniq(_find(process.cwd()));

		let commands = [
			"git remote prune origin",
			"git fetch --prune"
		];

		if (options.name) commands.push('git config user.name "' + options.name + '"');
		if (options.email) commands.push('git config user.email "' + options.email + '"');

		if (options.pull) commands.push("git pull");
		else if (options.push) {
			let message = options.message || "gitterjs autocommit " + moment().format("YYYY-MM-DD HH:mm:ss");

			commands.push("git add .");
			commands.push("git commit -a -m \"" + message + "\"");

			if (options.push) {
				commands.push("git pull");
				commands.push("git config --global push.default matching");
				commands.push("git push");
			}
		}

		_.forEach(gits, function (dir) {
			_goto(dir, true);
			_.forEach(commands, function (command) {
				options.verbose && console.log(command);
				_execute(command);
			});
		});
	}
};

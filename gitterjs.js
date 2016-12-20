#!/usr/bin/env node

'use strict';

/**
 * @author: Predrag Stojadinovic <predrag@stojadinovic.net>
 *
 * Usage:
 * -l, --pull        Execute git pull recursively in all subfolders
 * -c, --commit      Execute git commit recursively in all subfolders
 * -p, --push        Execute git commit and push recursively in all subfolders
 *
 * <no params>       Same as using -l:
 *                   Execute git pull recursively in all subfolders
 */

var fs = require('fs');
var _ = require('lodash');
var cmd = require('node-cmd');
var moment = require('moment');
var Promise = require('bluebird');
var commander = require('commander');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;

commander
	.version('0.0.1')
	.option('', '')
	.option('-l, --pull', 'Execute git pull recursively in all subfolders', false)
	.option('-c, --commit', 'Execute git commit recursively in all subfolders', false)
	.option('-p, --push', 'Execute git commit and push recursively in all subfolders', false)
	.option('', '')
	.option('<no params>', 'Same as using -l:')
	.option('', 'Execute git pull recursively in all subfolders')
	.parse(process.argv);

commander.pull = true === commander.pull;
commander.commit = true === commander.commit;
commander.push = true === commander.push;

if (!commander.commit && !commander.push) {
	commander.pull = true;
}

// commander debug:
// console.log('commander.pull: ' + commander.pull);
// console.log('commander.commit: ' + commander.commit);
// console.log('commander.push: ' + commander.push);

var gitterjs = {

	isGit: function (path) {
		try {
			this.goto(path);
			var git = execSync('git rev-parse --is-inside-work-tree', {encoding: 'utf8'});
		} catch (e) {
		}
		return !!git;
	},

	execute: function (command) {
		try {
			console.log(execSync(command, {encoding: 'utf8'}).trim());
		} catch (e) {
		}
	},

	find: function (path) {

		var ret = [];
		if (this.isGit(path)) {
			ret.push(path);
		}

		var done = !_.isEmpty(ret);
		if (!done) {
			var id, childPath, child, children = fs.readdirSync(path);
			for (id in children) {
				if (children.hasOwnProperty(id)) {
					childPath = path + '/' + children[id];
					child = fs.lstatSync(childPath);
					if (child.isDirectory()) {
						if (this.isGit(childPath)) {
							ret.push(childPath);
						}
						ret = ret.concat(this.find(childPath));
					}
				}
			}
		}
		return ret;
	},

	goto: function (dir, print) {
		print && console.log('\nIn ' + dir);
		process.chdir(dir);
	},

	all: function () {
		var self = this;

		// var gits = _.uniq(this.find(process.cwd()));
		var gits = _.uniq(this.find('D:/Bitbucket'));

		var commands = ['git remote prune origin'];
		if (commander.pull) {
			commands.push('git pull');
		}
		if (commander.commit) {
			commands.push('git add .');
			commands.push('git commit -a -m "gitterjs autocommit ' + moment().format("YYYY-MM-DD HH:mm:ss") + '"');
		}
		if (commander.push) {
			if (commander.commit) {
				commands.push('git push');
			} else {
				commands.push('git add .');
				commands.push('git commit -a -m "gitterjs autocommit ' + moment().format("YYYY-MM-DD HH:mm:ss") + '"');
				commands.push('git push');
			}
		}

		_.forEach(gits, function (dir) {
			self.goto(dir, true);
			_.forEach(commands, function (command) {
				self.execute(command);
			});
		});
	}
};

gitterjs.all();

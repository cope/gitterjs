const _ = require('lodash');
const expect = require("chai").expect;

const gitterjs = require("../lib/gitterjs");

describe("gitterjs tests", function () {
	it('gitterjs should exist', function () {
		expect(gitterjs).to.exist;
	});

	it('gitterjs.run should exist', function () {
		expect(gitterjs.run).to.exist;
	});

});

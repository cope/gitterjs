var _ = require("lodash");
var expect = require("chai").expect;

var gitterjs = require("../lib/gitterjs");

describe("gitterjs tests", function () {
	it("gitterjs should exist", function () {
		expect(gitterjs).to.exist;
	});

	it("gitterjs.run should exist", function () {
		expect(gitterjs.run).to.exist;
	});

});

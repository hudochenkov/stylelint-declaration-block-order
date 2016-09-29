'use strict';

const stylelint = require('stylelint');
const test = require('ava');

function assertEquality(processCss, context) {
	const testFn = (context.only) ? test.only : test;

	testFn(
		context.caseDescription,
		(t) => processCss.then((comparisons) => {
			comparisons.forEach((input) => {
				const actual = input.actual;
				const expected = input.expected;
				const description = input.description;

				t.is(actual, expected, description);
			});
		})
	);
}

module.exports = stylelint.createRuleTester(assertEquality);

'use strict';

const stylelint = require('stylelint');
const test = require('ava');

function testConfig(input) {
	let testFn;

	if (input.only) {
		testFn = test.only;
	} else if (input.skip) {
		testFn = test.skip;
	} else if (input.failing) {
		testFn = test.failing;
	} else {
		testFn = test;
	}

	testFn(input.description, (t) => {
		const config = {
			plugins: [
				'../'
			],
			rules: {
				'plugin/declaration-block-order': input.config
			}
		};

		return stylelint.lint({
			code: '',
			config,
		}).then(function (data) {
			const invalidOptionWarnings = data.results[0].invalidOptionWarnings;

			if (input.valid) {
				t.is(invalidOptionWarnings.length, 0);
			} else {
				t.is(
					invalidOptionWarnings[0].text,
					input.message
				);
			}
		});
	});
}

testConfig({
	description: 'valid keywords',
	valid: true,
	config: [
		'custom-properties',
		'dollar-variables',
		'declarations',
		'rules',
		'at-rules',
	],
});

testConfig({
	description: 'valid at-rules variants',
	valid: true,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			hasBlock: true
		},
		{
			type: 'at-rule',
			name: 'include',
		},
		{
			type: 'at-rule',
			hasBlock: true
		},
		{
			type: 'at-rule',
		}
	],
});

testConfig({
	description: 'valid keyword with at-rule variant (keyword last)',
	valid: true,
	config: [
		{
			type: 'at-rule',
		},
		'declarations',
	],
});

// testConfig({
// 	description: 'valid keyword with at-rule variant (keyword first)',
// 	valid: true,
// 	failing: true,
// 	config: [
// 		'declarations',
// 		{
// 			type: 'at-rule',
// 		},
// 	],
// });

testConfig({
	description: 'invalid keyword',
	valid: false,
	config: [
		'custom-property',
	],
	message: 'Invalid option "["custom-property"]" for rule plugin/declaration-block-order',
});

testConfig({
	description: 'invalid at-rule type',
	valid: false,
	config: [
		{
			type: 'atrule'
		},
	],
	message: 'Invalid option "[{"type":"atrule"}]" for rule plugin/declaration-block-order',
});

testConfig({
	description: 'invalid hasBlock property',
	valid: false,
	config: [
		{
			type: 'at-rule',
			hasBlock: 'yes'
		},
	],
	message: 'Invalid option "[{"type":"at-rule","hasBlock":"yes"}]" for rule plugin/declaration-block-order',
});

testConfig({
	description: 'invalid name property',
	valid: false,
	config: [
		{
			type: 'at-rule',
			name: ''
		},
	],
	message: 'Invalid option "[{"type":"at-rule","name":""}]" for rule plugin/declaration-block-order',
});

testConfig({
	description: 'invalid name property with hasBlock defined',
	valid: false,
	config: [
		{
			type: 'at-rule',
			hasBlock: true,
			name: ''
		},
	],
	message: 'Invalid option "[{"type":"at-rule","hasBlock":true,"name":""}]" for rule plugin/declaration-block-order',
});

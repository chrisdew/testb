// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var dict = require('./dict').dict;

function lex(text) {
	if (text === "") return { success: false, completions: [] };
}

exports.lex = lex;
// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var dict = require('./dict').dict;
require('./util');

function lex(text) {
	if (text === "") return { success: false, completions: [], tokens: [], pos: [] };
	var words = text.split(" ");
	var success = false;
	var completions = [];
	var tokens = [];
	var pos = [];
	
	// look at all words except the last
	//for (var i; i < (words.length - 1); i++) {
	//	if (dict[words[i]] === undefined) return { success: false, completions: []: tokens: [], pos: [] };
	//	tokens.push(words[i]);
	//	pos.push(dict[words[i]]);
	//}
	
	// look at the last word
	var lastWord = words.slice(-1)[0];
	//console.log(lastWord);
	
	// find all possible words whihc begin with the lastword
	for (var p in dict) {
		//console.log(p);
		if (p.startsWith(lastWord)) {
			completions.push(p.slice(lastWord.length));
		}
	}
	
	// last word is a word in it's own right
	//if (dict[lastWord] !== undefined) {
	//	tokens.push(lastWord);
	//	pos.push(dict[lastWord]);
	//}
	
	return { success: success, completions: completions, tokens: tokens, pos: pos };
}

exports.lex = lex;
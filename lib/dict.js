var c = require("./constants");

exports.dict = 
	{ axe: c.NOUN | c.SINGULAR
	, big: c.ADJECTIVE
	, brass: c.ADJECTIVE
	, drop: c.VERB
	, east: c.DIRECTION | c.ADVERB
	, fire: c.VERB | c.NOUN
	, free: c.VERB | c.ADJECTIVE
	, get: c.VERB
	, give: c.VERB
	, go: c.VERB
	, her: c.PRONOUN | c.FEMALE
	, him: c.PRONOUN | c.MALE
	, it: c.PRONOUN
	, lantern: c.NOUN | c.SINGULAR
	, north: c.DIRECTION | c.ADVERB
	, northern: c.ADJECTIVE
	, on: c.PREPOSITION
	, put: c.VERB
	, red: c.ADJECTIVE
	, sheep: c.NOUN | c.SINGULAR | c.PLURAL
	, south: c.IRECTION | c.ADVERB
	, small: c.ADJECTIVE
	, stick: c.NOUN | c.SINGULAR | c.VERB
	, to: c.PREPOSITION
	, the: c.ARTICLE | c.DEFINITE
	, a: c.ARTICLE | c.INDEFINITE
	, west: c.DIRECTION | c.ADVERB
	, "with": c.PREPOSITION
	, ".": c.FULLSTOP
    } ;

exports.allWords = [];
for (var p in exports.dict) {
	exports.allWords.push(p);
}
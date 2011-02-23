var NOUN = 1
  , VERB = 2
  , ADVERB = 4
  , ADJECTIVE = 8
  , ARTICLE = 16
  , DEFINITE = 32
  , INDEFINITE = 64
  , SINGULAR = 128
  , PLURAL = 256
  , PREPOSITION = 512
  , MALE = 1024
  , FEMALE = 2048
  , DIRECTION = 4096
  , FULLSTOP = 8192
  , PRONOUN = 16384
  , CONJUNCTION = 32768
  ;

exports.dict = 
	{ axe: NOUN | SINGULAR
	, big: ADJECTIVE
	, brass: ADJECTIVE
	, drop: VERB
	, east: DIRECTION | ADVERB
	, fire: VERB | NOUN
	, free: VERB | ADJECTIVE
	, get: VERB
	, give: VERB
	, go: VERB
	, her: PRONOUN | FEMALE
	, him: PRONOUN | MALE
	, it: PRONOUN
	, lantern: NOUN | SINGULAR
	, north: DIRECTION | ADVERB
	, northern: ADJECTIVE
	, on: PREPOSITION
	, put: VERB
	, red: ADJECTIVE
	, sheep: NOUN | SINGULAR | PLURAL
	, south: DIRECTION | ADVERB
	, small: ADJECTIVE
	, stick: NOUN | SINGULAR | VERB
	, to: PREPOSITION
	, the: ARTICLE | DEFINITE
	, a: ARTICLE | INDEFINITE
	, west: DIRECTION | ADVERB
	, "with": PREPOSITION
	, ".": FULLSTOP
    } ;

exports.allWords = [];
for (var p in exports.dict) {
	exports.allWords.push(p);
}
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
	, east: DIRECTION | ADVERB
	, fire: VERB | NOUN
	, get: VERB
	, give: VERB
	, go: VERB
	, her: PRONOUN | FEMALE
	, him: PRONOUN | MALE
	, it: PRONOUN
	, lantern: NOUN | SINGULAR
	, north: DIRECTION | ADVERB
	, red: ADJECTIVE
	, sheep: NOUN | SINGULAR | PLURAL
	, south: DIRECTION | ADVERB
	, small: ADJECTIVE
	, to: PREPOSITION
	, the: ARTICLE | DEFINITE
	, a: ARTICLE | INDEFINITE
	, west: DIRECTION | ADVERB
	, ".": FULLSTOP
    } ;
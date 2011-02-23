var c = require('./constants');

var parsers = {	direction: [c.DIRECTION]
              , verbOnly: [c.VERB] 	   
              , verbNoun: [c.VERB, c.NOUN]   
              , verbAdjectiveNoun: [c.VERB, c.ADJECTIVE, c.NOUN]      
              , verbArticleNoun: [c.VERB, c.ARTICLE, c.NOUN]
              , verbArticleAdjectiveNoun: [c.VERB, c.ARTICLE, c.ADJECTIVE, c.NOUN]      
};
/*
var verb = [verbPhrase];
var verbSubject = [verbPhrase, nounPhrase];
var verbSubjectPrepObject = [verbPhrase, nounPhrase, c.PREPOSITION, nounPhrase];
var verbPhrase = [c.VERB];
var nounPhrase = [c.ARTICLE | c.OPTIONAL];
*/                       
    
// The parse function takes the output from the lex and fails or succeeds.
// It also provides some completions.
function parse(lex) {
	var matches = [];
	var pos = [];
	for (var p in parsers) {
		for (var i in lex.pos) {
			if (i >= parsers[p].length) {
				break;
			}
			if (!(lex.pos[i] & parsers[p][i])) {
				break;
			}
			pos.push(parsers[p]);
			matches.push(p);
		}
	}
	return { matches: matches, pos: pos };
}

exports.parse = parse;

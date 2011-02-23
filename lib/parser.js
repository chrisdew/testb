var c = require('./constants');

var direction = [c.DIRECTION | c.VERB];
var verb = [verbPhrase];
var verbSubject = [verbPhrase, nounPhrase];
var verbSubjectPrepObject = [verbPhrase, nounPhrase, c.PREPOSITION, nounPhrase];
var verbPhrase = [c.VERB];
var nounPhrase = [c.ARTICLE | c.OPTIONAL];
                         
              


exports.direction = direction;
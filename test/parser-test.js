// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var vows = require('vows')
  , assert = require('assert')
  , lex = require('../lib/lexer').lex
  , parse = require('../lib/parser').parse
  , dict = require('../lib/dict')
  , c = require('../lib/constants')
  ;

var suite = vows.describe('parser').addBatch(
    { "direction"
    : { topic
      : lex("north")
      , "test direction parsing"
      : function(topic) { assert.deepEqual(parse(topic), { matches: [ 'direction' ], pos: [ [ 4096 ] ] } ); }
      }
    , "verb..."
    : { topic
      : lex("get a")
      , "test completion"
      : function(topic) { assert.deepEqual(parse(topic), {}); }
      }
    }
)

suite.export(module);
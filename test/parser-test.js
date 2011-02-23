// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var vows = require('vows')
  , assert = require('assert')
  , lex = require('../lib/lexer').lex
  , parser = require('../lib/parser')
  , dict = require('../lib/dict')
  , c = require('../lib/constants')
  ;

var suite = vows.describe('parser').addBatch(
    { "empty string"
    : { topic
      : parser.direction
      , "test direction parsing"
      : function(topic) { assert.deepEqual(topic(lex("north")), { direction: c.N }); }
      }
    }
)

suite.export(module);
// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var vows = require('vows')
  , assert = require('assert')
  , lex = require('../lib/lexer').lex
  ;

var suite = vows.describe('lexer').addBatch(
    { "empty string"
    : { topic
      : ""
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: [] }); }
      }
    , "one char"
    : { topic
      : "f"
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: ["fire", "free"] }); }
      }
    }
)

suite.export(module);

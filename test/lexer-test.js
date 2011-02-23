// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.

var vows = require('vows')
  , assert = require('assert')
  , lex = require('../lib/lexer').lex
  , dict = require('../lib/dict')
  ;

var suite = vows.describe('lexer').addBatch(
    { "empty string"
    : { topic
      : ""
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: [], tokens: [], pos: [] }); }
      }
    , "one char"
    : { topic
      : "f"
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: ["ire", "ree"], tokens: [], pos: [] }); }
      }
    , "two words plus"
    : { topic
      : "stick the s"
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: ['heep', 'outh', 'mall', 'tick'], tokens: [ 'stick', 'the' ], pos: [ 131, 48 ] }); }
      }
    , "determined word"
    : { topic
      : "sheep"
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: true, completions: [], tokens: ['sheep'], pos: [ 385 ] }); }
      }
    , "indeterminate word"
    : { topic
      : "north"
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: true, completions: [ 'ern' ], tokens: [ 'north' ], pos: [ 4100 ] }); }
      }
    , "open indeterminate word"
    : { topic
      : "north "
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: false, completions: dict.allWords, tokens: [ 'north' ], pos: [ 4100 ] }); }
      }
    , "closed indeterminate word"
    : { topic
      : "north ."
      , "test lexing"
      : function(topic) { assert.deepEqual(lex(topic), { success: true, completions: [], tokens: [ 'north', '.' ], pos: [ 4100, 8192 ] }); }
      }
    }
)

suite.export(module);

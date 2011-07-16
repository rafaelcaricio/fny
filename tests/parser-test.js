/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

var vows = require('vows'),
    assert = require('assert'),
    Parser = require('../parser'),
    nodes = require('../nodes'),
    Context = require('../context');

vows.describe('The Parser').addBatch({
    'when I create a new instance': {
        topic: function() {
            return new Parser('');
        },
        'and call with empty value': {
            topic: function(parser) {
                return parser.parse();
            },
            'the object node should be a Block instance': function(topic) {
                assert.instanceOf(topic, nodes.Block);
            },
            'when it runs': {
                topic: function(code) {
                    return code.execute;
                },
                'should be return undefined value': function(topic) {
                    assert.isUndefined(topic());
                }
            }
        }
    },
    'when I parse "1"': {
        topic: function() {
            var parser = new Parser('1');
            return parser.parse();
        },
        'the return should be a Block instance': function(topic) {
            assert.instanceOf(topic, nodes.Block);
        },
        'the result of execution should be a number 1': function(topic) {
            assert.equal(topic.execute(), 1);
        }
    },
    'when I parse "1+1"': {
        topic: function() {
            var parser = new Parser('1 + 1');
            return parser.parse();
        },
        'the return of execution shold be 2': function(topic) {
            assert.equal(topic.execute(), 2);
        }
    },
    'when I parse "3 - 1"': {
        topic: function() {
            var parser = new Parser('3 - 1');
            return parser.parse();
        },
        'the return of execution shold be 2': function(topic) {
            assert.equal(topic.execute(), 2);
        }
    },
    'when I parse "3*3"': {
        topic: function() {
            var parser = new Parser('3*3');
            return parser.parse();
        },
        'the return of execution shold be 9': function(topic) {
            assert.equal(topic.execute(), 9);
        }
    },
    'when I parse "12/2"': {
        topic: function() {
            var parser = new Parser('12/2');
            return parser.parse();
        },
        'the return of execution shold be 6': function(topic) {
            assert.equal(topic.execute(), 6);
        }
    },
    'when I parse "5 + (10 / (1+1))"': {
        topic: function() {
            var parser = new Parser('5 + (10 / (1+1))');
            return parser.parse();
        },
        'the return of execution shold be 10': function(topic) {
            assert.equal(topic.execute(), 10);
        }
    },
    'when I parse "5+10/(1+1)"': {
        topic: function() {
            var parser = new Parser('5+10/(1+1)');
            return parser.parse();
        },
        'the return of execution shold be 10': function(topic) {
            assert.equal(topic.execute(), 10);
        }
    },
    'when I parse "5*2 + 2*2 + 3*2"': {
        topic: function() {
            var parser = new Parser('5*2 + 2*2 + 3*2');
            return parser.parse();
        },
        'the return of execution shold be 20': function(topic) {
            assert.equal(topic.execute(), 20);
        }
    },
    'when I parse "6 - 1 - 3"': {
        topic: function() {
            var parser = new Parser('6 - 1 - 3');
            return parser.parse();
        },
        'the return of execution shold be 2': function(topic) {
            assert.equal(topic.execute(), 2);
        }
    },
    'when I parse "3 * (4 + 5 - ( 3 * 6) - 2 * 3 * 4  + 5 * 6 - 2) - 1"': {
        topic: function() {
            var parser = new Parser('3 * (4 + 5 - ( 3 * 6) - 2 * 3 * 4  + 5 * 6 - 2) - 1');
            return parser.parse();
        },
        'the return of execution shold be -16': function(topic) {
            assert.equal(topic.execute(), -16);
        }
    },
    'when I parse "value = 1"': {
        topic: function() {
            var parser = new Parser('value = 1');
            return parser.parse();
        },
        'the return of execution shold be 1': function(topic) {
            assert.equal(topic.execute(new Context()), 1);
        }
    },
    'when I parse "\"my string value\""': {
        topic: function() {
            var parser = new Parser('"my string value"');
            return parser.parse();
        },
        'the return of execution shold be "my string value"': function(topic) {
            assert.equal(topic.execute(), "my string value");
        }
    },
    'when I parse "print("hello world")"': {
        topic: function() {
            var parser = new Parser('print("hello world")');
            return parser.parse(new Context());
        },
        'the return of execution shold be "hello world"': function(topic) {
            assert.equal(topic.execute(), "hello world");
        }
    },
    'when I parse "print(1 + 2)"': {
        topic: function() {
            var parser = new Parser('print(1 + 2)');
            return parser.parse(new Context());
        },
        'the return of execution shold be "3"': function(topic) {
            assert.equal(topic.execute(), 3);
        }
    }
}).export(module);

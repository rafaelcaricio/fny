var vows = require('vows'),
    assert = require('assert'),
    Parser = require('../parser'),
    nodes = require('../nodes');;

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
    }
}).export(module);
 

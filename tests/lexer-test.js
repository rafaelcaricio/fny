var vows = require('vows'),
    assert = require('assert'),
    Lexer = require('../calc.js').Lexer;

vows.describe('The Lexer').addBatch({
    'when I create a new instance': {
        topic: function() {
            return new Lexer('my input');
        },
        'the lineno should be initialized': function(topic) {
            assert.equal(topic.lineno, 1);
        },
        'the input shold be a attribute': function(topic) {
            assert.equal(topic.input, 'my input');
        }
    },
    'when I send "1" as input': {
        topic: function() {
            var lex = new Lexer('1');
            return lex.next();
        },
        'the first token should be a object': function (topic) {
            assert.isObject(topic);
        },
        'the first token should be a number': function(topic) {
            assert.equal(topic.type, 'Number');
        },
        'the token value should be 1': function(topic) {
            assert.equal(topic.val, 1);
        }
    },
    'when I send "11" as input': {
        topic: function() {
            var lex = new Lexer('11');
            return lex.next();
        },
        'the first token should be a number': function(topic) {
            assert.equal(topic.type, 'Number');
        },
        'the value should be 11': function(topic) {
            assert.equal(topic.val, 11);
        }
    },
    'when I send "   1" as input': {
        topic: function() {
            var lex = new Lexer('     1');
            return lex.next();
        },
        'the token value shold be 1': function(topic) {
            assert.equal(topic.val, 1);
        }
    },
    'when I send "(123)" as input': {
        topic: function() {
            var lex = new Lexer('(123)');
            return lex.next();
        },
        'the token value should be 123': function(topic) {
            assert.equal(topic.val, 123);
        }
    },
    'when I send " 1 +2" as input': {
        topic: function() {
            var lex = new Lexer(' 1 +2');
            return lex.next();
        },
        'the token type should be Add': function(topic) {
            assert.equal(topic.type, 'Add');
        },
        'the left side':{
            topic: function(token) {
                return token.left;
            },
            'should be a object': function(topic) {
                assert.isObject(topic);
            },
            'the type of token shold be Number': function(topic) {
                assert.equal(topic.type, 'Number');
            },
            'the value of token should be 1': function(topic) {
                assert.equal(topic.val, 1);
            }
        },
        'the right side': {
            topic: function(token) {
                return token.right;
            },
            'should be a object': function(topic) {
                assert.isObject(topic);
            },
            'the type of token shold be Number': function(topic) {
                assert.equal(topic.type, 'Number');
            },
            'the value of token should be 2': function(topic) {
                assert.equal(topic.val, 2);
            }
        }
    },
    'when I send "(1+2" as value': {
        topic: function() {
            var lex = new Lexer('(1+2');
            return lex.next;
        },
        'should be raised a error': function(topic) {
            assert.throws(topic, Error);
        }
    },
    'when I send "1+" as value': {
        topic: function() {
            var lex = new Lexer('1+');
            return lex.next;
        },
        'should be raised a error': function(topic) {
            assert.throws(topic, Error);
        }
    },
    'when I send "1-1" as input': {
        topic: function() {
            var lex = new Lexer('1-1');
            return lex.next();
        },
        'the token type should be Sub': function(topic) {
            assert.equal(topic.type, 'Sub');
        }
    }
}).export(module);

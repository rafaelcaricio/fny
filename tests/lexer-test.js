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
    Lexer = require('../lexer');

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
    'when I create a new instance with a empty value': {
        topic: function() {
            var lex = new Lexer('');
            return lex.next();
        },
        'the token should be a EOF': function(topic) {
            assert.equal(topic.type, 'EOF');
        }
    },
    'when I send "1" as input': {
        topic: function() {
            return new Lexer('1');
        },
        'the first token': {
            topic: function(lex) {
                return lex.next();
            },
            'should be a object': function (topic) {
                assert.isObject(topic);
            },
            'should be a number': function(topic) {
                assert.equal(topic.type, 'Num');
            },
            'the token value should be 1': function(topic) {
                assert.equal(topic.val, 1);
            }
        },
        'if we call 2 times': {
            topic: function(lex) {
                lex.next();
                return lex.next();
            },
            'the type of the last token shold be': function(topic) {
                assert.equal(topic.type, 'EOF');
            }
        }
    },
    'when I send "11" as input': {
        topic: function() {
            var lex = new Lexer('11');
            return lex.next();
        },
        'the first token should be a number': function(topic) {
            assert.equal(topic.type, 'Num');
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
    'when I send "4 * 5" as input': {
        topic: function() {
            var lex = new Lexer('4 * 5');
            return lex.next();
        },
        'the token shold be Mult': function(topic) {
            assert.equal(topic.type, 'Mult');
        }
    },
    'when I send "8 / 2" as input': {
        topic: function() {
            var lex = new Lexer('8 / 2');
            return lex.next();
        },
        'the token shold be Div': function(topic) {
            assert.equal(topic.type, 'Div');
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
    },
    'when I send "-2" as input': {
        topic: function() {
            var lex = new Lexer('-2');
            return lex.next();
        },
        'the token type shold be a Number': function(topic) {
            assert.equal(topic.type, 'Num');
        },
        'the token value shold be -2': function(topic) {
            assert.equal(topic.val, -2);
        }
    },
    'when I send "-2-1" as input': {
        topic: function() {
            var lex = new Lexer('-2-1');
            return lex.next();
        },
        'the token type shold be a Sub': function(topic) {
            assert.equal(topic.type, 'Sub');
        },
        'the left side': {
            topic: function(token) {
                return token.left;
            },
            'should be a object': function(topic) {
                assert.isObject(topic);
            },
            'the type of token shold be Number': function(topic) {
                assert.equal(topic.type, 'Num');
            },
            'the value of token should be -2': function(topic) {
                assert.equal(topic.val, -2);
            }
        }
    },
    "when I send '1 Mult (2 Sum 3)'": {
        topic: function() {
            var lex = new Lexer('1 * (2 + 3)');
            return lex.next();
        },
        'the token type shold be a Mult': function(topic) {
            assert.equal(topic.type, "Mult");
        }
    },
    "when I send '1 Mult 2 Sum 3'": {
        topic: function() {
            var lex = new Lexer('1 * 2 + 3');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        }
    },
    "when I send '1 Sum 2 Mult 3'": {
        topic: function() {
            var lex = new Lexer('1 + 2 * 3');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        },
        'the left side': {
            topic: function(token) {
                return token.left;
            },
            'should be a number': function(topic) {
                assert.equal(topic.type, 'Num');
            }
        }
    },
    "when I send '2 Mult 2 Sum 2 Mult 2'": {
        topic: function() {
            var lex = new Lexer('2 * 2 + 2 * 2');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        },
        "the left side": {
            topic: function(token) {
                return token.left;
            },
            "should be Mult": function(topic) {
                assert.equal(topic.type, 'Mult');
            }
        },
        "the right side": {
            topic: function(token) {
                return token.right;
            },
            "should be Mult": function(topic) {
                assert.equal(topic.type, 'Mult');
            }
        }
    },
    "when I send '2 Mult 2 Sum 2 Mult 2 Add 2 Mult 2'": {
        topic: function() {
            var lex = new Lexer('2 * 2 + 2 * 2 + 2 * 2');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        }
    },
    "when I send '(1 Sum 2) Mult 3'": {
        topic: function() {
            var lex = new Lexer('(1 + 2) * 3');
            return lex.next();
        },
        'the token type shold be a Mult': function(topic) {
            assert.equal(topic.type, "Mult");
        }
    },
    "when I send '2 Div 1 Sum 3'": {
        topic: function() {
            var lex = new Lexer('2 / 1 + 3');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        }
    },
    "when I send '3 Sum 2 Div 1'": {
        topic: function() {
            var lex = new Lexer('3 + 2 / 1');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        }
    },
    "when I send '5 Mult 2 Add 2 Mult 2 Add 3 Mult 2'": {
        topic: function() {
            var lex = new Lexer('5 * 2 + 2 * 2 + 3 * 2');
            return lex.next();
        },
        'the token type shold be a Add': function(topic) {
            assert.equal(topic.type, "Add");
        }
    },
    "when I send 'rafael'": {
        topic: function() {
            var lex = new Lexer('rafael');
            return lex.next();
        },
        'the type should be "Id"': function(topic) {
            assert.equal(topic.type, 'Id');
        },
        'the value should be "name"': function(topic) {
            assert.equal(topic.val, 'rafael');
        }
    },
    "when I send 'result = 1'": {
        topic: function() {
            var lex = new Lexer('result = 1');
            return lex.next();
        },
        'the type should be "Assing"': function(topic) {
            assert.equal(topic.type, 'Assign');
        },
        'the "id"': {
            topic: function(topic) {
                return topic.id;
            },
            'the value should be "name"': function(topic) {
                assert.equal(topic.val, 'result');
            }
        },
        'the "value"': {
            topic: function(topic) {
                return topic.value;
            },
            'the value should be "1"': function(topic) {
                assert.equal(topic.val, '1');
            }
        }
    },
    "when I send '__name__ = 1'": {
        topic: function() {
            var lex = new Lexer('__name__ = 1');
            return lex.next().id;
        },
        'the type should be "Id"': function(topic) {
            assert.equal(topic.type, 'Id');
        },
        'the value should be "__name__"': function(topic) {
            assert.equal(topic.val, '__name__');
        }
    },
    "when I send '\"\"'": {
        topic: function() {
            var lex = new Lexer('""');
            return lex.next();
        },
        'the type should be "Str"': function(topic) {
            assert.equal(topic.type, 'Str');
        },
        'the value should be ""': function(topic) {
            assert.equal(topic.val, '');
        }
    },
    "when I send '\"hello world\"'": {
        topic: function() {
            var lex = new Lexer('"hello world"');
            return lex.next();
        },
        'the type should be "Str"': function(topic) {
            assert.equal(topic.type, 'Str');
        },
        'the value should be "hello world"': function(topic) {
            assert.equal(topic.val, 'hello world');
        }
    },
    "when I send '\"1 + 1\"'": {
        topic: function() {
            var lex = new Lexer('"1 + 1"');
            return lex.next();
        },
        'the type should be "Str"': function(topic) {
            assert.equal(topic.type, 'Str');
        },
        'the value should be "1 + 1"': function(topic) {
            assert.equal(topic.val, '1 + 1');
        }
    },
    "when I send 'print(1)'": {
        topic: function() {
            var lex = new Lexer('print(1)');
            return lex.next();
        },
        'the type should be "Call"': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the type should be "Id"': function(topic) {
            assert.equal(topic.val.type, 'Id');
        },
        'the val should be "print"': function(topic) {
            assert.equal(topic.val.val, 'print');
        },
        'the value type should be "Num"': function(topic) {
            assert.equal(topic.arg_list.val[0].type, 'Num');
        },
        'the value should be "1"': function(topic) {
            assert.equal(topic.arg_list.val[0].val, '1');
        }
    },
    "when I send 'print(\"hello word!\")'": {
        topic: function() {
            var lex = new Lexer('print("hello world!")');
            return lex.next();
        },
        'the type should be "Call"': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the value type should be "Num"': function(topic) {
            assert.equal(topic.arg_list.val[0].type, 'Str');
        },
        'the value should be "hello world!"': function(topic) {
            assert.equal(topic.arg_list.val[0].val, 'hello world!');
        }
    },
    "when I send 'print(1+(2+3))'": {
        topic: function() {
            var lex = new Lexer('print(1+ (2 + 3))');
            return lex.next();
        },
        'the type should be "Call"': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the value type should be "Num"': function(topic) {
            assert.equal(topic.arg_list.val[0].type, 'Add');
        }
    },
    "when I send '(print)(1)'": {
        topic: function() {
            var lex = new Lexer('(print)(1)');
            return lex.next();
        },
        'the type should be "Call"': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the value type should be "Num"': function(topic) {
            assert.equal(topic.arg_list.val[0].type, 'Num');
        }
    },
    "when I send '(c)()'": {
        topic: function() {
            var lex = new Lexer('(c)()');
            return lex.next();
        },
        'the type should be "Call"': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the value should be "c"': function(topic) {
            assert.equal(topic.val.val, 'c');
        },
        'the argument list should be empty': function(topic) {
            assert.isEmpty(topic.arg_list.val);
        }
    },
    "when I send 'c(1, 2)'": {
        topic: function() {
            var lex = new Lexer('c(1, 2)');
            return lex.next();
        },
        'the size of argument list should be 2': function(topic) {
            assert.equal(topic.arg_list.val.length, 2);
        }
    },
    "when I send block": {
        topic: function() {
            var lex = new Lexer('1; 2');
            return lex.next();
        },
        'the type should be CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I send block": {
        topic: function() {
            var lex = new Lexer('1 + 2; 3');
            return lex.next();
        },
        'the type should be CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I send block": {
        topic: function() {
            var lex = new Lexer('1 + 2; a(-2)');
            return lex.next();
        },
        'the type should be CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I send block": {
        topic: function() {
            var lex = new Lexer('1 + 2; (-1)');
            return lex.next();
        },
        'the type should be CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I create a func {}": {
        topic: function() {
            var lex = new Lexer('{}');
            return lex.next();
        },
        'the type should be Func': function(topic) {
            assert.equal(topic.type, 'Func');
        }
    },
    "when I create a func {x}": {
        topic: function() {
            var lex = new Lexer('{x}');
            return lex.next();
        },
        'the type should be Func': function(topic) {
            assert.equal(topic.type, 'Func');
        },
        'the value should be a Id': function(topic) {
            assert.equal(topic.val.type, 'Id');
        }
    },
    "when I create a func {x:1}": {
        topic: function() {
            var lex = new Lexer('{x:1}');
            return lex.next();
        },
        'the type should be Func': function(topic) {
            assert.equal(topic.type, 'Func');
        },
        'the value should be a Num': function(topic) {
            assert.equal(topic.val.type, 'Num');
        },
        'the argument list exists': function(topic) {
            assert.equal(topic.arg_list.val.length, 1);
        }
    },
    "when I create a func {x:}": {
        topic: function() {
            var lex = new Lexer('{x:}');
            return lex.next();
        },
        'the type should be Func': function(topic) {
            assert.equal(topic.type, 'Func');
        },
        'the value should be a Num': function(topic) {
            assert.isNull(topic.val);
        },
        'the argument list exists': function(topic) {
            assert.equal(topic.arg_list.val.length, 1);
        }
    },
    "when I create a func {x: x + 1}": {
        topic: function() {
            var lex = new Lexer('{x: x + 1}');
            return lex.next();
        },
        'the value should be a Add': function(topic) {
            assert.equal(topic.val.type, 'Add');
        },
        'the argument list exists': function(topic) {
            assert.equal(topic.arg_list.val.length, 1);
        }
    },
    "when I create a func {x: x + 1}(2)": {
        topic: function() {
            var lex = new Lexer('{x: x + 1}(2)');
            return lex.next();
        },
        'the value should be a Call': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the argument list exists': function(topic) {
            assert.equal(topic.arg_list.val.length, 1);
        }
    },
    "when I create a func {}()": {
        topic: function() {
            var lex = new Lexer('{}()');
            return lex.next();
        },
        'the value should be a Call': function(topic) {
            assert.equal(topic.type, 'Call');
        },
        'the argument list exists': function(topic) {
            assert.equal(topic.arg_list.val.length, 0);
        }
    },
    "when I create a func { 2; 4 }": {
        topic: function() {
            var lex = new Lexer('{ 2; 4 }');
            return lex.next();
        },
        'the value should be a Func': function(topic) {
            assert.equal(topic.type, 'Func');
        },
        'the value type should be CodeBlock': function(topic) {
            assert.equal(topic.val.type, 'CodeBlock');
        }
    },
    "when I create a codeblock myfunc = {x:x+1}; myfunc(3)": {
        topic: function() {
            var lex = new Lexer('myfunc = {x:x+1}; myfunc(3);');
            return lex.next();
        },
        'the value should be a CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I create a codeblock add = {a: {b: a + b}}; add(1)(1)": {
        topic: function() {
            var lex = new Lexer('add = {a: {b: a + b}}; add(1)(1)');
            return lex.next();
        },
        'the value should be a CodeBlock': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    },
    "when I avaluate a boolean expression ==": {
        topic: function() {
            var lex = new Lexer('1 == 1');
            return lex.next();
        },
        'the value should be Equal expression': function(topic) {
            assert.equal(topic.type, 'Equal');
        }
    },
    "when I avaluate a boolean expression >": {
        topic: function() {
            var lex = new Lexer('2 > 1');
            return lex.next();
        },
        'the value should be GreaterThan expression': function(topic) {
            assert.equal(topic.type, 'GreaterThan');
        }
    },
    "when I avaluate a boolean expression <": {
        topic: function() {
            var lex = new Lexer('2 < 3 + 1');
            return lex.next();
        },
        'the value should be LowerThan expression': function(topic) {
            assert.equal(topic.type, 'LowerThan');
        }
    },
    "when I avaluate a boolean expression &&": {
        topic: function() {
            var lex = new Lexer('2 < 3 + 1 && 4 > 2');
            return lex.next();
        },
        'the value should be And expression': function(topic) {
            assert.equal(topic.type, 'And');
        }
    },
    "when I avaluate a boolean basic expression": {
        topic: function() {
            var lex = new Lexer('1 && 2 || 4');
            return lex.next();
        },
        'the value should be And expression': function(topic) {
            assert.equal(topic.type, 'Or');
        }
    },
    "when I avaluate a boolean basic expression": {
        topic: function() {
            var lex = new Lexer('a = 1; a == 2;');
            return lex.next();
        },
        'the value should be And expression': function(topic) {
            assert.equal(topic.type, 'CodeBlock');
        }
    }
}).export(module);

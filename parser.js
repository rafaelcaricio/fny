/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

var Lexer = require('./lexer');
var nodes = require('./nodes');

var Parser = module.exports = function(input) {
    this.lexer = new Lexer(input);
}

Parser.prototype = {
    parse: function() {
        var block = new nodes.Block();

        block.lineno = this.lexer.lineno;

        for (var token = this.lexer.next();
                token.type != 'EOF'; 
                token = this.lexer.next()) {

            block.push(this.parseProgram(token));

        }

        return block;
    },

    parseProgram: function(token) {
        return this['parse' + token.type](token);
    },

    parseCall: function(token) {
        var call = new nodes.Call(token);
        call.target = this.parseCallable(token.val);
        call.args = this.parseExpList(token.arg_list);
        return call;
    },

    parseExpList: function(token) {
        var expList = new nodes.ExpList(token);

        expList.expressions = [];
        for (var i = 0; i < token.val.length; i++) {
            expList.expressions.push(this.parseExp(token.val[i]));
        }

        return expList;
    },

    parseCallable: function(token) {
        return this['parse' + token.type](token);
    },

    parseExp: function(token) {
        return this['parse' + token.type](token);
    },

    parseNum: function(token) {
        return new nodes.Num(token);
    },

    parseFunc: function(token) {
        var func = new nodes.Func(token);
        func.value = this.parseCallable(token.val);
        func.args_declaration = this.parseIdList(token.arg_list);
        return func;
    },

    parseIdList: function(token) {
        var idList = new nodes.IdList(token);
        if (token.val) {
            for (var i = 0; i < token.val.length; i++) {
                idList.values.push(this.parseId(token.val[i]));
            }
        }
        return idList;
    },

    parseCodeBlock: function(token) {
        var codeBlock = new nodes.CodeBlock(token);
        for (var i = 0; i < token.val.length; i++) {
            codeBlock.values.push(this.parseExp(token.val[i]));
        }
        return codeBlock;
    },

    parseBinaryOp: function(exp, token) {
        var binary = new exp(token);
        binary.left = this.parseExp(token.left);
        binary.right = this.parseExp(token.right);
        return binary;
    },

    parseAdd: function(token) {
        return this.parseBinaryOp(nodes.Add, token);
    },

    parseSub: function(token) {
        return this.parseBinaryOp(nodes.Sub, token);
    },

    parseMult: function(token) {
        return this.parseBinaryOp(nodes.Mult, token);
    },

    parseDiv: function(token) {
        return this.parseBinaryOp(nodes.Div, token);
    },
    
    parseStr: function(token) {
        return new nodes.NString(token)
    },

    parseAssign: function(token) {
        var assignment = new nodes.Assign(token);
        assignment.id = this.parseId(token.id);
        assignment.value = this.parseExp(token.value)
        return assignment;
    },

    parseId: function(token) {
        return new nodes.Id(token);
    }
}

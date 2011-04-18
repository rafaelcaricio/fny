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

            block.push(this.parseExp(token));

        }

        return block;
    },

    parseExp: function(token) {
        return this['parse' + token.type](token);
    },

    parseNum: function(token) {
        return new nodes.Num(token);
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
    }
}

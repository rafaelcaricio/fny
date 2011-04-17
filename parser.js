var Lexer = require('./lexer');

var Parser = module.exports = function(input) {
    this.lexer = new Lexer(input);
}

Parser.prototype = {
    parse: function() {
        var block = nodes.Block();

        block.lineno = this.lexer.lineno;

        for (var token = this.lexer.next();
                token.type != 'EOF'; 
                token = this.lexer.next()) {
            block.push(this.parseExp(token));
        }

        return block;
    },

    parseExp: function(token) {
        ;
    }
}

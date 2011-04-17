
var Lexer = function Lexer(input) {
    this.input = input;
    this.lineno = 1;
}

/*
 *
 *  AST:
 *
 *    calc -> parem 
 *              | exp
 *
 *    parem -> '(' exp ')'
 *
 *    exp -> num rest
 *
 *    rest -> '+' exp
 *              | '-' exp
 *              | '*' exp
 *              | '/' exp
 *              | &
 *
 *    num -> '0'
 *              | '1'
 *              | '2'
 *              | '3'
 *              ...
 *              | '9'
 *
 */

Lexer.prototype = {

    scan: function(regexp) {
        var captures;
        var blankCaptures;
        
        if (/^\n/.exec(this.input)) {
            this.lineno++;
            this.consume(1);
        } else if (blankCaptures = /^[ \r\t]+/.exec(this.input)) {
            this.consume(blankCaptures[0].length);
        }
        
        if (captures = regexp.exec(this.input)) {
            this.consume(captures[0].length);
        }
        return captures;
    },

    consume: function(size) {
        this.input = this.input.substr(size);
    },

    token: function(type, value) {
        return {
                type: type,
                val: value,
                lineno: this.lineno
               };
    },

    next: function() {
        var token = this.parem() || this.exp();
        return token;
    },

    exp: function() {
        var token = this.num();
        var rest;
        if (
            rest = this.add()
                || this.sub()
                ) {
            rest.left = token;
            token = rest;
        }
        return token;
    },

    sub: function() {
        var sub = /^-/;
        var token;

        if (this.scan(sub)) {
            token = this.token('Sub', '-');
            token.right = this.exp();
        }

        return token;
    },

    add: function() {
        var add = /^\+/;
        var token;

        if (this.scan(add)) {
            token = this.token('Add', '+');
            token.right = this.exp();
        }

        return token;
    },

    parem: function() {
        var startParem = /^\(/;
        var endParem = /^\)/;
        var token;
        var startParemOnLine = this.lineno;
        
        if (this.scan(startParem)) {
            
            token = this.exp();

            if (!this.scan(endParem)) {
                throw Error("Can't find end of parem in line " + startParemOnLine);
            }
        }
        return token;
    },

    num: function() {
        var number = /^([0-9]+)/;
        var captures;

        if (captures = this.scan(number)) {
            return this.token('Number', captures[1]);
        } else {
            throw new Error('Expected a number on line ' + this.lineno);
        }
    }

}

module.exports = {
    Lexer: Lexer
}

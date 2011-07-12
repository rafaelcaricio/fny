
var Lexer = module.exports = function(input) {
    if (input == null) {
        throw new Error('The input value should be passed!');
    }

    this.input = input;
    this.lineno = 1;
    this.cursor = 0;
}

/*
 *
 *  AST:
 *
 *    calc ->  exp
 *
 *    parem -> '(' exp ')'
 *
 *    exp -> num rest
 *              | parem
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
            this.cursor = 0;
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
        this.cursor += size;
        this.input = this.input.substr(size);
    },

    token: function(type, value) {
        return {
                type: type,
                val: value,
                lineno: this.lineno,
                cursor: this.cursor
               };
    },

    next: function() {
        var token;

        if (this.input.length) {
            token = this.exp();
        } else {
            token = this.token('EOF', null);
        }

        return token;
    },

    exp: function() {
        var token = this.parem() || this.num();
        var rest;
        if (
            rest = this.add()
                || this.sub()
                || this.mult()
                || this.div()
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

    mult: function() {
        var mult = /^\*/;
        var token;

        if (this.scan(mult)) {
            token = this.token('Mult', '*');
            token.right = this.exp();
            token = this.verifyPrecedence(token);
        }

        return token;
    },

    verifyPrecedence: function(token) {
        if ((token.right.type == "Add" || token.right.type == "Sub" ) && !token.right.has_parem) {
          token.left = token.right.left;
          token.right.left = token;
          token = token.right;
        }
        return token;
    },

    div: function() {
        var div = /^\//;
        var token;

        if (this.scan(div)) {
            token = this.token('Div', '/');
            token.right = this.exp();
            token = this.verifyPrecedence(token);
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
            token.has_parem = true;

            if (!this.scan(endParem)) {
                throw Error("Can't find end of parem in line " + startParemOnLine);
            }
        }
        return token;
    },

    num: function() {
        var number = /^(-?[0-9]+)/;
        var captures;

        if (captures = this.scan(number)) {
            return this.token('Num', captures[1]);
        } else {
            throw new Error('Expected a number at ' + this.lineno + ':' + this.cursor);
        }
    }

}

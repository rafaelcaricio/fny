
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
 *    exp -> binary_exp
 *
 *    binary_exp -> add_exp
 *
 *    add_exp -> sub_exp ( '+' sub_exp )*
 *
 *    sub_exp -> mult_exp ( '-' mult_exp )*
 *
 *    mult_exp -> div_exp ( '*' div_exp )*
 *
 *    div_exp -> unary_exp ( '/' unary_exp )*
 *
 *    unary_exp -> '++' exp
 *              | '--' exp
 *              | primary_exp ( '--' )?
 *              | primary_exp ( '++' )?
 *
 *    primary_exp -> num
 *              | parem
 *              | assignment
 *
 *    assignment -> name ( '=' exp )?
 *
 *    parem -> '(' exp ')'
 *
 *    num -> '0'
 *              | '1'
 *              | '2'
 *              | '3'
 *              ...
 *              | '9'
 *
 *     name -> 'a' .. 'Z' ( 'a' .. 'Z' | '0' .. '9' )*
 *
 */

Lexer.prototype = {

    tokens: {
        'Add': '+',
        'Sub': '-',
        'Mult': '*',
        'Div': '/'
    },

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

    primary_token: function(type) {
        return this.token(type, this.tokens[type]);
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
        var token = this.binary_exp();
        return token;
    },

    binary_exp: function() {
        return this.add_exp();
    },

    add_exp: function() {
        return this.binary_exp_template(/^\+/, 'Add', 'sub_exp', 'sub_exp');
    },

    sub_exp: function() {
        return this.binary_exp_template(/^-/, 'Sub', 'mult_exp', 'mult_exp');
    },

    mult_exp: function() {
        return this.binary_exp_template(/^\*/, 'Mult', 'div_exp', 'div_exp');
    },

    div_exp: function(left) {
        return this.binary_exp_template(/^\//, 'Div', 'primary_exp', 'primary_exp');
    },

    binary_exp_template: function(pattern, type, left, right) {
        var new_token;
        var token = this[left]();

        while (this.scan(pattern)) {
            new_token = this.primary_token(type);
            new_token.left = token;
            new_token.right = this[right]();
            token = new_token;
        }

        return token;
    },

    primary_exp: function() {
        var token = this.parem() || this.num() || this.assignment();
        if (!token) {
            throw Error("Expected '(' or number in line " + this.lineno);
        }
        return token;
    },

    assignment: function() {
        var assignment = /^=/;
        var token = this.name();
        
        if (this.scan(assignment)) {
            var aux = this.token('Assign', '=');
            aux.id = token;
            aux.value = this.exp();
            token = aux;
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
        }
    },

    name: function() {
        var id = /^([a-zA-Z][a-zA-Z0-9]+)/;
        var captures;

        if (captures = this.scan(id)) {
            return this.token('Id', captures[1]);
        }
    }

}

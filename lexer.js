
var Lexer = module.exports = function(input) {
    if (input == null) {
        throw new Error('An input value should be passed!');
    }

    this.input = input;
    this.lineno = 1;
    this.cursor = 0;
}

/*
 *
 *  AST:
 *
 *    program ->  stmt
 *              | exp
 *
 *    stmt -> print_stmt
 *
 *    print_stmt -> 'print' exp
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
 *              | value_exp ( '--' )?
 *              | value_exp ( '++' )?
 *
 *    value_exp -> num
 *              | parem
 *              | string
 *              | assignment
 *
 *    assignment -> id ( '=' exp )?
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
 *     id -> 'a' .. 'Z' | '_' ( 'a' .. 'Z' | '_' | '0' .. '9' )*
 *
 *     string -> '"' [^ '"'] '"'
 *
 */

Lexer.prototype = {

    tokens: {
        'Add': '+',
        'Sub': '-',
        'Mult': '*',
        'Div': '/'
    },

    keywords: [
        'print',
        'for',
        'while'
    ],

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

            token = this.stmt() 
                        || this.exp();

            if (!token || this.input.length) {
                throw Error("Invalid input!");
            }
        } else {
            token = this.token('EOF', null);
        }

        return token;
    },

    stmt: function() {
        return this.print_stmt();
    },

    print_stmt: function() {
        var print = /^print/;
        var token;
        
        if (this.scan(print)) {
            token = this.token("Print", "print");
            token.value = this.exp();
            if (!token.value) {
                throw Error("Can't find value for print in line " + this.lineno);
            }
        }

        return token;
    },

    exp: function() {
        return this.binary_exp();
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
        return this.binary_exp_template(/^\//, 'Div', 'value_exp', 'value_exp');
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

    value_exp: function() {
        return this.parem()
                || this.num()
                || this.assignment()
                || this.string();
    },

    string: function() {
        var startString = /^"/;
        var endString = /^([^"]*)"/;
        var token;
        var captures;
        var startStringOnLine = this.lineno;

        if (this.scan(startString)) {

            token = this.token("Str", "");

            if (captures = this.scan(endString)) {
                token.val += captures[1];
            } else {
                throw Error("Can't find end of string in line " + startStringOnLine);
            }
        }
        return token;
    },

    assignment: function() {
        var assignment = /^=/;
        var token = this.id();

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

    id: function() {
        var id = /^([a-zA-Z_][a-zA-Z0-9_]*)/;
        var captures;

        if (captures = this.scan(id)) {
            return this.token('Id', captures[1]);
        }
    }

}

/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

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
 *    program -> code_block | EOF
 *
 *    code_block -> execution_block ( execution_block )*
 *                  | &
 *
 *    execution_block -> stmt | exp
 *
 *    stmt -> for_stmt
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
 *              | string
 *              | call
 *              | &
 *
 *    call -> callable '(' exp_list ')'
 *
 *    callable -> parem
 *              | assignment
 *              | func_value
 *
 *    func_value -> '{' ( id_list ':' )? code_block '}'
 *
 *    id_list -> id (',' id)
 *
 *    assignment -> id ( '=' exp )?
 *
 *    exp_list -> exp ( ',' exp )*
 *                  | &
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
        'if',
        'for',
        'while',
        'in'
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

            token = this.code_block();

            if (!token || this.input.length) {
                console.log(token, this.input);
                throw Error("Invalid input!");
            }
        } else {
            token = this.token('EOF', null);
        }

        return token;
    },

    code_block: function() {
        var token = this.execution_block();

        if (token) {
            var block = this.token("CodeBlock", [token]);
            var next_token;

            while (next_token = this.execution_block()) {
                block.val.push(next_token);
            }

            if (block.val.length > 1) {
                token = block;
            }
        }

        return token;
    },

    execution_block: function() {
        return this.stmt()
                    || this.exp();
    },

    stmt: function() {
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

        while (token && this.scan(pattern)) {
            new_token = this.primary_token(type);
            new_token.left = token;
            new_token.right = this[right]();
            token = new_token;
        }

        return token;
    },

    value_exp: function() {
        return this.num()
                || this.string()
                || this.call();
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

    call: function() {
        var startCall = /^\(/;
        var endCall = /^\)/;
        var token = this.callable();
        var startCallLine = this.lineno;

        if (token && this.scan(startCall)) {


            token = this.token("Call", token);
            token.arg_list = this.exp_list();

            if (!this.scan(endCall)) {
                throw Error("Can't find end of call in line " + startCallLine);
            }
        }

        return token;
    },

    callable: function() {
        return this.parem()
            || this.assignment()
            //|| this.func_value();
    },

    func_value: function() {
        var startFunc = /^{/;
        var endArgList = /^:/;
        var endFunc = /^}/;
        var startFuncLine = this.lineno;
        var token;

        if (token = this.scan(startFunc)) {
            var args;

            if (args = this.id_list()) {
                if (!this.scan(endArgList)) {
                    throw new Error("End of arg list not defined!");
                }
            }
            
            token = this.token("Func", this.code_block() );

            if (!this.scan(endFunc)) {
                throw Error("Can't find end of function in line " + startCallLine);
            }
        }

        return token;
    },

    exp_list: function() {
        var separator = /^,/;
        var token = this.token("ExpList", []);
        var first = this.exp();

        if (first) {
            token.val.push(first);
            while (this.scan(separator)) {
                token.val.push(this.exp());
            }
        }

        return token;
    },

    assignment: function() {
        var assignment = /^=/;
        var token = this.id();

        if (token && this.scan(assignment)) {
            var aux = this.token('Assign', '=');
            aux.id = token;
            if (aux.value = this.exp()) {
                token = aux;
            } else {
                throw new Error("Expected value to assign in line " + this.lineno);
            }
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

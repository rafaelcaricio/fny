/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

var Context = function(builtins) {
    this.stack = [];
    this.increment();
    var self = this;
    if (builtins) {
        this.push("print", {
            arg_list: ['arg'],
            execute: function(execContext, argsValues) {
                builtins.print(argsValues[0]);
            }
        });
    }
}

Context.prototype = {

    increment: function() {
        this.stack.push({});
    },

    push: function(id, value) {
        this.stack[this.stack.length - 1][id] = value;
    },

    get: function(id) {
        for (var i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i][id] || this.stack[i][id] == 0) {
                return this.stack[i][id];
            }
        }
    },

    pop: function() {
        this.stack.pop();
    },

    snapshot: function() {
        var clone = {};
        for (var i = this.stack.length - 1; i >= 0; i--) {
            for (key in this.stack[i]) {
                if (clone[key] == undefined) {
                    clone[key] = this.stack[i][key];
                }
            }
        }
        return clone;
    },

    bind: function(variables) {
        for (key in variables) {
            this.push(key, variables[key]);
        }
    }
}

module.exports = Context;

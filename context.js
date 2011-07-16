/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

var Context = function(builtins) {
    this.stack = [builtins || {}];
}

Context.prototype = {

    increment: function() {
        this.stack.push({});
    },

    _getDefinitionContext: function(id) {
        for (var i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i][id]) {
                return this.stack[i];
            }
        }
        return this.stack[this.stack.length - 1];
    },

    push: function(id, value) {
        this._getDefinitionContext(id)[id] = value;
    },

    get: function(id) {
        return this._getDefinitionContext(id)[id];
    },

    pop: function() {
        this.stack.pop();
    }
}

module.exports = Context;

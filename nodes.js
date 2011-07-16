/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */

var Node = function Node(){};

Node.prototype.__proto__ = Array.prototype;
Node.prototype.execute = function(context) {};


var Block = function Block(node){
    if (node) this.push(node);
};

Block.prototype.__proto__ = Node.prototype;
Block.prototype.execute = function(context) {
    var result;

    if (this.length) {
        result = this[0].execute(context);
    }

    return result;
}


var Num = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

Num.prototype.__proto__ = Node.prototype;
Num.prototype.execute = function(context) {
    return parseInt(this.value);
}

var Id = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

Id.prototype.__proto__ = Node.prototype;
Id.prototype.execute = function(context) {
    return context.get(this.value);
}

var NString = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

NString.prototype.__proto__ = Node.prototype;
NString.prototype.execute = function(context) {
    return this.value;
}

var Assign = function(token) {
    this.lineno = token.lineno;
}

Assign.prototype.__proto__ = Node.prototype;
Assign.prototype.execute = function(context) {
    var result = this.value.execute(context);
    context.push(this.id.value, result);
    return result;
}

var Add = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Add.prototype.__proto__ = Node.prototype;
Add.prototype.execute = function(context) {
    return this.left.execute(context) + this.right.execute(context);
}

var Sub = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Sub.prototype.__proto__ = Node.prototype;
Sub.prototype.execute = function(context) {
    return this.left.execute(context) - this.right.execute(context);
}

var Mult = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Mult.prototype.__proto__ = Node.prototype;
Mult.prototype.execute = function(context) {
    return this.left.execute(context) * this.right.execute(context);
}

var Div = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Div.prototype.__proto__ = Node.prototype;
Div.prototype.execute = function(context) {
    return this.left.execute(context) / this.right.execute(context);
}

var CodeBlock = function(token) {
    this.lineno = token.lineno;
    this.values = [];
}

CodeBlock.prototype.__proto__ = Node.prototype;
CodeBlock.prototype.execute = function(context) {
    var result;

    context.increment();

    for (var i = 0; i < this.values.length; i++) {
        result = this.values[i].execute(context);
    }

    context.pop();

    return result;
}

var IdList = function(token) {
    this.lineno = token.lineno;
    this.values = [];
}

IdList.prototype.__proto__ = Node.prototype;
IdList.prototype.execute = function(context) {
    var ids = [];
    for (var i = 0; i < this.values.length; i++) {
        ids.push(this.values[i].value);
    }
    return ids;
}

var ValueFunc = function(snapshot, arg_list, func) {
    this.snapshot = snapshot;
    this.arg_list = arg_list;
    this.func = func;
}

ValueFunc.prototype.execute = function(context, args_values) {
    var result;

    context.increment();

    context.bind(this.snapshot);

    if (args_values.length > this.arg_list.length) {
        throw new Error("The target function have a small size of arguments. At line " + this.lineno);
    } else {
        for (var i = 0; i < args_values.length; i++) {
            context.push(this.arg_list[i], args_values[i]);
        }
    }

    result = this.func.execute(context);

    context.pop();
    return result;
}

var Func = function(token) {
    this.lineno = token.lineno;
    this.args_declaration = null;
    this.value = token.value;
}

Func.prototype.__proto__ = Node.prototype;
Func.prototype.execute = function(context) {
    return new ValueFunc(context.snapshot(), this.args_declaration.execute(context), this.value);
}

var Call = function(token) {
    this.lineno = token.lineno;
    this.target = null;
    this.args = null;
}

Call.prototype.__proto__ = Node.prototype;
Call.prototype.execute = function(context) {
    var args_values = this.args.execute(context);
    var targetFunc = this.target.execute(context);

    if (targetFunc == undefined) {
        throw new Error("Undefined function for call at line " + this.lineno);
    }

    return targetFunc.execute(context, args_values);
}

var ExpList = function(token) {
    this.lineno = token.lineno;
    this.expressions = null;
}

ExpList.prototype.__proto__ = Node.prototype;
ExpList.prototype.execute = function(context) {
    var resultList = [];

    for (var i = 0; i < this.expressions.length; i++) {
        resultList.push(this.expressions[i].execute(context));
    }

    return resultList;
}

module.exports = {
    Block: Block,
    Num: Num,
    Add: Add,
    Sub: Sub,
    Mult: Mult,
    Div: Div,
    NString: NString,
    Assign: Assign,
    Id: Id,
    Call: Call,
    ExpList: ExpList,
    IdList: IdList,
    Func: Func,
    CodeBlock: CodeBlock
}

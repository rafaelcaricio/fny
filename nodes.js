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
Node.prototype.toString = function() {};
Node.prototype.execute = function(context) {};


var Block = function Block(node){
    if (node) this.push(node);
};

Block.prototype.__proto__ = Node.prototype;
Block.prototype.toString = function() {
    if (this.length) {
        return this[0].toString();
    }
    return "";
}
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
Num.prototype.toString = function(context) {
    return this.value + "";
}
Num.prototype.execute = function(context) {
    return parseInt(this.value);
}

var Id = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

Id.prototype.__proto__ = Node.prototype;
Id.prototype.toString = function() {
    return this.value;
}
Id.prototype.execute = function(context) {
    return context.get(this.value);
}

var NString = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

NString.prototype.__proto__ = Node.prototype;
NString.prototype.toString = function() {
    return this.value + "";
}
NString.prototype.execute = function(context) {
    return this.value;
}

var Assign = function(token) {
    this.lineno = token.lineno;
}

Assign.prototype.__proto__ = Node.prototype;
Assign.prototype.toString = function() {
    return this.id.toString() + '=' + this.value.toString();
}
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
Add.prototype.toString = function() {
    return this.left.toString() + "+" + this.right.toString();
}
Add.prototype.execute = function(context) {
    return this.left.execute(context) + this.right.execute(context);
}

var Sub = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Sub.prototype.__proto__ = Node.prototype;
Sub.prototype.toString = function() {
    return this.left.toString() + "-" + this.right.toString();
}
Sub.prototype.execute = function(context) {
    return this.left.execute(context) - this.right.execute(context);
}

var Mult = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Mult.prototype.__proto__ = Node.prototype;
Mult.prototype.toString = function() {
    return this.left.toString() + "*" + this.right.toString();
}
Mult.prototype.execute = function(context) {
    return this.left.execute(context) * this.right.execute(context);
}

var Div = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

Div.prototype.__proto__ = Node.prototype;
Div.prototype.toString = function() {
    return this.left.toString() + "/" + this.right.toString();
}
Div.prototype.execute = function(context) {
    return this.left.execute(context) / this.right.execute(context);
}

var Different = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
Different.prototype.__proto__ = Node.prototype;
Different.prototype.toString = function() {
    return this.left.toString() + " != " + this.right.toString();
}
Different.prototype.execute = function(context) {
    if (this.left.execute(context) != this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var And = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}

And.prototype.__proto__ = Node.prototype;
And.prototype.toString = function() {
    return this.left.toString() + " && " + this.right.toString();
}
And.prototype.execute = function(context) {
    if (this.left.execute(context)) {
        if (this.right.execute(context)) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

var Or = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
Or.prototype.__proto__ = Node.prototype;
Or.prototype.toString = function() {
    return this.left.toString() + " || " + this.right.toString();
}
Or.prototype.execute = function(context) {
    var step1 = this.left.execute(context);
    if (step1) {
        return 1;
    } else if (this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var Equal = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
Equal.prototype.__proto__ = Node.prototype;
Equal.prototype.toString = function() {
    return this.left.toString() + " == " + this.right.toString();
}
Equal.prototype.execute = function(context) {
    if (this.left.execute(context) == this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var LowerThanOrEqual = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
LowerThanOrEqual.prototype.__proto__ = Node.prototype;
LowerThanOrEqual.prototype.toString = function() {
    return this.left.toString() + " <= " + this.right.toString();
}
LowerThanOrEqual.prototype.execute = function(context) {
    if (this.left.execute(context) <= this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var LowerThan = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
LowerThan.prototype.__proto__ = Node.prototype;
LowerThan.prototype.toString = function() {
    return this.left.toString() + " < " + this.right.toString();
}
LowerThan.prototype.execute = function(context) {
    if (this.left.execute(context) < this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var GreaterThanOrEqual = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
GreaterThanOrEqual.prototype.__proto__ = Node.prototype;
GreaterThanOrEqual.prototype.toString = function() {
    return this.left.toString() + " >= " + this.right.toString();
}
GreaterThanOrEqual.prototype.execute = function(context) {
    if (this.left.execute(context) >= this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var GreaterThan = function(token) {
    this.lineno = token.lineno;
    this.left = null;
    this.right = null;
}
GreaterThan.prototype.__proto__ = Node.prototype;
GreaterThan.prototype.toString = function() {
    return this.left.toString() + " > " + this.right.toString();
}
GreaterThan.prototype.execute = function(context) {
    if (this.left.execute(context) > this.right.execute(context)) {
        return 1;
    } else {
        return 0;
    }
}

var CodeBlock = function(token) {
    this.lineno = token.lineno;
    this.values = [];
}

CodeBlock.prototype.__proto__ = Node.prototype;
CodeBlock.prototype.toString = function() {
    var result = [];
    for (var i = 0; i < this.values.length; i++) {
        result.push(this.values[i].toString());
    }
    return result.join("; ");
}
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
IdList.prototype.toString = function() {
    var ids = [];
    for (var i = 0; i < this.values.length; i++) {
        ids.push(this.values[i].value);
    }
    return ids.join(",");
}
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

    if ((args_values && this.arg_list) && (args_values.length > this.arg_list.length)) {
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
    this.value = null;
}

Func.prototype.__proto__ = Node.prototype;
Func.prototype.toString = function() {
    var result = "{";
    if (this.args_declaration) {
        result += this.args_declaration.toString() + ":";
    }
    return result + this.value.toString() + "}";
}
Func.prototype.execute = function(context) {
    var argsValues;
    if (this.args_declaration) {
        argsValues = this.args_declaration.execute(context);
    }
    return new ValueFunc(context.snapshot(), argsValues, this.value);
}

var Call = function(token) {
    this.lineno = token.lineno;
    this.target = null;
    this.args = null;
}

Call.prototype.__proto__ = Node.prototype;
Call.prototype.toString = function() {
    return this.target.toString() + "(" + this.args.toString() + ")";
}
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
ExpList.prototype.toString = function() {
    var resultList = [];

    for (var i = 0; i < this.expressions.length; i++) {
        resultList.push(this.expressions[i].toString());
    }

    return resultList.join(",");
}
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
    Or: Or,
    And: And,
    LowerThanOrEqual: LowerThanOrEqual,
    GreaterThanOrEqual: GreaterThanOrEqual,
    GreaterThan: GreaterThan,
    LowerThan: LowerThan,
    Different: Different,
    Equal: Equal,
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

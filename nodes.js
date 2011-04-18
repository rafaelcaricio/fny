/*!
* Jade - nodes - Node
* Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
* MIT Licensed
*/

var Node = function Node(){};

/**
* Inherit from `Array`.
*/

Node.prototype.__proto__ = Array.prototype;
Node.prototype.execute = function(context) {};


var Block = function Block(node){
    if (node) this.push(node);
};

/**
* Inherit from `Node`.
*/

Block.prototype.__proto__ = Node.prototype;
Block.prototype.execute = function(context) {
    var result;

    if (this.length) {
        result = this[0].execute(context);
    }

    return result;
};


var Num = function(token) {
    this.lineno = token.lineno;
    this.value = token.val;
}

Num.prototype.__proto__ = Node.prototype;
Num.prototype.execute = function(context) {
    return parseInt(this.value);
};


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

module.exports = {
    Block: Block,
    Num: Num,
    Add: Add,
    Sub: Sub,
    Mult: Mult,
    Div: Div
};

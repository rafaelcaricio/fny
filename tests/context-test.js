/**
 * unamed programming language
 * https://github.com/rafaelcaricio/unamed
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2011 Rafael Caricio rafael@caricio.com
 */
var vows = require('vows'),
    assert = require('assert'),
    Context = require('../context');


vows.describe('The Context').addBatch({
    "With the context": {
        topic: function() {
            return new Context();
        },
        "should be defined": function(topic) {
            assert.isNotNull(topic);
        },
        "When I declare 'a'": {
            topic: function(topic) {
                topic.push("a", 1);
                topic.push("b", 3);
                return topic;
            },
            "should be declared": function(topic) {
                assert.equal(topic.get("a"), 1);
            },
            "When I push state": {
                topic: function(topic) {
                    topic.increment();
                    topic.push("a", 2);
                    return topic;
                },
                "The value of a should be modified": function(topic) {
                    assert.equal(topic.get("a"), 2);
                },
                "When I take a snapshot": {
                    topic: function(topic) {
                        return topic.snapshot();
                    },
                    "The value of a should be restored": function(topic) {
                        assert.deepEqual(topic, {"a": 2, "b": 3});
                    },
                    "When I down state": {
                        topic: function(topic, context) {
                            context.pop();
                            return context;
                        },
                        "The value of a should be restored": function(topic) {
                            assert.equal(topic.get("a"), 1);
                        },
                        "When I bind a context": {
                            topic: function(context) {
                                context.increment();
                                context.bind({"c": 4, "d": 5});
                                return context;
                            },
                            "I can get values for the new variables": function(topic) {
                                assert.equal(topic.get("c"), 4);
                            },
                            "When I down a context": {
                                topic: function(context) {
                                    context.pop();
                                    return context;
                                },
                                "I can't get values from the older context": function(topic) {
                                    assert.isUndefined(topic.get("c"));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}).export(module);

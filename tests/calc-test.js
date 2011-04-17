var vows = require('vows'),
    assert = require('assert'),
    calc = require('../calc').calculate;

vows.describe('A simple calculator').addBatch({
    'when 1': {
        topic: function() { return calc('1'); },
        
        'we got the 1 by result': function(topic) {
            assert.equal(topic, 1);
        }
    }
});

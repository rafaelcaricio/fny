var Parser = require('./parser');

module.exports = {
    calculate: function(input) {
        var parser = new Parser(input);
        return parser.execute({});
    }
}

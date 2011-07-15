var Parser = require('./parser');


module.exports = {
    calculate: function(input) {
        var parser = new Parser(input);
        return parser.execute({});
    }
}

process.stdout.write("calc > ");
process.stdin.resume();

process.stdin.on('data', function (input) {
    var parser = new Parser(new String(input));
    process.stdout.write(parser.parse().execute() + '\n');
    process.stdout.write("calc > ");
});

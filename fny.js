var fs = require('fs'),
    path = require('path'),
    Parser = require('./parser'),
    Context = require('./context'),
    VERSION = '0.0.1';

function main() {
    console.log('fny [' + VERSION + ']');
    if (process.argv.length >= 2) {
        var filePath = path.resolve(process.cwd(), process.argv[2]);
        fs.readFile(filePath, 'utf-8', function(err, contents) {
            if (err) {
                console.log('[ERROR] An error!' + err);
                process.exit(1);
            }
            console.log('running: ' + filePath);
            console.log('--------------------------------------------------------');

            var parser = new Parser(contents),
                program = parser.parse();

            process.stdout.write('<- ');
            console.log(program.execute(new Context()));
        });
    } else {
        console.log('[NOTE] You need to tell me what file you want to run.');
    }
}

main();

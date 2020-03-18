/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * ref: https://stackoverflow.com/a/12646864/387194
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function rand() {
    shuffle(chars);
    shuffle(colors);
}
var chars = ['#', '+', '*', '#', '@', '%'];
var colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
function parse_value(arg) {
    var {value, ...rest} = arg;
    value = +value;
    return {value, ...rest};
}
function parse_data(arg, i, is_double) {
    let [key, value, style] = arg.split(':');
    if (!style) {
        style = chars[i];
    }
    if (style.length === 1) {
        if (is_double) {
            style = style + ' ';
        }
    } else {
        style = ervy.bg(style, is_double ? 2 : 1);
    }
    return {key, value, style};
}
function chart(name, args) {
    rand();
    var is_double = ['pie', 'donut'].includes(name);
    const data = args.map((x, i) => {
        return parse_value(parse_data(x, i, is_double));
    });
    console.log(ervy[name](data));
    term.echo(ervy[name](data));
}
var charts = ['bar', 'pie', 'bullet', 'donut'];

var charts_commands = charts.map(x => `[[b;#fff;]${x}]`).join(', ');

const commands = {
    help: function() {
        this.echo(`avaiable chars: ${charts_commands}, [[b;#fff;]gauge] and [[b;#fff;]scatter]`);
        this.echo([
            '',
            'usage:\n' +
            '\t<chart name> A:10:red B:20:blue C:30:green',
            '\t<chart name> A:10:+ B:20:0 C:30:#',
            '',
            '\tgauge Foo:.2:green',
            '\tgauge Foo:.2:green -b red',
            '\tgauge Foo:.2:+ -b *',
            '\tgauge Foo:.2',
            '',
            'Single data point is <label>:<value>:<style> where style can be color like [[u;;]blue] or single character',
            'If there is no style it will be random character',
            '',
            '\tscatter Foo:1,1;2,2;3,3;4,4;5,5;6,5;7,5;8,5:red Bar:1,2;2,3;3,4;4,5;5,6;6,6;7,6;8,6:blue',
            '',
            'the data look like this <label>:<point>;<point>;<point>;...:<style>',
            'where <point> is pair for numbers x,y',
            ''
        ].join('\n'));
        this.echo('additional commands: [[b;#fff;]credits], [[b;#fff;]demo], [[b;#fff;]size] and [[b;#fff;]help] ');
    },
    gauge: function(...args) {
        console.log(args);
        rand();
        var {_: [data], ...options} = $.terminal.parse_options(args);
        var {style, ...data} = parse_value(parse_data(data, 0, true));
        var bgStyle;
        if (options.b) {
            if (options.b.length === 1) {
                bgStyle = options.b + ' ';
            } else {
                bgStyle = ervy.bg(options.b, 2);
            }
        } else {
            bgStyle = chars[chars.length - 1] + ' ';
        }
        this.echo(ervy.gauge([data], { radius: options.r || 7, style, bgStyle}));
    },
    scatter: function(...args) {
        rand();
        var {_: args, ...options} = $.terminal.parse_options(args);
        var data = args.map((x, i) => {
            var [key, value, style] = x.split(':');
            if (style) {
                if (style.length === 1) {
                    style = ervy.fg(colors[i], style);
                } else {
                    style = ervy.bg(style, 2);
                }
            } else {
                style = chars[i];
            }
            return value.split(';').map(x => {
                return {key, value: x.split(',').map(x => +x), style};
            });
        });
        data = [].concat.apply([], data);
        var plot = ervy.scatter(data, {width: options.width || 15, legendGap: options['legend-gap'] || 18});
        //console.log(plot.replace(/\x1b/g, '0x1b'));
        this.echo(plot);
    },
    demo: function() {
        this.exec(charts.map(name => `${name} A:10:green B:20:yellow C:30:red d:10:blue`).concat([
            'gauge Foo:.2:green -b red',
            'scatter Foo:1,1;2,2;3,3;4,4;5,5;6,5;7,5;8,5:green Bar:1,2;2,3;3,4;4,5;5,6;6,6;7,6;8,6:yellow Baz:12,8;13,8;12,7;13,7:red Quux:12,4;14,4:blue'
        ]));
    },
    size: function(x) {
        if (typeof x === 'number') {
            this.css('--size', x);
        } else {
            this.echo([
                'usage: ',
                '\t[[b;#fff;]size] <NUMBER>',
                '',
                'arg - number can be float value. 1 (one) is default size, 2 is double size'
            ].join('\n'));
        }
    },
    credits: function() {
        this.echo(this.signature);
    }
};

charts.forEach(name => {
    commands[name] = (...args) => { chart(name, args); };
});

var term = $('#term').terminal(commands, {
    name: 'charts',
    height: 500,
    completion: true,
    checkArity: false,
    greetings: `
___________
\\_   _____/_________  _____.__.
 |    __)_\\_  __ \\  \\/ <   |  |
 |        \\|  | \\/\\   / \\___  |
/_______  /|__|    \\_/  / ____|
        \\/              \\/
Copyright (c) ${new Date().getFullYear()} [[!;;;;https://github.com/chunqiuyiyu]春秋一语]

type [[b;#fff;]help] to get started
`.trim()
});

// version from 2.15.0
$.terminal.parse_options = function parse_options(arg, options) {
    var settings = $.extend({}, {
        boolean: []
    }, options);
    if (typeof arg === 'string') {
        return parse_options($.terminal.split_arguments(arg), options);
    }
    var result = {
        _: []
    };
    function token(value) {
        this.value = value;
    }
    var rest = arg.reduce(function(acc, arg) {
        var str = typeof arg === 'string' ? arg : '';
        if (str.match(/^--?[^-]/) && acc instanceof token) {
            result[acc.value] = true;
        }
        if (str.match(/^--[^-]/)) {
            var name = str.replace(/^--/, '');
            if (settings.boolean.indexOf(name) === -1) {
                return new token(name);
            } else {
                result[name] = true;
            }
        } else if (str.match(/^-[^-]/)) {
            var single = str.replace(/^-/, '').split('');
            if (settings.boolean.indexOf(single.slice(-1)[0]) === -1) {
                var last = single.pop();
            }
            single.forEach(function(single) {
                result[single] = true;
            });
            if (last) {
                return new token(last);
            }
        } else if (acc instanceof token) {
            result[acc.value] = arg;
        } else if (arg) {
            result._.push(arg);
        }
        return null;
    }, null);
    if (rest instanceof token) {
        result[rest.value] = true;
    }
    return result;
};

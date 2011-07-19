[UNAMED]
========

A toy programming language implemented on top of Node.js.

The inspiration comes from Python, Lua and C programming languages.

Example of a simple hello word:

```python
    print("Hello world!")
```

A more elaborated example of use:

```python
    if = { op, _true, _false:
        op && _true() || _false()
    };

    for = { number, block, end:
        this = self;
        if ( number > 0 , {
            this(number - 1, block, end) + block(number - 1);
        }, end() );
    };

    fib = { n:
        fib = self;
        if ( n == 1, { 
            1
        },
        if ( n == 0, { 
            0
        }, { 
            fib(n - 1) + fib(n - 2)
        }));
    };

    for ( 10, { i:
        print(fib(i));
    }, { "" });
```

PS.: Examples currently not work. I'm implementing the language.

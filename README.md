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
    fib = { n:
        if ( n == 1, { 1 },
            if ( n == 0, { 0 }, { self(n - 1) + self(n - 2) }));
    };

    for ( 10, { i:
        print(fib(i));
    });
```

PS.: Examples currently not work. I'm implementing the language.

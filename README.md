[UNAMED]
========

A toy programming language implemented on top of Node.js.

The inspiration comes from Python, Lua and C programming languages.

Example of a simple hello word:

```python
    print "Hello world!"
```

A more elaborated example of use:

```python
    fib = { n:
        if { n: 1 }
        if { !n:  0}
        else fib(n - 1) + fib(n - 2)
    }

    for { i in 10:
        print fib(i)
    }
```

PS.: All examples currently not work. I'm implementing the language.

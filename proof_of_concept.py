#!/usr/bin/env python

def _for(number, block, end):
    return number > 0 and _for(number - 1, block, end) + block(number - 1) or end()

print _for(10, lambda i: [i], lambda: [])

_map = lambda array, func, end: _for(len(array), lambda i: func(array[i]), end and end or (lambda: []))

print _map(["so", "nice", "thing"], lambda s: s + " ", lambda: "")

join = lambda array, t: _map(array, lambda s: s + t, lambda: "")

print join(["so", "nice", "thing"], " ")

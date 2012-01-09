
if = { op, _true, _false:
    op && _true() || _false()
};

if(1 == 1, {
    69
}, {
    7
});



if = { op, _true, _false:
        op && _true() || _false()
    };

if(1 == 1, {
        print("foi true");
    }, {
        print("foi false");
    });


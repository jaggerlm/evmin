(function(module){

    var SymbolicStringExpression = module.dps.SymbolicStringExpression;
    var SymbolicBool = module.dps.SymbolicBool;
    function SymbolicStringPredicate(op, left, right) {
        if (!(this instanceof SymbolicStringPredicate)) {
            return new SymbolicStringPredicate(op, left, right);
        }

        if (op instanceof SymbolicStringPredicate) {
            this.left = op.left;
            this.right = op.right;
            this.op = op.op;
        } else {
            if (!(left instanceof SymbolicStringExpression ||
                typeof left === 'string'))
                left = ""+left;
            this.left = left;
            if (!(right instanceof SymbolicStringExpression ||
                right instanceof RegExp ||
                typeof right === 'string'))
                right = ""+right;
            this.right = right;
            switch(op) {
                case "==":
                    this.op = SymbolicStringPredicate.EQ;
                    break;
                case "!=":
                    this.op = SymbolicStringPredicate.NE;
                    break;
                case "regexin":
                    this.op = SymbolicStringPredicate.IN;
                    break;
                case "regexnotin":
                    this.op = SymbolicStringPredicate.NOTIN;
                    break;

            }
        }
    }

    SymbolicStringPredicate.EQ = 0;
    SymbolicStringPredicate.NE = 1;
    SymbolicStringPredicate.IN = 2;
    SymbolicStringPredicate.NOTIN = 3;

    SymbolicStringPredicate.prototype = {
        constructor: SymbolicStringPredicate,

        not: function() {
            var ret = new SymbolicStringPredicate(this);
            switch(this.op) {
                case SymbolicStringPredicate.EQ:
                    ret.op = SymbolicStringPredicate.NE;
                    break;
                case SymbolicStringPredicate.NE:
                    ret.op = SymbolicStringPredicate.EQ;
                    break;
                case SymbolicStringPredicate.IN:
                    ret.op = SymbolicStringPredicate.NOTIN;
                    break;
                case SymbolicStringPredicate.NOTIN:
                    ret.op = SymbolicStringPredicate.IN;
                    break;
            }
            return ret;
        },
        toString: function() {
            switch(this.op) {
                case SymbolicStringPredicate.EQ:
                    return this.left+" == " + this.right;
                case SymbolicStringPredicate.NE:
                    return this.left+" != " + this.right;
                case SymbolicStringPredicate.IN:
                    return this.left+" regexin " + this.right;
                case SymbolicStringPredicate.NOTIN:
                    return this.left+" regexnotin " + this.right;
            }
        },

        type: module.dps.symbolic
    };

    module.dps.SymbolicStringPredicate = SymbolicStringPredicate;
}(R$));

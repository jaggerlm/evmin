(function(module){
    var SymbolicStringPredicate = module.dps.SymbolicStringPredicate;
    var SymbolicLinear = module.SymbolicLinear;
    var SymbolicBool = module.SymbolicBool;

    function ToStringPredicate(intPart, stringPart) {
        if (!(this instanceof ToStringPredicate)) {
            return new ToStringPredicate(intPart, stringPart);
        }

        if (intPart instanceof ToStringPredicate) {
            this.intPart = intPart.intPart;
            this.stringPart = intPart.stringPart;
        } else {
            this.intPart = intPart;
            this.stringPart = stringPart;
        }
    }

    ToStringPredicate.prototype = {
        constructor: ToStringPredicate,

        not: function() {
            throw new Error("Not of ToStringPredicate is illegal");
        },
        toString: function() {
            return this.stringPart + " = toString("+this.intPart+")";
        },

        type: module.dps.symbolic
    };

    module.dps.ToStringPredicate = ToStringPredicate;
}(R$));

(function(module){
    var SymbolicStringPredicate = module.dps.SymbolicStringPredicate;
    var SymbolicLinear = module.dps.SymbolicLinear;
    var SymbolicBool = module.dps.SymbolicBool;

    function FromCharCodePredicate(intParts, stringPart) {
        if (!(this instanceof FromCharCodePredicate)) {
            return new FromCharCodePredicate(intParts, stringPart);
        }

        if (intParts instanceof FromCharCodePredicate) {
            this.intParts = intParts.intParts;
            this.stringPart = intParts.stringPart;
        } else {
            this.intParts = intParts;
            this.stringPart = stringPart;
        }
    }

    FromCharCodePredicate.prototype = {
        constructor: FromCharCodePredicate,

        not: function() {
            throw new Error("Not of FromCharCodePredicate is illegal");
        },
        toString: function() {
            return "("+this.stringPart + ") = String.fromCharCode("+this.intParts+")";
        },

        type: module.dps.symbolic
    };

    module.dps.FromCharCodePredicate = FromCharCodePredicate;
}(R$));

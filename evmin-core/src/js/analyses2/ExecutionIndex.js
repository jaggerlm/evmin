(function(module) {
    function ExecutionIndex() {
        var counters = {};
        var countersStack = [counters];

        function executionIndexCall() {
            counters = {};
            countersStack.push(counters);
        }

        function executionIndexReturn() {
            countersStack.pop();
            counters = countersStack[countersStack.length - 1];
        }

        function executionIndexInc(iid) {
            var c = counters[iid];
            if (c === undefined) {
                c = 1;
            } else {
                c++;
            }
            counters[iid] = c;
            counters.iid = iid;
            counters.count = c;
        }

        function executionIndexGetIndex() {
            var i, ret = [];
            var iid;
            for (i = countersStack.length - 1; i >= 0; i--) {
                iid = countersStack[i].iid;
                if (iid !== undefined) {
                    ret.push(iid);
                    ret.push(countersStack[i].count);
                }
            }
            return (ret + "").replace(/,/g, "_");
        }

        if (this instanceof ExecutionIndex) {
            this.executionIndexCall = executionIndexCall;
            this.executionIndexReturn = executionIndexReturn;
            this.executionIndexInc = executionIndexInc;
            this.executionIndexGetIndex = executionIndexGetIndex;
        } else {
            return new ExecutionIndex();
        }
    }

    module.dps.ExecutionIndex = ExecutionIndex;
}(R$));
//-------------------------------- End Execution indexing --------------------------------


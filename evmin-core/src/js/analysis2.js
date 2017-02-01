if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
           //-------------------------------------- Symbolic functions -------------------------------------

            function create_fun(f,argsCallBack) {
                return function () {
                    var len = arguments.length;
                    for (var i = 0; i < len; i++) {
                        arguments[i] = getConcrete(arguments[i]);
                    }
					if(typeof argsCallBack === 'function')
						arguments = argsCallBack(argsCallBack);
                    return f.apply(getConcrete(this), arguments);
                }
            }

            function concretize(obj) {
                for (var key in obj) {
                    if (HOP(obj, key)) {
                        obj[key] = getConcrete(obj[key]);
                    }
                }
            }

            function modelDefineProperty(f) {
                return function () {
                    var len = arguments.length;
                    for (var i = 0; i < len; i++) {
                        arguments[i] = getConcrete(arguments[i]);
                    }
                    if (len === 3) {
                        concretize(arguments[2]);
                    }
                    return f.apply(getConcrete(this), arguments);
                }
            }

            function getSymbolicFunctionToInvokeAndLog(f, isConstructor) {
                if (f === Array ||
                    f === Error ||
                    f === String ||
                    f === Number ||
                    f === Date ||
                    f === Boolean ||
                    f === RegExp ||
                    f === sandbox.addAxiom ||
                    f === sandbox.readInput) {
                    return [f, true];
                } else if (//f === Function.prototype.apply ||
                //f === Function.prototype.call ||
                    f === console.log ||
                        (typeof getConcrete(arguments[0]) === 'string' && f === RegExp.prototype.test) || // fixes bug in minPathDev.js
                        f === String.prototype.indexOf ||
                        f === String.prototype.lastIndexOf ||
                        f === String.prototype.substring ||
                        f === String.prototype.substr ||
                        f === String.prototype.charCodeAt ||
                        f === String.prototype.charAt ||
                        f === String.prototype.replace ||
                        f === String.fromCharCode ||
                        f === Math.abs ||
                        f === Math.acos ||
                        f === Math.asin ||
                        f === Math.atan ||
                        f === Math.atan2 ||
                        f === Math.ceil ||
                        f === Math.cos ||
                        f === Math.exp ||
                        f === Math.floor ||
                        f === Math.log ||
                        f === Math.max ||
                        f === Math.min ||
                        f === Math.pow ||
                        f === Math.round ||
                        f === Math.sin ||
                        f === Math.sqrt ||
                        f === Math.tan ||
                        f === parseInt) {
                    return  [create_fun(f), false];
                } else if (f === Object.defineProperty) {
                    return [modelDefineProperty(f), false];
                } else if (f === JSON.stringify){
					return [create_fun(f,function(args){
						args[args.length++] = function(k,v){
							if(sandbox.isAnotated(v)){
								return getConcrete(v);
							}
							return v;
						}
					}), false];
				}
                return [null, true];
            }


            //---------------------------- Utility functions -------------------------------
            function addAxiom(c) {
                if (sandbox.analysis) {
                    sandbox.analysis.invoke('installAxiom',c);
                }
            }

            //---------------------------- End utility functions -------------------------------
    //----------------------------------- Begin Jalangi Library backend ---------------------------------

    // stack of return values from instrumented functions.
    // we need to keep a stack since a function may return and then
    // have another function call in a finally block (see test
    // call_in_finally.js)

    var returnStack = [];
    var exceptionVal;
    var lastVal;
    var switchLeft;
    var switchKeyStack = [];
    var argIndex;
    var EVAL_ORG = eval;

	var logger = R$.common.util.logger;
    var dps = R$.dps;

	function isNative(f) {
        if(typeof f === 'function')	
			return f.toString().indexOf('[native code]') > -1 || f.toString().indexOf('[object ') === 0;
    }

    function callAsNativeConstructorWithEval(Constructor, args) {
        var a = [];
        for (var i = 0; i < args.length; i++)
            a[i] = 'args[' + i + ']';
        var eval = EVAL_ORG;
        return eval('new Constructor(' + a.join() + ')');
    }

    function callAsNativeConstructor(Constructor, args) {
        /*
		if (args.length === 0) {
            return new Constructor();
        }
        if (args.length === 1) {
            return new Constructor(args[0]);
        }
        if (args.length === 2) {
            return new Constructor(args[0], args[1]);
        }
        if (args.length === 3) {
            return new Constructor(args[0], args[1], args[2]);
        }
        if (args.length === 4) {
            return new Constructor(args[0], args[1], args[2], args[3]);
        }
        if (args.length === 5) {
            return new Constructor(args[0], args[1], args[2], args[3], args[4]);
        }*/
        return callAsNativeConstructorWithEval(Constructor, args);
    }

    function callAsConstructor(Constructor, args) {
        var ret;
        if (true) {
            ret = callAsNativeConstructor(Constructor, args);
            return ret;
        } else {
            var Temp = function () {}, inst;
            Temp.prototype = sandbox.getConcrete(Constructor.prototype);
            inst = new Temp;
            ret = Constructor.apply(inst, args);
            return Object(ret) === ret ? ret : inst;
        }
    }

    function invokeEval(base, f, args) {
                return f(sandbox.instrumentCode(sandbox.getConcrete(args[0]), {wrapProgram:false, isEval:true}).code);
    }
    function callFun(f, base, args, isConstructor,iid) {
		if(!f)
			return;
		var result;
        pushSwitchKey();
		try {
			if(typeof f === 'function' && isNative(f)) {
				base = getConcrete(base);
				var xargs = [];
				for (var i = 0; i < args.length; i++) {
					xargs.push(getConcrete(args[i]));
				}
				args = xargs;
				if(f === JSON.stringify){
					args.push(function(k,v){
						if(sandbox.isAnotated(v))
							return getConcrete(v);
						return v;
					});
				}
			}
			if (f === EVAL_ORG) {
                return  invokeEval(base, f, args);
            }
			if (isConstructor) {
				return callAsConstructor(f, args);
            } else {
				result = Function.prototype.apply.call(f, base, args);
				return result;
            }
        } finally {
            popSwitchKey();
        }
    }

    function invokeFun(iid, base, f, args, isConstructor, isMethod) {
        var aret, skip = false, result, data;
	  	if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('invokeFunPre',iid, f, base, args, isConstructor, isMethod);
            if (aret) {
                f = aret.f;
                base = aret.base;
                skip = aret.skip;
				data = aret.data;
            }
        }
		if (!skip) {
            f_c = sandbox.getConcrete(f);
	    //var arr = getSymbolicFunctionToInvokeAndLog(f_c, isConstructor);
	    //var g = arr[0] || f_c
	    result = callFun(f_c, base, args, isConstructor,iid);
        }
        if (sandbox.analysis && f) {
			aret = sandbox.analysis.invoke('invokeFun',iid, f, base, args, result, isConstructor, isMethod, data);
            if (aret) {
                result = aret.result;
            }
        }
        return result;
    }

    // Function call (e.g., f())
    function F(iid, f, isConstructor) {
        return function () {
            var base = this;
            return invokeFun(iid, base, f, arguments, isConstructor, false);
        }
    }

    // Method call (e.g., e.f())
    function M(iid, base, offset, isConstructor) {
        return function () {
			var f = G(iid + 2, base, offset);
            return invokeFun(iid, base, f, arguments, isConstructor, true);
        };
    }

    // Ignore argument (identity).
    function I(val) {
        return val;
    }

    // object/function/regexp/array Literal
    function T(iid, val, type, hasGetterSetter) {
        var aret;
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('literal',iid, val, hasGetterSetter);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    function H(iid, val) {
        var aret;
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('forinObject',iid, val);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // variable read
    // variable declaration (Init)
    function N(iid, name, val, isArgument, isLocalSync) {
        // isLocalSync is only true when we sync variables inside a for-in loop
        var aret;

        if (isArgument) {
            argIndex++;
        }
        if (!isLocalSync && sandbox.analysis) {
            if (isArgument && argIndex > 1) {
                aret = sandbox.analysis.invoke('declare',iid, name, val, isArgument, argIndex - 2);
            } else {
                aret = sandbox.analysis.invoke('declare',iid, name, val, isArgument, -1);
            }
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // getField (property read)
    function G(iid, base, offset) {
        var aret, skip = false, val;

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('getFieldPre',iid, base, offset);
            if (aret) {
                base = aret.base;
                offset = aret.offset;
                skip = aret.skip;
            }
        }

        if (!skip) {
			try{
			val  = sandbox.getConcrete(base)[sandbox.getConcrete(offset)];
			}catch(e){
				//debugger;
				console.debug(e);
			}
        }
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('getField',iid, base, offset, val);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // putField (property write)
    function P(iid, base, offset, val) {
        var aret, skip = false, data;

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('putFieldPre',iid, base, offset, val);
            if (aret) {
                base = aret.base;
                offset = aret.offset;
                val = aret.val;
                skip = aret.skip;
				data = aret.data;
            }
        }

        if (!skip) { 
			sandbox.getConcrete(base)[sandbox.getConcrete(offset)] = val;
        }
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('putField',iid, base, offset, val, data);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // variable write
    // isGlobal means that the variable is global and not declared as var
    // isPseudoGlobal means that the variable is global and is declared as var
    function R(iid, name, val, isGlobal, isPseudoGlobal) {
        var aret;

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('read',iid, name, val, isGlobal, isPseudoGlobal);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // variable write
    function W(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
        var aret;
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('write',iid, name, val, lhs, isGlobal, isPseudoGlobal);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // Uncaught exception
    function Ex(iid, e) {
        exceptionVal = e;
    }

    // Return statement
    function Rt(iid, val) {
        returnStack.pop();
        returnStack.push(val);
        return val;
    }

    // Actual return from function, invoked from 'finally' block
    // added around every function by instrumentation.  Reads
    // the return value stored by call to Rt()
    function Ra() {
        var returnVal = returnStack.pop();
        exceptionVal = undefined;
        return returnVal;
    }

    // Function enter
    function Fe(iid, f, dis /* this */, args) {
        argIndex = 0;
        returnStack.push(undefined);
        exceptionVal = undefined;
        if (sandbox.analysis) {
            sandbox.analysis.invoke('functionEnter',iid, f, dis, args);
        }
    }

    // Function exit
    function Fr(iid) {
        var isBacktrack = false, tmp, aret, returnVal;

        returnVal = returnStack.pop();
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('functionExit',iid, returnVal, exceptionVal);
            if (aret) {
                returnVal = aret.returnVal;
                exceptionVal = aret.exceptionVal;
                isBacktrack = aret.isBacktrack;
            }
        }
        if (!isBacktrack) {
            returnStack.push(returnVal);
        }
        // if there was an uncaught exception, throw it
        // here, to preserve exceptional control flow
        if (exceptionVal !== undefined) {
            tmp = exceptionVal;
            exceptionVal = undefined;
            throw tmp;
        }
        return isBacktrack;
    }

    // Script enter
    function Se(iid, val) {
        if (sandbox.analysis) {
            sandbox.analysis.invoke('scriptEnter',iid, val);
        }
    }

    // Script exit
    function Sr(iid) {
        var tmp, aret, isBacktrack;
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('scriptExit',iid, exceptionVal);
            if (aret) {
                exceptionVal = aret.exceptionVal;
                isBacktrack = aret.isBacktrack;
            }
        }
        if (exceptionVal !== undefined) {
            tmp = exceptionVal;
            exceptionVal = undefined;
            throw tmp;
        }
        return isBacktrack;
    }


    // Modify and assign +=, -= ...
    function A(iid, base, offset, op) {
        var oprnd1 = G(iid, base, offset);
        return function (oprnd2) {
            var val = B(iid, op, oprnd1, oprnd2);
            return P(iid, base, offset, val);
        };
    }

    // Binary operation
    function B(iid, op, left, right) {
        var result, aret, skip = false;

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('binaryPre',iid, op, left, right);
            if (aret) {
                op = aret.op;
               	left = aret.left;
                right = aret.right;
                skip = aret.skip;
            }
        }

        if (!skip) {
			var c_left = sandbox.getConcrete(left);
			var c_right = sandbox.getConcrete(right);
		   switch (op) {
                case "+":
                    result = c_left + c_right;
                    break;
                case "-":
                    result = c_left - c_right;
                    break;
                case "*":
                    result = c_left * c_right;
                    break;
                case "/":
                    result = c_left / c_right;
                    break;
                case "%":
                    result = c_left % c_right;
                    break;
                case "<<":
                    result = c_left << c_right;
                    break;
                case ">>":
                    result = c_left >> c_right;
                    break;
                case ">>>":
                    result = c_left >>> c_right;
                    break;
                case "<":
                    result = c_left < c_right;
                    break;
                case ">":
                    result = c_left > c_right;
                    break;
                case "<=":
                    result = c_left <= c_right;
                    break;
                case ">=":
                    result = c_left >= c_right;
                    break;
                case "==":
                    result = c_left == c_right;
                    break;
                case "!=":
                    result = c_left != c_right;
                    break;
                case "===":
                    result = c_left === c_right;
                    break;
                case "!==":
                    result = c_left !== c_right;
                    break;
                case "&":
                    result = c_left & c_right;
                    break;
                case "|":
                    result = c_left | c_right;
                    break;
                case "^":
                    result = c_left ^ c_right;
                    break;
                case "delete":
                    result = delete c_left[c_right];
                    break;
                case "instanceof":
                    result = c_left instanceof c_right;
                    break;
                case "in":
                    result = c_left in c_right;
                    break;
				case "&&":
                    result = c_left && c_right;
                    break;
                case "||":
                    result = c_left || c_right;
                    break;
                case "regexin":
                    result = c_left.test(c_right);
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }
        }

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('binary', iid, op, left, right, result);
            if (aret) {
                result = aret.result;
            }
        }
        return result;
    }


    // Unary operation
    function U(iid, op, left) {
        var result, aret, skip = false;

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('unaryPre', iid, op, left);
            if (aret) {
                op = aret.op;
                left = aret.left;
                skip = aret.skip
            }
        }
		var c_left = sandbox.getConcrete(left); 
        if (!skip) {
			switch (op) {
                case "+":
                    result = + c_left;
                    break;
                case "-":
                    result = - c_left;
                    break;
                case "~":
                    result = ~ c_left;
                    break;
                case "!":
                    result = !c_left;
                    break;
                case "typeof":
                    result = typeof c_left;
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }
        }

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('unary', iid, op, left, result);
            if (aret) {
                result = aret.result;
            }
        }
        return result;
    }

    function pushSwitchKey() {
        switchKeyStack.push(switchLeft);
    }

    function popSwitchKey() {
        switchLeft = switchKeyStack.pop();
    }

    function last() {
        return lastVal;
    }

    // Switch key
    // E.g., for 'switch (x) { ... }',
    // C1 is invoked with value of x
    function C1(iid, left) {
        switchLeft = left;
        return sandbox.getConcrete(left);
    }

    // case label inside switch
    function C2(iid, left) {
        var aret, result;

        result = B(iid, "===", switchLeft, left);

        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('conditional',iid, result);
            if (aret) {
                if (result && !aret.result) {
                    left = !left;
                }
            }
        }
	return sandbox.getConcrete(left);
    }

    // Expression in conditional
    function C(iid, left) {
        var aret;
        if (sandbox.analysis) {
            aret = sandbox.analysis.invoke('conditional',iid, left);
            if (aret) {
                left = aret.result;
            }
        }
		left = sandbox.getConcrete(left);
        lastVal = left;
        return left;
    }
	
	function Ce(iid, testIid){
		if(sandbox.analysis){
			sandbox.analysis.invoke('conditionalBlockEnter',iid, testIid);
		}
	}
	
	function Cr(iid, testIid){
		if(sandbox.analysis){
			sandbox.analysis.invoke('conditionalBlockExit',iid,testIid);
		}
	}
    
	function endExecution() {
        if (sandbox.analysis) {
            return sandbox.analysis.invoke('endExecution');
        }
    }
	
	if(typeof window === 'object'){
		window.addEventListener('keydown',function(e){
			if (e.altKey && e.shiftKey && e.keyCode === 84){
				endExecution();
			}
		});
	}

    //----------------------------------- End Jalangi Library backend ---------------------------------

    sandbox.U = U; // Unary operation
    sandbox.B = B; // Binary operation
    sandbox.C = C; // Condition
    sandbox.C1 = C1; // Switch key
    sandbox.C2 = C2; // case label C1 === C2
    sandbox.addAxiom = addAxiom; // Add axiom
    sandbox._ = last;  // Last value passed to C

    sandbox.H = H; // hash in for-in
    sandbox.I = I; // Ignore argument
    sandbox.G = G; // getField
    sandbox.P = P; // putField
    sandbox.R = R; // Read
    sandbox.W = W; // Write
    sandbox.N = N; // Init
    sandbox.T = T; // object/function/regexp/array Literal
    sandbox.F = F; // Function call
    sandbox.M = M; // Method call
    sandbox.A = A; // Modify and assign +=, -= ...
    sandbox.Fe = Fe; // Function enter
    sandbox.Fr = Fr; // Function return
    sandbox.Se = Se; // Script enter
    sandbox.Sr = Sr; // Script return
    sandbox.Rt = Rt; // returned value
    sandbox.Ra = Ra;
    sandbox.Ex = Ex;
	sandbox.Ce = Ce;
	sandbox.Cr = Cr;
	sandbox.endExecution = endExecution;
	sandbox.isAnotated = dps.AnotatedValue.isAnotated;
    sandbox.getConcrete = dps.AnotatedValue.getConcrete;
	sandbox.isNative= isNative;
    // TODO why is this exposed here? --MS
    sandbox.callFunction = callFun;
    sandbox.EVAL_ORG = EVAL_ORG;
})(J$);


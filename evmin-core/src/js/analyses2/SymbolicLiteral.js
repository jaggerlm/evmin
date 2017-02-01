
(function(module){
	function SymbolicLiteral(value){
		this.value = value;
	}

	SymbolicLiteral.prototype.toString = function(){
		if(this.value === undefined || this.value === null
			typeof this.value ==='number' || typeof this.value === 'boolean'){
			return this.value;
		}else if(typeof this.value === 'object'){
			return "new Object()";
		}else if(typeof this.value === 'string'){
			return "'"+this.value+"'";
		}
	}

    module.dps.SymbolicLiteral = SymbolicLiteral;
}(R$));

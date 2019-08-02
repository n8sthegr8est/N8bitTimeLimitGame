function flag(flagged){
	this.flagged = flagged;
	
	this.flag = () => {
		this.flagged = true;
	}
	
	this.unflag = () => {
		this.flagged = false;
	}
	
	this.check = () => {
		return this.flagged;
	}
}

function flagBank() {
	this.instantiateFlag = (flagName,flagged) => {
		this[flagName] = new flag(flagged);
	}
	
	this.checkFlag = (flagName) => {
		if(this[flagName]==undefined){
			throw "FLAG ERROR! Requested check on non-existent flag by name \"" + flagName + "\"!";
		}
		else{
			return this[flagName].check();
		}
	}
	
	this.setFlag = (flagName,flagged) => {
		if(this[flagName]==undefined){
			throw "FLAG ERROR! Requested set on non-existent flag by name \"" + flagName + "\"!";
		}
		else{
			if(flagged){
				this[flagName].flag();
			}
			else{
				this[flagName].unflag();
			}
		}
	}
}
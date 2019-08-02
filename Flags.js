function flag(flagged){// a global or local scope true or false value used to determine the current game state
	this.flagged = flagged;//the true or false value
	
	this.flag = () => {//sets the flag to true
		this.flagged = true;
	}
	
	this.unflag = () => {//sets the flag to false
		this.flagged = false;
	}
	
	this.check = () => {//gets the current flag value
		return this.flagged;
	}
}

function flagBank() {// a global or local set of flags.
	this.instantiateFlag = (flagName,flagged) => {//creates a new flag in the bank
		this[flagName] = new flag(flagged);
	}
	
	this.checkFlag = (flagName) => {//checks the value of a given flag
		if(this[flagName]==undefined){
			throw "FLAG ERROR! Requested check on non-existent flag by name \"" + flagName + "\"!";//if the flag doesn't exist, throw an error
		}
		else{
			return this[flagName].check();//otherwise, return its value
		}
	}
	
	this.setFlag = (flagName,flagged) => {//sets the value of a given flag
		if(this[flagName]==undefined){
			throw "FLAG ERROR! Requested set on non-existent flag by name \"" + flagName + "\"!";//if the flag doesn't exist, throw an error
		}
		else{
			//otherwise, set the flag
			if(flagged){
				this[flagName].flag();
			}
			else{
				this[flagName].unflag();
			}
		}
	}
}
function TimeStorage(Time_Limit){//,Hour_Of_Game_Start,Minute_Of_Game_Start,Day_Half_Of_Game_Start){
	this.Time_Limit = Time_Limit;
	//this.currentHour = Hour_Of_Game_Start;
	//this.currentMinute = Minute_Of_Game_Start;
	//this.currentDayHalf = Day_Half_Of_Game_Start;
	this.timeElapsed = 0;
	
	this.roomTransferAdder = () => {
		this.elapseTimeByEvent(Room_Transfer_Penalty);
	}
	
	this.elapseTimeByEvent = (timeToElapse) => {//timeToElapse is in minutes
		this.timeElapsed += timeToElapse;
		if(this.timeElapsed>=this.Time_Limit){//may remove if statement later
			global.setFlag("timeIsUp",true);
		}
	}
	
	this.getCurrentTimeAsHumanReadable = () => {
		var currentHour = Hour_Of_Game_Start;
		var currentMinute = Minute_Of_Game_Start;
		var currentDayHalf = Day_Half_Of_Game_Start;
		currentMinute += this.timeElapsed;
		for(;currentMinute>=60;){
			currentHour += 1;
			currentMinute -= 60;
		}
		for(;currentHour > 12;){
			if(currentDayHalf=="AM"){
				currentDayHalf = "PM";
			}
			else{
				currentDayHalf = "AM";
			}
			currentHour -= 12;
		}
		if(currentHour == 12){
			if(currentDayHalf=="AM"){
				currentDayHalf = "PM";
			}
			else{
				currentDayHalf = "AM";
			}
		}
		var minuteString = currentMinute < 10 ? '0'+currentMinute : currentMinute;
		var finalTimeString = currentHour + ":" + minuteString + " " + currentDayHalf;
		return finalTimeString;
	}
}
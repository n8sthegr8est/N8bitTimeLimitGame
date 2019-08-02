//Note: Time is not literally time. The flow of time is controlled by in-game actions, not real-life time.

function TimeStorage(Time_Limit){//this object keeps track of the time limit and the time elapsed
	this.Time_Limit = Time_Limit;//the maximum amount of time
	//this.currentHour = Hour_Of_Game_Start;
	//this.currentMinute = Minute_Of_Game_Start;
	//this.currentDayHalf = Day_Half_Of_Game_Start;
	this.timeElapsed = 0;//the amount of time that has passed since game start
	
	this.roomTransferAdder = () => {//adds the amount of time elapsed by moving to a new room
		this.elapseTimeByEvent(Room_Transfer_Penalty);
	}
	
	this.elapseTimeByEvent = (timeToElapse) => {//adds the amount of time elapsed by an event.
		this.timeElapsed += timeToElapse;
		if(this.timeElapsed>=this.Time_Limit){//may remove this statement later
			globalFlagBank.setFlag("timeIsUp",true);
		}
	}
	
	this.getCurrentTimeAsHumanReadable = () => {//translates the current time into a human readable format.
		var currentHour = Hour_Of_Game_Start;
		var currentMinute = Minute_Of_Game_Start;
		var currentDayHalf = Day_Half_Of_Game_Start;
		currentMinute += this.timeElapsed;//add the time elapsed to the current minute
		for(;currentMinute>=60;){//keep doing this as long as current minute is greater than or equal to 60
			currentHour += 1;//increment the current hour
			currentMinute -= 60;//remove 60 from the current minute
		}
		for(;currentHour > 12;){//keep doing this as long as current hour is greater than 12
			if(currentDayHalf=="AM"){//set AM or PM
				currentDayHalf = "PM";
			}
			else{
				currentDayHalf = "AM";
			}
			currentHour -= 12;//subtract 12 from the hour
		}
		if(currentHour == 12){//this if statement sets AM or PM in the event that the hour is exactly 12. Otherwise, it would go from 11:59PM to 12:00PM, which is wrong.
			if(currentDayHalf=="AM"){
				currentDayHalf = "PM";
			}
			else{
				currentDayHalf = "AM";
			}
		}
		var minuteString = currentMinute < 10 ? '0'+currentMinute : currentMinute;//if the current minute is less than 10, add a 0 to the front
		var finalTimeString = currentHour + ":" + minuteString + " " + currentDayHalf;//put the entire time together
		return finalTimeString;//return it
	}
}
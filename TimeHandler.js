//Note: Time is not literally time. The flow of time is controlled by in-game actions, not real-life time.
//Note: Ignore the note above. I realized that it was far more limiting with that system, so I changed it to be real-life time.

function TimeStorage(Time_Limit){//this object keeps track of the time limit and the time elapsed
	//this.Time_Limit = Time_Limit;//the maximum amount of time
	//this.currentHour = Hour_Of_Game_Start;
	//this.currentMinute = Minute_Of_Game_Start;
	//this.currentDayHalf = Day_Half_Of_Game_Start;
	//this.timeElapsed = 0;//the amount of time that has passed since game start
	this.timer = new Timer();
	
	/*this.roomTransferAdder = () => {//adds the amount of time elapsed by moving to a new room
		this.elapseTimeByEvent(Room_Transfer_Penalty);
	}*/
	
	this.startTime = () => {//starts the game timer.
		this.timer.startTimer();
	}
	
	this.pauseTime = () => {//pauses the game timer.
		this.timer.pauseTimer();
	}
	
	this.elapseTimeByEvent = (timeToElapse) => {//adds the amount of time elapsed by an event.
		this.timeElapsed += timeToElapse;
		if(this.timeElapsed>=this.Time_Limit){//may remove this statement later
			globalFlagBank.setFlag("timeIsUp",true);
		}
		var clockSpot = document.getElementById("clockSpot");
		clockSpot.innerHTML = this.getCurrentTimeAsHumanReadable();
	}
	
	this.getCurrentTimeAsHumanReadable = () => {//translates the current time into a human readable format.
		var currentHour = Hour_Of_Game_Start;
		var currentMinute = Minute_Of_Game_Start;
		var currentDayHalf = Day_Half_Of_Game_Start;
		currentMinute += this.timer.timeElapsed;//add the time elapsed to the current minute
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

function Timer(){//this object runs the game timer. Can be paused and started back up as needed.
	this.timeElapsedSeconds = 0;//the time starts having not elapsed at all.
	this.timeElapsed = 0;
	
	this.timerTick = undefined;//this is used to elapse time.
	
	this.startTimer = () => {//this starts time elapsing.
		this.timerTick = setTimeout(() => {//set the timer to tick once after 1 second (1000 milliseconds)
			this.timeElapsedSeconds++;//increment the time elapsed by one second.
			if(this.timeElapsedSeconds==60){//if seconds have incremented 60 times, then one minute has elapsed.
				this.timeElapsedSeconds-=60//remove 60 ticks from our seconds counter
				this.timeElapsed++;//elapse time by one minute.
				var clockSpot = document.getElementById("clockSpot");//get the clock display
				clockSpot.innerHTML = timeKeeper.getCurrentTimeAsHumanReadable();//and show the new time since a minute has passed.
			}
			if(this.timeElapsed>=Time_Limit){//if the time limit has been reached
				globalFlagBank.setFlag("timeIsUp",true);//set a flag
			}
			this.startTimer();//ready the timer to perform another tick.
		},1000);
	}
	
	this.pauseTimer = () => {//this pauses time elapsing. This may lose milliseconds, but it doesn't matter in the long run.
		clearTimeout(this.timerTick);//stop the next timer tick.
		/*
		 *  Developers note:
		 *  In theory, if time can be repeatedly stopped before any ticks can run, but with enough time for the player to move in between,
		 *  then the game could be completed with an official time of 0 hours, 0 minutes, and 0 seconds. Considering this would be such a long,
		 *  tedious, boring, and frustrating task (and ridiculously easy to mess up part way through, thus forcing restarts) (plus it would be
		 *  impossible to tell if a tick has run, since there isn't a visual indicator until 60 have passed), we can ignore this issue, because
		 *  who the fudge would want to do that? It's pure insanity! If you're insane enough to try and manage to succeed, then I say take your
		 *  time of 00:00:00! You've earned it if you subject yourself to that nonsense.
		 */
	}
}
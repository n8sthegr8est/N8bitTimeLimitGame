//A listener event is an event that lets the game communicate with the page or the player's keyboard or mouse.
function addListenerEvent(element, eventName, callback){
	if (element.addEventListener) {//this if block ensures cross-browser compatibility.
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

//a game event is an event that the game uses to alter certain elements or keep track of progress.
//Game events are tied to specific tiles or actions (add the action functionality later)
function GameEvent(roomGroupId,roomId,tileLoc,callback){
	this.roomGroupId = roomGroupId;//the room group the event is tied to.
	this.roomId = roomId;//the room in the group the event is tied to.
	this.tileLoc = tileLoc;//the tile in the room the event is tied to.
	this.callback = callback;//the function to run when event is activated.
	
	this.run = () => {// runs the function tied to the event.
		this.callback();
	}
}

//a set of commonly used functions made easy to code and call. just use .bind to apply the arguments.
GameEvent.Presets = {
	roomTransfer: function(to_roomGroupID,to_roomID,to_tileLoc){// this is used to move between two rooms via stairs or door
		currentRoom = BigRoomDatabase.getRoom(to_roomGroupID,to_roomID);//set the current room to the one we're transferring to
		currentRoomMem = [to_roomGroupID,to_roomID];//set our easy access roomDatabase key.
		player.setPosition(to_tileLoc);//set the player's position to the correct position in the new room
		reRenderRoom();//redraw the room on screen
		//timeKeeper.roomTransferAdder();//add the time penalty for switching rooms
		
		//code to show time may change
		/*var clockSpot = document.getElementById("clockSpot");
		clockSpot.innerHTML = timeKeeper.getCurrentTimeAsHumanReadable();
		showIfTimeIsUp();*/
	},
	
	setFlag: function(flagBank,flagName,flagged){//this is used to quickly set a flag within a given flagBank.
		try{
			flagBank.setFlag(flagName,flagged);//set the flag
		}
		catch(error){
			console.error(error);//if it doesn't exist, send an error to the console.
		}
	},
	
	checkFlag: function(flagBank,flagName){//this is used to quickly check a flag within a given flagBank.
		try{
			flagBank.checkFlag(flagName);//set the flag
		}
		catch(error){
			console.error(error);//if it doesn't exist, send an error to the console.
		}
	},
	
	showAlert: function(alertText){//a game event that shows an alert, not recommended to use outside of testing.
		alert(alertText);
	},
	
	freezePlayer: function(){//a game event that disables player movement
		player.freeze();
	},
	
	unFreezePlayer: function(){//a game event that enables player movement
		player.unFreeze();
	},
	
	pauseTime: function(){//a game event that pauses the game timer
		timeKeeper.pauseTime();
	},
	
	unPauseTime: function(){//a game event that unpauses the game timer
		timeKeeper.startTime();
	},
	
	showTextbox_InputClose: function(txt){//a game event that shows a text box that requires input from the player to close.
		var myTB = new TextBox(txt);//create a new text box
		globalTextBoxShowcase.setCurrentTextBox(myTB);//tell the game to show the new text box next time it shows a text box.
		globalTextBoxShowcase.showUntilInput();//tell the game to show a text box of type "Input_Exit"
	},
	
	showTextbox_TimerClose: function(txt,sec){//a game event that shows a text box that closes after a few seconds
		var myTB = new TextBox(txt);//create a new text box
		globalTextBoxShowcase.setCurrentTextBox(myTB);//tell the game to show the new text box next time it shows a text box.
		globalTextBoxShowcase.showForSeconds(sec);//tell the game to show a text box of type "Time_Exit" for sec seconds.
	},
	
	showTextboxSequence: function(txts){
		var myTBS = new TextBoxSequence(txts);
		myTBS.playSequence(globalTextBoxShowcase);
	},
	
	/*showTextbox: function(boxText){
		//var tbArea = document.getElementById("textboxArea");
		
	},*/
	
	/*pauseEventsUntilInput: function(buttonToListenFor){
		function stopListening(e){
			document.removeEventListener("keydown",this,false);
		}
		addEventListener(document,"keydown",stopListening(e));
		
	},*/
	
	/*waitForSeconds: function(){
		
	},*/
	
	nothing: function(){//a game event that explicitly does nothing
		return;
	}
};

GameEvent.Sequence = function(roomGroupId,roomId,tileLoc,events){//this is used to run a number of GameEvents in sequence. It is, itself, a GameEvent.
	var myCallback = function(events){//this function runs all of the GameEvents in the sequence
		for(let i of events){//read through every GameEvent in order
			if(typeof i === "GameEvent"){//if the GameEvent is officially a GameEvent, do the following
				i.run();//run it
			}
			else{//otherwise (if it's a function, as it would be if it's a GameEvent.Preset)
				let j = new GameEvent(roomGroupId,roomId,tileLoc,i);//create a new Game event at the location specified
				j.run();//run our new event.
			}
		}
	}
	
	return new GameEvent(roomGroupId,roomId,tileLoc,myCallback.bind(this,events.slice()));
	//create a new GameEvent at the location specified, which calls the method above. return that GameEvent.
};

GameEvent.Conditional = function(roomGroupId,roomId,tileLoc,ifCondition,trueRunEvent,falseRunEvent){
	//this is used to run one GameEvent to get a boolean value, and runs one of two others based on the boolean. Usually the boolean event is a Flag check.
	var myCallback = function(ifCondition,trueRunEvent,falseRunEvent){//this function is what runs the events
		var ifConditionEvent;//create a variable for the if condition event, so we can run it when needed.
		if(typeof ifCondition === "GameEvent"){//if the if condition we've been sent is already a GameEvent do the following
			ifConditionEvent = ifCondition;//set the variable above to it.
		}
		else{//otherwise (it's probably a function, but there's a possibility it's a boolean)
			ifConditionEvent = new GameEvent(roomGroupId,roomId,tileLoc,ifCondition);//create a new game event with it as the callback (we'll handle the boolean possibility shortly)
		}
		try{
			if(ifConditionEvent.run()){//run our ifConditionEvent. If it's true, do the following
				if(typeof trueRunEvent === "GameEvent"){//if the trueRunEvent is already an event do the following
					trueRunEvent.run();//run it
				}
				else{//otherwise (it's a function)
					let i = new GameEvent(roomGroupId,roomId,tileLoc,trueRunEvent);//create a new game event with it as the callback
					i.run();//run the new event
				}
			}
			else{//otherwise (our ifConditionEvent returned false)
				if(typeof falseRunEvent === "GameEvent"){//if the falseRunEvent is already an event do the following
					falseRunEvent.run();//run it
				}
				else{//otherwise (it's a function)
					let i = new GameEvent(roomGroupId,roomId,tileLoc,falseRunEvent);//if the falseRunEvent is already an event do the following
					i.run();//run it
				}
			}
		}
		catch(error){//this is where we handle that boolean possibility
			if(error.name==="TypeError"){//if it's a type error, do the following
				console.warn("received a boolean for ifCondition, when a GameEvent was expected. Boolean is accepted, but behavior may not be what was expected.");//warn that we got a boolean when a GameEvent was expected.
				//note that the boolean should still be treated as valid, but it is likely the result of a programming mistake. We likely ran the function when passing it to this as an argument. Since there's an off chance
				//the boolean wasn't a mistake, we still accept it.
				if(ifCondition){//if the boolean is true
					if(typeof trueRunEvent === "GameEvent"){//run the trueRunEvent
						trueRunEvent.run();
					}
					else{
						let i = new GameEvent(roomGroupId,roomId,tileLoc,trueRunEvent);
						i.run();
					}
				}
				else{//otherwise (boolean is false)
					if(typeof falseRunEvent === "GameEvent"){//run the falseRunEvent
						falseRunEvent.run();
					}
					else{
						let i = new GameEvent(roomGroupId,roomId,tileLoc,falseRunEvent);
						i.run();
					}
				}
			}
			else{//if the error isn't a TypeError, we need to toss it further up, since we can't fix it.
				throw error;
			}
		}
	}
	
	return new GameEvent(roomGroupId,roomId,tileLoc,myCallback.bind(this,ifCondition,trueRunEvent,falseRunEvent));
	//create a new GameEvent at the location specified, which calls the method above. return that GameEvent.
};

function GameEventsDatabase(){// a database to keep track of a set of game events.
	this.events = [];//the array storing the game events.
	
	this.addGameEvent = (gE) => {//adds a game event to the database
		this.events.push(gE);//adds the game event to our array
	}
	
	this.hasEventAt = (roomGroupId,roomId,tileLocX,tileLocY) => {//checks if there is an event at the current location.
		for(let i of this.events){//for each event in the database, do the following
			if(i.roomGroupId==roomGroupId){//if there is one within the current roomGroup, do the following
				if(i.roomId==roomId){//if there is one within the current room, do the following
					if(i.tileLoc[0]==tileLocX){//if there is one within the current row of tiles, do the following
						if(i.tileLoc[1]==tileLocY){//if there is one within the current column of tiles (thus on the current tile), do the following
							return true;//there is at least one event here, so return true.
						}
						//otherwise there is no event
					}
					//otherwise there is no event
				}
				//otherwise there is no event
			}
			//otherwise there is no event
		}
	}
	
	this.getEventsAt = (roomGroupId,roomId,tileLocX,tileLocY) => {//gets a list of all events at the current location
		var eventArray = [];//the array to hold the events
		for(let i of this.events){//for each event in the database, do the following
			if(i.roomGroupId==roomGroupId){//for each event within the current roomGroup, do the following
				if(i.roomId==roomId){//for each event within the current room, do the following
					if(i.tileLoc[0]==tileLocX){//for each event within the current row of tiles, do the following
						if(i.tileLoc[1]==tileLocY){//for each event within the current column of tiles (thus on the current tile), do the following
							eventArray.push(i);//add it to the array
						}
						//otherwise continue to next event
					}
					//otherwise continue to next event
				}
				//otherwise continue to next event
			}
			//otherwise continue to next event
		}
		return eventArray;//return the list of events to run
	}
}

function checkForAndRunEvents(xCoord,yCoord){//checks for events on the current tile
	if(allGameEvents.hasEventAt(currentRoomMem[0],currentRoomMem[1],xCoord,yCoord)){//if there is at least one event on the current tile, do the following
		var eventsToRun = allGameEvents.getEventsAt(currentRoomMem[0],currentRoomMem[1],xCoord,yCoord);//get a list of all of them
		for(let i of eventsToRun){//for each event on the tile do the following
			i.run();//run the event
		}
	}
	//otherwise do nothing, as there are no events.
}
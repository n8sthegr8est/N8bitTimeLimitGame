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
	
	freezePlayer: function(){
		player.freeze();
	},
	
	unFreezePlayer: function(){
		player.unFreeze();
	},
	
	pauseTime: function(){
		timeKeeper.pauseTime();
	},
	
	unPauseTime: function(){
		timeKeeper.startTime();
	},
	
	/*waitForSeconds: function(){
		
	},*/
	
	nothing: function(){//a game event that explicitly does nothing
		return;
	}
};

GameEvent.Sequence = function(roomGroupId,roomId,tileLoc,events){
	var myCallback = function(events){
		for(let i of events){
			if(typeof i === "GameEvent"){
				i.run();
			}
			else{
				let j = new GameEvent(roomGroupId,roomId,tileLoc,i);
				j.run();
			}
		}
	}
	
	return new GameEvent(roomGroupId,roomId,tileLoc,myCallback.bind(this,events.slice()));
};

GameEvent.Conditional = function(roomGroupId,roomId,tileLoc,ifCondition,trueRunEvent,falseRunEvent){
	var myCallback = function(ifCondition,trueRunEvent,falseRunEvent){
		var ifConditionEvent;
		if(typeof ifCondition === "GameEvent"){
			ifConditionEvent = ifCondition;
		}
		else{
			ifConditionEvent = new GameEvent(roomGroupId,roomId,tileLoc,ifCondition);
		}
		try{
			if(ifConditionEvent.run()){
				if(typeof trueRunEvent === "GameEvent"){
					trueRunEvent.run();
				}
				else{
					let i = new GameEvent(roomGroupId,roomId,tileLoc,trueRunEvent);
					i.run();
				}
			}
			else{
				if(typeof falseRunEvent === "GameEvent"){
					falseRunEvent.run();
				}
				else{
					let i = new GameEvent(roomGroupId,roomId,tileLoc,falseRunEvent);
					i.run();
				}
			}
		}
		catch(error){
			if(error.name==="TypeError"){
				console.warn("received a boolean for ifCondition, when a GameEvent was expected. Boolean is accepted, but behavior may not be what was expected.");
				if(ifCondition){
					if(typeof trueRunEvent === "GameEvent"){
						trueRunEvent.run();
					}
					else{
						let i = new GameEvent(roomGroupId,roomId,tileLoc,trueRunEvent);
						i.run();
					}
				}
				else{
					if(typeof falseRunEvent === "GameEvent"){
						falseRunEvent.run();
					}
					else{
						let i = new GameEvent(roomGroupId,roomId,tileLoc,falseRunEvent);
						i.run();
					}
				}
			}
			else{
				throw error;
			}
		}
	}
	return new GameEvent(roomGroupId,roomId,tileLoc,myCallback.bind(this,ifCondition,trueRunEvent,falseRunEvent));
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
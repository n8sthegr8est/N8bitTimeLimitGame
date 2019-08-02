function addListenerEvent(element, eventName, callback){
	if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

function GameEvent(roomGroupId,roomId,tileLoc,callback){
	this.roomGroupId = roomGroupId;
	this.roomId = roomId;
	this.tileLoc = tileLoc;
	this.callback = callback;
	
	this.run = () => {
		this.callback();
	}
}

GameEvent.Presets = {
	roomTransfer: function(to_roomGroupID,to_roomID,to_tileLoc){
		currentRoom = BigRoomDatabase.getRoom(to_roomGroupID,to_roomID);
		currentRoomMem = [to_roomGroupID,to_roomID];
		player.setPosition(to_tileLoc);
		reRenderRoom();
	}
};

function GameEventsDatabase(){
	this.events = [];
	
	this.addGameEvent = (gE) => {
		this.events.push(gE);
	}
	
	this.hasEventAt = (roomGroupId,roomId,tileLocX,tileLocY) => {
		for(let i of this.events){
			if(i.roomGroupId==roomGroupId){
				if(i.roomId==roomId){
					if(i.tileLoc[0]==tileLocX){
						if(i.tileLoc[1]==tileLocY){
							return true;
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
	
	this.getEventsAt = (roomGroupId,roomId,tileLocX,tileLocY) => {
		var eventArray = [];
		for(let i of this.events){
			if(i.roomGroupId==roomGroupId){
				if(i.roomId==roomId){
					if(i.tileLoc[0]==tileLocX){
						if(i.tileLoc[1]==tileLocY){
							eventArray.push(i);
						}
						//otherwise there is no event
					}
					//otherwise there is no event
				}
				//otherwise there is no event
			}
			//otherwise there is no event
		}
		return eventArray;
	}
}

function checkForAndRunEvents(xCoord,yCoord){
	if(allGameEvents.hasEventAt(currentRoomMem[0],currentRoomMem[1],xCoord,yCoord)){
		var eventsToRun = allGameEvents.getEventsAt(currentRoomMem[0],currentRoomMem[1],xCoord,yCoord);
		for(let i of eventsToRun){
			i.run();
		}
	}
}
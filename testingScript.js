//everything below this comment is testing. remove all of it later

window.onload = function(){
	var clockSpot = document.getElementById("clockSpot");
	clockSpot.innerHTML = timeKeeper.getCurrentTimeAsHumanReadable();
	try{
		globalFlagBank.checkFlag("falseFlag");
	}
	catch(error){
		console.error(error);
	}
	try{
		globalFlagBank.setFlag("falseFlag",true);
	}
	catch(error){
		console.error(error);
	}
	showIfTimeIsUp();
	showCurrentHealth();
	allGameEvents.addGameEvent(new GameEvent(0,0,[24,5],GameEvent.Presets.roomTransfer.bind(this,0,1,[0,5])));
	allGameEvents.addGameEvent(new GameEvent(0,1,[0,5],GameEvent.Presets.roomTransfer.bind(this,0,0,[24,5])));
	allGameEvents.addGameEvent(GameEvent.Sequence(0,0,[1,5],[GameEvent.Presets.showAlert.bind(this,"an alert"),GameEvent.Presets.showAlert.bind(this,"another alert")]));
	allGameEvents.addGameEvent(GameEvent.Conditional(0,0,[1,4],GameEvent.Presets.checkFlag.bind(this,globalFlagBank,"timeIsUp"),GameEvent.Presets.showAlert.bind(this,"time is up"),GameEvent.Presets.showAlert.bind(this,"time is not up")));
	allGameEvents.addGameEvent(GameEvent.Conditional(0,0,[2,4],globalFlagBank.checkFlag("timeIsUp"),GameEvent.Presets.showAlert.bind(this,"time is up"),GameEvent.Presets.showAlert.bind(this,"time is not up")));
	allGameEvents.addGameEvent(new GameEvent(0,0,[1,3],GameEvent.Presets.pauseTime.bind(this)));
	allGameEvents.addGameEvent(new GameEvent(0,0,[2,3],GameEvent.Presets.unPauseTime.bind(this)));
	//allGameEvents.addGameEvent(new GameEvent(0,0,[1,2],GameEvent.Presets.showTextbox_InputClose.bind(this,"Lorem ipsum dolors is lorem text and this is more words after it.")));
	
	//allGameEvents.addGameEvent(new GameEvent(0,0,[1,2],GameEvent.Presets.showTextbox_InputClose.bind(this,"Hello <charName>Player</charName>, you're in the <location>Start Room</location> and <stress>trapped</stress>!<!Not a tag>")));
	
	//allGameEvents.addGameEvent(GameEvent.Sequence(0,0,[1,2],[GameEvent.Presets.pauseTime.bind(this),GameEvent.Presets.showTextbox_InputClose.bind(this,"Hello, <charName>Player</charName>."),
	//		GameEvent.Presets.showTextbox_InputClose.bind(this,"Welcome to the cutscene test."),GameEvent.Presets.showTextbox_InputClose.bind(this,"How are you doing?"),GameEvent.Presets.unPauseTime.bind(this)]));
	allGameEvents.addGameEvent(GameEvent.Sequence(0,0,[1,2],[GameEvent.Presets.pauseTime.bind(this),GameEvent.Presets.showTextboxSequence.bind(this,["Hello, <charName>Player</charName>.","Welcome to the cutscene test.",
							   "How are you doing?"]),GameEvent.Presets.unPauseTime.bind(this)]));
	allGameEvents.addGameEvent(new GameEvent(0,0,[2,1],GameEvent.Presets.showTextbox_TimerClose.bind(this,"Lorem ipsum dolors is lorem text and this is more words after it.",3)));
	//allGameEvents.addGameEvent(GameEvent.Sequence.creteSequence(0,0,[1,5],[GameEvent.Presets.setFlag.bind(this,globalFlagBank,"falseFlag",false),GameEvent.Presets.checkFlag.bind(this,globalFlagBank,"falseFlag")]));
	//allGameEvents.addGameEvent(new GameEvent(0,0,[24,5],GameEvent.Sequence.runSequence.bind(this,[GameEvent.Presets.setFlag.bind(this,globalFlagBank,"falseFlag",false),GameEvent.Presets.checkFlag.bind(this,globalFlagBank,"falseFlag",false)])));//.Presets.setFlag.bind(this,globalFlagBank,"falseFlag",false)));
	renderRoom();
	placePlayer();
	var myTextBoxTextTest = new TextBoxText("This is a <player>player</player>. this <! should show. This is a <location>location</location>");
}

function roomTransferTest(){
	timeKeeper.roomTransferAdder();
	var clockSpot = document.getElementById("clockSpot");
	clockSpot.innerHTML = timeKeeper.getCurrentTimeAsHumanReadable();
	showIfTimeIsUp();
}

function showIfTimeIsUp(){
	var timeUpShow = document.getElementById("timeUpReader");
	if(globalFlagBank.checkFlag("timeIsUp")){
		timeUpShow.innerHTML = "Time has run out!";
	}
	else{
		timeUpShow.innerHTML = "Clock is ticking!";
	}
}

function showCurrentHealth(){
	var healthArea = document.getElementById("healthSpot");
	healthArea.innerHTML = player.healthPoints;
}

function renderRoom(){
	var x = new room(new roomGridLayout(25,25));
	x.setArea([0,0],25,25,defaultUnwalkableTile);
	x.setArea([1,1],23,23,defaultWalkableTile);
	x.setArea([24,5],1,1,defaultDoorTile);
	x.addDecoration([12,5],default2x2Deco);
	x.addDecoration([8,21],default2x2Deco);
	x.addFloorCovering([5,11],default2x2FloorCover);
	x.addFloorCovering([18,7],default2x2FloorCoverPain);
	x.addFloorCovering([11,4],default2x2FloorCover);
	var w = new room(new roomGridLayout(7,10));
	w.setArea([0,0],7,10,defaultUnwalkableTile);
	w.setArea([1,1],5,8,defaultWalkableTile);
	w.setArea([0,5],1,1,defaultDoorTile);
	var y = new roomGroup();
	y.addRoom(x);
	y.addRoom(w);
	BigRoomDatabase.addRoomGroup(y);
	//var w = new roomDatabase();
	//w.addRoomGroup(y);
	var z = document.getElementById("roomRender");
	z.innerHTML = BigRoomDatabase.getRoom(0,0).render();//"<img src=\"" + x.render() + "\" style=\"width:" + Tile_Default_Width + ";height:" + Tile_Default_Height + ";\"></img>";
	currentRoom = BigRoomDatabase.getRoom(0,0);
	currentRoomMem = [0,0];
}

function reRenderRoom(){
	var z = document.getElementById("roomRender");
	z.innerHTML = currentRoom.render();
}

function placePlayer(){
	var x = document.getElementById("player");
	x.innerHTML = player.render();
	x.getElementsByTagName("img")[0].style.left = player.positionX + "px";
	x.style.top = player.positionY + "px";
}

function hurtTest(){
	player.hurt(1);
	//showCurrentHealth();
}

function healTest(){
	player.heal(1);
	//showCurrentHealth();
}
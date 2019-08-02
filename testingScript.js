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
	allGameEvents.addGameEvent(new GameEvent(0,0,[24,5],() => {
		//GameEvent.Presets.roomTransfer.bind(0,0,[1,1]);
		to_roomGroupID = 0;
		to_roomID = 1;
		to_tileLoc = [0,5];
		currentRoom = BigRoomDatabase.getRoom(to_roomGroupID,to_roomID);
		currentRoomMem = [to_roomGroupID,to_roomID];
		//player.tilePositionX = to_tileLoc[0];
		//player.tilePositionY = to_tileLoc[1];
		//player.move();
		player.setPosition(to_tileLoc);
		reRenderRoom();
	}));
	allGameEvents.addGameEvent(new GameEvent(0,1,[0,5],() => {
		//GameEvent.Presets.roomTransfer.bind(0,0,[1,1]);
		to_roomGroupID = 0;
		to_roomID = 0;
		to_tileLoc = [24,5];
		currentRoom = BigRoomDatabase.getRoom(to_roomGroupID,to_roomID);
		currentRoomMem = [to_roomGroupID,to_roomID];
		//player.tilePositionX = to_tileLoc[0];
		//player.tilePositionY = to_tileLoc[1];
		//player.move();
		player.setPosition(to_tileLoc);
		reRenderRoom();
	}));
	renderRoom();
	placePlayer();
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
	var w = new room(new roomGridLayout(7,7));
	w.setArea([0,0],7,7,defaultUnwalkableTile);
	w.setArea([1,1],5,5,defaultWalkableTile);
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
	showCurrentHealth();
}

function healTest(){
	player.heal(1);
	showCurrentHealth();
}
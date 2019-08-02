function roomDatabase(){// this object stores every room in the game, sorted into groups.
	this.roomGroups = [];// the room groups the object stores
	
	this.addRoomGroup = (rG) => {//adds a new room group to the database
		rG.idNum = this.roomGroups.length;//sets an id number for the room group.
		this.roomGroups.push(rG);//adds the group to the database
	}
	
	this.getRoomGroup = (idNum) => {//gets a specific room group from the database.
		for(let x of this.roomGroups){//reads through the list of groups to find the one with the proper id number. This is in case they somehow get shuffled around.
			if(x.idNum==idNum){//if the group has the id number we need do the following
				return x;//return it
			}
		}
		throw "Room Group " + idNum + " Does Not Exist!";//if we can't find the proper room group, throw an error so the program crashes.
	}
	
	this.getRoom = (groupIdNum,roomIdNum) => {//gets a specific room from the database
		return this.getRoomGroup(groupIdNum).getRoom(roomIdNum);//we first need to get the room group, then tell it to get the room
	}
}

function roomGroup(localFlagBank){// this object stores a number of rooms in a local group.
	this.rooms = [];//the list of rooms in the group
	if(localFlagBank!=undefined){
		this.localFlagBank = localFlagBank;//this local flag bank is used in the event that a flag is needed for a group of rooms to know about, but irrelevant to the global scope.
	}
	else{
		this.localFlagBank = undefined;
	}
	
	this.addRoom = (rm) => {//adds a room to the group
		rm.idNum = this.rooms.length;//give the room an id number
		this.rooms.push(rm);//add it to the group
	}
	
	this.getRoom = (idNum) => {//gets a specific room from the group
		for(let x of this.rooms){// read through the list of rooms to find the one with the proper id number. This is in case they somehow get shuffled around.
			if(x.idNum==idNum){//if the room has the id number we need do the following
				return x;//return it
			}
		}
		throw "Room " + idNum + " Does Not Exist!";//if we can't find the proper room, throw an error so the program crashes.
	}
}

function room(myLayout){//a room in the game
	this.myLayout = myLayout;//the room's layout is determined by a separate object, called "roomGridLayout". This is basically the concept of a room, while roomGridLayout is used to realize it
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {//an easy accessor for the roomGridLayout's function of the same name
		myLayout.setArea(TL_Corner,areaHeight,areaWidth,withRoomTiles);
	}
	
	this.getTile = (xCoord,yCoord) => {//gets a specified tile from the roomGridLayout
		return myLayout.tiles[yCoord][xCoord];
	}
	
	this.render = () => {//an easy accessor for the roomGridLayout's function of the same name
		return myLayout.render();
	}
}

function roomGridLayout(height,width){//the layout of a room in the game
	this.height = height;//the size of the room
	this.width = width;
	this.tiles = [];// the tiles that make the room
	
	var tempyTileHold = [];
	for(let x = 0; x < this.width; x++){
		tempyTileHold.push(new roomTile());
	}
	for(let x = 0; x < this.height; x++){
		this.tiles.push(tempyTileHold.slice());
	}
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {
		for(let i = TL_Corner[1]; i < TL_Corner[1] + areaHeight; i++){
			for(let j = TL_Corner[0]; j < TL_Corner[0] + areaWidth; j++){
				this.tiles[i][j] = withRoomTiles;
			}
		}
	}
	
	this.render = () => {
		var allImages = "<div>";
		for(let x of this.tiles){
			allImages += "<div>";
			for(let y of x){
				allImages += "<img src=\"" + y.render() + "\" style=\"width:" + Tile_Default_Width + ";height:" + Tile_Default_Height + ";\"></img>";
			}
			allImages += "</div>";
		}
		allImages += "</div>";
		return allImages;
	}
}

function roomTile(isWalkable,isDamaging,isSlippery){
	if(isWalkable!=undefined){
		this.isWalkable = isWalkable;
	}
	else{
		this.isWalkable = false;
	}
	if(isDamaging!=undefined){
		this.isDamaging = isDamaging;
	}
	else{
		this.isDamaging = false;
	}
	if(isSlippery!=undefined){
		this.isSlippery = isSlippery;
	}
	else{
		this.isSlippery = false;
	}
	this.picture = "https://cdn.shopify.com/s/files/1/0115/9974/0987/products/Checkerboard-pattern_800x.png?v=1554920887";
	
	this.setPicture = (pic) => {
		this.picture = pic;
	}
	
	this.render = () => {
		return this.picture;
	}
}

//a set of default tiles for constructing test rooms.
var defaultWalkableTile = new roomTile(true);
var defaultUnwalkableTile = new roomTile();
defaultUnwalkableTile.setPicture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEUAAADtAACaAAD1AADyAADwAAD4AABaBATMBARaAADMAAD7AAD/AACaAwPPBARVAAB4BARTBATSAAC3AgJkFb75AAAChklEQVR4nO2ay47CMBAEnTgxBIeAw///60ps/IjEFdEj15xWoz50SUgw3nJDGX9xZcYpb+dr3bpgMOwgVCwNIYT6pSGEUL80hGdCX2ZNTTrmbdia8Gow7C5l0uuWZ7+nsn7udZ3shW8t7G2aj/Fj3T5C3s7RYHg+Ec75gzw16cWXT30wGB4gVCwNIYT6pSHsmXD30zGh/faMeTutBsOTG+vcx0/zeWsn7CpsbH/Fhrz1p5+8BsMdXE8QKpaGEEL90hD2RlgfNEKb9nk7td+e0WDYXctsz8dyzOO+le0r5e2SNnvhpYXdQ35wjM2v2NS8ThoM+5bQykHEfQihfmkIIdQvDWHPhHsMx6yn3wehrA2Gg6t/nv5jXCLx9MhlMNzB9QShYmkIIdQvDSGE+qUx9zD35GU8zL2e70MrpSGEUL80hD0TWpHxMPcw9/7T0gcR9yGE+qUhhFC/NISYe/IyHuYe5p5+aQgh1C8NIYT6pSHE3HuPtoyHudfbfQihYmkIIdQvDWFvhPXJxo6Mh7mHuTeoH0TchxDql4YQQv3SEGLu/cav+14Yc0/yIOI+hFC/NIQQ6peGEHNPXsbD3MPc0y8NIYT6pSGEUL80hJh779GW8TD3ersPIVQsDSGE+qUh7I2wPtnYkfEw9zD3BvWDiPsQQv3SEEKoXxpCzL3f+HXfC2PuSR5E3IcQ6peGEEL90hBi7snLeJh7mHv6pSGEUL80hBDql4YQc+892jIe5l5v9yGEiqUhhFC/NIS9EdYnGzsyHuYe5t6gfhBxH0KoXxpCCPVLQ4i59xu/7nthzD3Jg4j7EEL90hBCqF8aQsw9eRkPcw9zT780hBDql4YQQv3SEPZG+AenXX6wxadwpwAAAABJRU5ErkJggg==");
var defaultDoorTile = new roomTile(true);
defaultDoorTile.setPicture("https://ih1.redbubble.net/image.548097730.1221/flat,1000x1000,075,f.u1.jpg");
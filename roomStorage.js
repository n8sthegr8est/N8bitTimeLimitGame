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
	this.roomName = "default";//this also holds info like the name and id number of the room, which the actual layout doesn't need to worry about. (name is largely unused for now)
	//id number is only assigned when the room is placed in a group.
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {//an easy accessor for the roomGridLayout's function of the same name
		myLayout.setArea(TL_Corner,areaHeight,areaWidth,withRoomTiles);
	}
	
	this.getTile = (xCoord,yCoord) => {//gets a specified tile from the roomGridLayout
		return myLayout.tiles[yCoord][xCoord];
	}
	
	this.render = () => {//an easy accessor for the roomGridLayout's function of the same name
		return myLayout.render();
	}
	
	this.addDecoration = (TL_Corner,decoration) => {
		return myLayout.addDecoration(TL_Corner,decoration);
	}
}

function roomGridLayout(height,width){//the layout of a room in the game
	this.height = height;//the size of the room
	this.width = width;
	this.tiles = [];// the tiles that make the room
	this.decorations = [];//the objects scattered around the room.
	
	var tempyTileHold = [];//this whole process is to make this.tiles a 2d array of default room tiles
	for(let x = 0; x < this.width; x++){
		tempyTileHold.push(new roomTile());//fill our temporary array with default room tiles, equal to the room width
	}
	for(let x = 0; x < this.height; x++){
		this.tiles.push(tempyTileHold.slice());//fill our actual tiles array with copies of our temporary array.
	}
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {//sets an area of room tiles within the room to the input room tile "withRoomTiles"
		for(let i = TL_Corner[1]; i < TL_Corner[1] + areaHeight; i++){//read through each row within the area
			for(let j = TL_Corner[0]; j < TL_Corner[0] + areaWidth; j++){//read through each column (thus each tile) within the area
				this.tiles[i][j] = withRoomTiles.copy();//set each tile to the one given
			}
		}
	}
	
	this.addDecoration = (TL_Corner,decoration) => {
		for(let i = TL_Corner[1]; i < TL_Corner[1] + decoration.decoHeight; i++){//read through each row within the area
			for(let j = TL_Corner[0]; j < TL_Corner[0] + decoration.decoWidth; j++){//read through each column (thus each tile) within the area
				this.tiles[i][j].isWalkable = false;//set each tile to the one given
			}
		}
		decoration.TL_Corner = TL_Corner;
		this.decorations.push(decoration);
	}
	
	this.render = () => {//a function to show the room on the screen
		
		//start tiles rendering
		var allImages = "<div>";//start with a wrapper div to hold each row
		for(let x of this.tiles){//for every row of tiles do the following
			allImages += "<div>";//create a div to contain all of the images
			for(let y of x){//for every tile in the row, do the following
				//add every tile to the row as an image, size adjusted based on the Tile_Default_Height and Tile_Default_Width values in GameStartConstants.
				allImages += "<img src=\"" + y.render() + "\" style=\"width:" + Tile_Default_Width + ";height:" + Tile_Default_Height + ";\"></img>";
			}
			allImages += "</div>";//close the div to end the row
		}
		allImages += "</div>";//close the wrapper div
		//end tiles rendering
		
		//start decos rendering
		allImages += "<div>";
		for(let x of this.decorations){
			allImages += "<div style=\"position:absolute;left:" + parseInt(Tile_Default_Width)*x.TL_Corner[0] + ";top:" + parseInt(Tile_Default_Height)*x.TL_Corner[1] + ";\">";
			allImages += "<img src=\"" + x.render() + "\" style=\"width:" + parseInt(Tile_Default_Width)*x.decoWidth + ";height:" + parseInt(Tile_Default_Height)*x.decoHeight + ";z-index:3;\"></img>";
			allImages += "</div>";
		}
		allImages += "</div>";
		//end decos rendering
		
		return allImages;//return the full room render
	}
}

function roomTile(isWalkable,isDamaging,isSlippery){//the subunits of rooms. each room is made from several of these tiles.
	if(isWalkable!=undefined){
		this.isWalkable = isWalkable;//determines if the tile can be walked on. if false, tile acts as a wall and prevents movement.
	}
	else{
		this.isWalkable = false;//if not defined in the arguments, assume it's a wall.
	}
	if(isDamaging!=undefined){
		this.isDamaging = isDamaging;//determines if walking on the tile hurts the player character. Irrelevant if "isWalkable" is false
	}
	else{
		this.isDamaging = false;//if not defined in the arguments, assume it's not damaging.
	}
	if(isSlippery!=undefined){
		this.isSlippery = isSlippery;//determines if the player will automatically be forced to the next tile when walked on. It's like ice. Irrelevant if "isWalkable" is false
	}
	else{
		this.isSlippery = false;//if not defined in the arguments, assume it's not slippery.
	}
	this.picture = "https://cdn.shopify.com/s/files/1/0115/9974/0987/products/Checkerboard-pattern_800x.png?v=1554920887";//the default image we'll use. It's a checkerboard pattern. That's how you know it's a placeholder.
	
	this.setPicture = (pic) => {//sets the picture shown for this tile when the room is rendered
		this.picture = pic;
	}
	
	this.render = () => {//is used to retrieve this tile's picture when the room is rendered.
		return this.picture;
	}
	
	this.copy = () => {
		var newRoomTile = new roomTile(this.isWalkable,this.isDamaging, this.isSlippery);
		newRoomTile.setPicture(this.picture);
		return newRoomTile;
	}
}

function decoration(decoHeight,decoWidth){
	this.decoHeight = decoHeight;
	this.decoWidth = decoWidth;
	this.picture = "https://re-mm-assets.s3.amazonaws.com/product_photo/22868/large_Poly_HotPink_pms226up_1471502442.jpg";
	
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

//a set of default decorations for the same purpose as above.
var default2x2Deco = new decoration(2,2);
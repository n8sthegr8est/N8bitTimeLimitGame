function roomDatabase(){
	this.roomGroups = [];
	
	this.addRoomGroup = (rG) => {
		rG.idNum = this.roomGroups.length;
		this.roomGroups.push(rG);
	}
	
	this.getRoomGroup = (idNum) => {
		for(let x of this.roomGroups){
			if(x.idNum==idNum){
				return x;
			}
		}
		throw "Room Group " + idNum + " Does Not Exist!"
	}
	
	this.getRoom = (groupIdNum,roomIdNum) => {
		return this.getRoomGroup(groupIdNum).getRoom(roomIdNum);
	}
}

function roomGroup(localFlagBank){
	this.rooms = [];
	if(localFlagBank!=undefined){
		this.localFlagBank = localFlagBank;
	}
	else{
		this.localFlagBank = undefined;
	}
	
	this.addRoom = (rm) => {
		rm.idNum = this.rooms.length;
		this.rooms.push(rm);
	}
	
	this.getRoom = (idNum) => {
		for(let x of this.rooms){
			if(x.idNum==idNum){
				return x;
			}
		}
		throw "Room " + idNum + " Does Not Exist!";
	}
}

function room(myLayout){
	this.myLayout = myLayout;
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {
		myLayout.setArea(TL_Corner,areaHeight,areaWidth,withRoomTiles);
	}
	
	this.getTile = (xCoord,yCoord) => {
		return myLayout.tiles[yCoord][xCoord];
	}
	
	this.render = () => {
		return myLayout.render();
		//return "https://cdn.shopify.com/s/files/1/0115/9974/0987/products/Checkerboard-pattern_800x.png?v=1554920887";
	}
}

function roomGridLayout(height,width){
	this.height = height;
	this.width = width;
	this.tiles = [];
	
	var tempyTileHold = [];
	for(let x = 0; x < this.width; x++){
		tempyTileHold.push(new roomTile());
	}
	for(let x = 0; x < this.height; x++){
		this.tiles.push(tempyTileHold.slice());
	}
	
	this.setArea = (TL_Corner,areaHeight,areaWidth,withRoomTiles) => {
		//this.tiles[TL_Corner[0]][TL_Corner[1]]=withRoomTiles;
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
	//this.makesConnection = false;
	this.picture = "https://cdn.shopify.com/s/files/1/0115/9974/0987/products/Checkerboard-pattern_800x.png?v=1554920887";
	//this.connectTo = undefined;
	
	this.setPicture = (pic) => {
		this.picture = pic;
	}
	
	this.render = () => {
		return this.picture;
	}
}

var defaultWalkableTile = new roomTile(true);
var defaultUnwalkableTile = new roomTile();
defaultUnwalkableTile.setPicture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEUAAADtAACaAAD1AADyAADwAAD4AABaBATMBARaAADMAAD7AAD/AACaAwPPBARVAAB4BARTBATSAAC3AgJkFb75AAAChklEQVR4nO2ay47CMBAEnTgxBIeAw///60ps/IjEFdEj15xWoz50SUgw3nJDGX9xZcYpb+dr3bpgMOwgVCwNIYT6pSGEUL80hGdCX2ZNTTrmbdia8Gow7C5l0uuWZ7+nsn7udZ3shW8t7G2aj/Fj3T5C3s7RYHg+Ec75gzw16cWXT30wGB4gVCwNIYT6pSHsmXD30zGh/faMeTutBsOTG+vcx0/zeWsn7CpsbH/Fhrz1p5+8BsMdXE8QKpaGEEL90hD2RlgfNEKb9nk7td+e0WDYXctsz8dyzOO+le0r5e2SNnvhpYXdQ35wjM2v2NS8ThoM+5bQykHEfQihfmkIIdQvDWHPhHsMx6yn3wehrA2Gg6t/nv5jXCLx9MhlMNzB9QShYmkIIdQvDSGE+qUx9zD35GU8zL2e70MrpSGEUL80hD0TWpHxMPcw9/7T0gcR9yGE+qUhhFC/NISYe/IyHuYe5p5+aQgh1C8NIYT6pSHE3HuPtoyHudfbfQihYmkIIdQvDWFvhPXJxo6Mh7mHuTeoH0TchxDql4YQQv3SEGLu/cav+14Yc0/yIOI+hFC/NIQQ6peGEHNPXsbD3MPc0y8NIYT6pSGEUL80hJh779GW8TD3ersPIVQsDSGE+qUh7I2wPtnYkfEw9zD3BvWDiPsQQv3SEEKoXxpCzL3f+HXfC2PuSR5E3IcQ6peGEEL90hBi7snLeJh7mHv6pSGEUL80hBDql4YQc+892jIe5l5v9yGEiqUhhFC/NIS9EdYnGzsyHuYe5t6gfhBxH0KoXxpCCPVLQ4i59xu/7nthzD3Jg4j7EEL90hBCqF8aQsw9eRkPcw9zT780hBDql4YQQv3SEPZG+AenXX6wxadwpwAAAABJRU5ErkJggg==");
var defaultDoorTile = new roomTile(true);
defaultDoorTile.setPicture("https://ih1.redbubble.net/image.548097730.1221/flat,1000x1000,075,f.u1.jpg");
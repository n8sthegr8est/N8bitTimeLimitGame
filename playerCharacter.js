//This object keeps track of the player's position, orientation, health, movement, and other such things.
function playerCharacter(){
	this.imgaddr = "https://image.flaticon.com/icons/png/512/37/37232.png";//the image of the player character. Is a temporary placeholder for now.
	this.positionX = Player_Start_Posit[0]*parseInt(Tile_Default_Width);//the actual position of the player on the screen (X-coordinate)
	this.positionY = Player_Start_Posit[1]*parseInt(Tile_Default_Height);//the actual position of the player on the screen (Y-coordinate)
	this.tilePositionX = Player_Start_Posit[0];//The position of the player on the map in memory, equal to the number of tiles from the room's left side
	this.tilePositionY = Player_Start_Posit[1];//The position of the player on the map in memory, equal to the number of tiles from the room's top side
	this.healthPoints = Player_Start_Health;//the current health of the player
	this.frozen = false;
	
	addListenerEvent(document,"keydown",(e) => {//this event enables the player to move with the arrow keys
		e = e || window.event;//this line ensures cross-browser compatibility.
		this.move(e);//calls the move function when input is received
	});
	
	this.render = () => {//returns the image of the player
		return "<img src=\"" + this.imgaddr + "\" style=\"width:" + Tile_Default_Width + ";height:" + Tile_Default_Height + ";\"></img>";
	}
	
	this.move = (e) => {//moves the player around the screen
	if(!this.frozen){
		var moved = false;//used to determine if the player actually moved or not. This is to avoid events firing from the same space.
		if(e.code == "ArrowLeft" && currentRoom.getTile(this.tilePositionX-1,this.tilePositionY).isWalkable){ //these if statements check which button was pressed and if the tile in that direction is a valid tile to move to.
			this.positionX -= parseInt(Tile_Default_Width);//if the above is true, move the player to the left
			this.tilePositionX -= 1;
			moved = true;//we did move this time
		}
		else if(e.code == "ArrowRight" && currentRoom.getTile(this.tilePositionX+1,this.tilePositionY).isWalkable){//see above
			this.positionX += parseInt(Tile_Default_Width);//if the above is true, move the player to the left
			this.tilePositionX += 1;
			moved = true;//we did move this time
		}
		else if(e.code == "ArrowUp" && currentRoom.getTile(this.tilePositionX,this.tilePositionY-1).isWalkable){//see above
			this.positionY -= parseInt(Tile_Default_Height);//if the above is true, move the player to the left
			this.tilePositionY -= 1;
			moved = true;//we did move this time
		}
		else if(e.code == "ArrowDown" && currentRoom.getTile(this.tilePositionX,this.tilePositionY+1).isWalkable){//see above
			this.positionY += parseInt(Tile_Default_Height);//if the above is true, move the player to the left
			this.tilePositionY += 1;
			moved = true;//we did move this time
		}
		var x = document.getElementById("player");//get the player object in the document
		x.getElementsByTagName("img")[0].style.left = this.positionX + "px";//get the player image within the player object, and set it to the proper position
		x.style.top = this.positionY + "px";//set the player object to the proper position
		if(moved){//if we actually moved do the following
			checkForAndRunEvents(this.tilePositionX,this.tilePositionY);//run any events on this tile.
			if(currentRoom.getTile(this.tilePositionX,this.tilePositionY).isDamaging){//if the tile is damaging, do the following
				this.hurt(1);//lose 1 hp.
			}
		}
	}
	}
	
	this.setPosition = (pos) => {//this sets the player's position to a point on the screen. Mostly used by events
		this.tilePositionX = pos[0];//set the position in memory
		this.tilePositionY = pos[1];
		this.positionX = this.tilePositionX * parseInt(Tile_Default_Width);//based on the memory, set the actual screen position
		this.positionY = this.tilePositionY * parseInt(Tile_Default_Height);
		var x = document.getElementById("player");//get the player object in the document
		x.getElementsByTagName("img")[0].style.left = this.positionX + "px";//get the player image within the player object, and set it to the proper position
		x.style.top = this.positionY + "px";//set the player object to the proper position
	}
	
	this.getPosition = () => {//this reads the player's current position on the screen.
		return [this.tilePositionX,this.tilePositionY];
	}
	
	this.heal = (amount) => {//this restores an amount of health points to the player
		this.healthPoints += amount;
		showCurrentHealth();
	}
	
	this.hurt = (amount) => {//this removes an amount of health points from the player
		this.healthPoints -= amount;
		showCurrentHealth();
	}
	
	this.freeze = () => {//disables player movement
		this.frozen = true;
	}
	
	this.unFreeze = () => {//enables player movement
		this.frozen = false;
	}
}
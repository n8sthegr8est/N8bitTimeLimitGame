function playerCharacter(){
	this.imgaddr = "https://image.flaticon.com/icons/png/512/37/37232.png";
	this.positionX = Player_Start_Posit[0]*parseInt(Tile_Default_Width);
	this.positionY = Player_Start_Posit[1]*parseInt(Tile_Default_Height);
	this.tilePositionX = Player_Start_Posit[0];
	this.tilePositionY = Player_Start_Posit[1];
	this.healthPoints = Player_Start_Health;
	addListenerEvent(document,"keydown",function(e){
		e = e || window.event;
		player.move(e);
	});
	
	this.render = () => {
		return "<img src=\"" + this.imgaddr + "\" style=\"width:" + Tile_Default_Width + ";height:" + Tile_Default_Height + ";\"></img>";
	}
	
	this.move = (e) => {
		var moved = false;
		if(e.code == "ArrowLeft" && currentRoom.getTile(this.tilePositionX-1,this.tilePositionY).isWalkable){ //&& BigRoomDatabase.getRoom(0,0).getTile(this.tilePositionX-1,this.tilePositionY).isWalkable){
			this.positionX -= parseInt(Tile_Default_Width);
			this.tilePositionX -= 1;
			moved = true;
		}
		else if(e.code == "ArrowRight" && currentRoom.getTile(this.tilePositionX+1,this.tilePositionY).isWalkable){
			this.positionX += parseInt(Tile_Default_Width);
			this.tilePositionX += 1;
			moved = true;
		}
		else if(e.code == "ArrowUp" && currentRoom.getTile(this.tilePositionX,this.tilePositionY-1).isWalkable){
			this.positionY -= parseInt(Tile_Default_Height);
			this.tilePositionY -= 1;
			moved = true;
		}
		else if(e.code == "ArrowDown" && currentRoom.getTile(this.tilePositionX,this.tilePositionY+1).isWalkable){
			this.positionY += parseInt(Tile_Default_Height);
			this.tilePositionY += 1;
			moved = true;
		}
		var x = document.getElementById("player");
		x.getElementsByTagName("img")[0].style.left = this.positionX + "px";
		x.style.top = this.positionY + "px";
		if(moved){
			checkForAndRunEvents(this.tilePositionX,this.tilePositionY);
		}
	}
	
	this.setPosition = (pos) => {
		this.tilePositionX = pos[0];
		this.tilePositionY = pos[1];
		this.positionX = this.tilePositionX * parseInt(Tile_Default_Width);
		this.positionY = this.tilePositionY * parseInt(Tile_Default_Height);
		var x = document.getElementById("player");
		x.getElementsByTagName("img")[0].style.left = this.positionX + "px";
		x.style.top = this.positionY + "px";
	}
	
	this.heal = (amount) => {
		this.healthPoints += amount;
	}
	
	this.hurt = (amount) => {
		this.healthPoints -= amount;
	}
}
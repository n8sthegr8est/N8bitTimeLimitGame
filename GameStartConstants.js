//timer and time limit set up
var Time_Limit = 540;//540 in-game minutes, or 9 in-game hours
var Hour_Of_Game_Start = 9;//game starts at 9 PM
var Minute_Of_Game_Start = 0;//game starts at 9:00 PM sharp
var Day_Half_Of_Game_Start = "PM";//Game starts in PM hours
var Check_Winnability_Interval = 10;//Game checks whether it has reached a state of unwinnability every 10 in-game minutes. If it is unwinnable, the player can only get a bad ending, or the out-of-time ending

//action time penalties
var Room_Transfer_Penalty = 1;//1 minute lost for each room entered with a few exceptions.
var Inspection_Penalty = 1;//1 minute lost for inspecting a selectable object. attempting to inspect "nothing of interest" has no penalty.
var Take_Penalty = 0;//picking up an item is a free action.
var Place_Penalty = 0;//putting down an item is a free action.
var Talk_Penalty = 0;//talking is a free action. This applies to single lines of dialogue, not conversations.
var Converse_Penalty = 1;//multiple choice conversations add 1 minute for each choice.
var End_Converse_Penalty = 0;//ending a conversation is a free action.
var Base_Crafting_Penalty = 2;//The base penalty for crafting an item is 2 minutes

//Boss related time penalties
//Bosses are a special case where their rooms are immune to action time penalties. All actions are free, and the boss adds a fixed amount of time. The only exception is that crafting is not allowed in boss rooms.
var Boss_Win_Penalty = 10;//a boss costs 10 minutes to defeat.
var Boss_Lose_Penalty = 40;//a boss costs 40 minutes to lose against. 


//Image scaling
var Tile_Default_Width = "32px";
var Tile_Default_Height = "32px";

//Start positioning and room
var Player_Start_Room = [0,0];//[roomGroup,room]
var Player_Start_Posit = [1,1];//[x-coord,y-coord]

//Player Starting stats
var Player_Start_Health = 15;

//Complex Mechanic Equations
/*function getCraftingTime(complexity,intelligence){
	var finalTime = (2*(complexity/intelligence))+Base_Crafting_Penalty;
	return finalTime;
}*/
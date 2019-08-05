//room and current location logic
var BigRoomDatabase = new roomDatabase();
var currentRoom;
var currentRoomMem;

//all flags to keep track of game progress and to determine ending
var globalFlagBank = new flagBank();
globalFlagBank.instantiateFlag("timeIsUp",false);

//the time that has passed in the game, and how much is left
var timeKeeper = new TimeStorage(Time_Limit);
timeKeeper.startTime();

//the database of tile or action related events
var allGameEvents = new GameEventsDatabase();

//the object that keeps track of the player's current location
var player = new playerCharacter();

//var myTimerEvent = setInterval(timeKeeper.elapseTimeByEvent.bind(this,1),60000);
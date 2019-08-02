var BigRoomDatabase = new roomDatabase();
var currentRoom;
var currentRoomMem;

var globalFlagBank = new flagBank();
globalFlagBank.instantiateFlag("timeIsUp",false);

var timeKeeper = new TimeStorage(Time_Limit);
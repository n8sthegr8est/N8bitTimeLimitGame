function TextBoxShowcase(){//this function is used to show text boxes in the game
	this.currentTextBox = undefined;//this will be the text box to show
	this.timesRun = 0;//this is used to run the typing animation
	this.tbArea = document.getElementById("textboxArea");//this is the web page element that will display the text box.
	this.isTyping = false;//this is used to determine if the box currently showing is running the typing animation.
	this.myTextReveal = undefined;//this is used to run the typing animation
	this.myCloseBoxTimeoutMemory = undefined;//this is used to close a timed text box
	this.closeTextAfter = -1;//this is used to determine how long to show a timed text box before closing it
	this.textboxShowing = false;//this is used to determine if a text box is currently showing
	this.textboxType = undefined;//this is used to determine how the text box is closed.
	addListenerEvent(document,"keypress",(e) => {//this adds the event listener for text box interaction.
		e = e || window.event;
		this.myListenerFunction(e);
	});
	
	this.setCurrentTextBox = (currentTextBox) => {//this sets what text box will be displayed next time a text box is shown
		this.currentTextBox = currentTextBox;
	}
	
	this.showUntilInput = () => {//this is used to show the currentTextBox in an "Input_Exit" type, meaning it stays on screen forever until the user inputs "z"
		clearTimeout(this.myCloseBoxTimeoutMemory);//cancel the auto close timer if any text box previously shown had one set (a "Time_Exit" text box that hadn't yet closed would auto close this box if we didn't)
		clearInterval(this.myTextReveal);//if the previous text box was still typing, clear the interval to prevent the animations overlapping.
		this.textboxType = "Input_Exit";//tell the game that this is an "Input_Exit" type box.
		this.tbArea = document.getElementById("textboxArea");//make sure we get our web page element, since this script loads before the page, thus it's undefined at first.
		player.freeze();//freeze player movement controls (may remove this)
		this.textboxShowing = true;//tell the game that a text box is currently being shown.
		this.tbArea.style.display="block";//show the text box
		this.timesRun = 0;//set this to 0 to properly run the typing animation.
		this.isTyping = true;//tell the game that the current text box is running the typing animation
		this.myTextReveal = setInterval(this.doTextTyping.bind(this),10);//run the typing animation
	}
	
	this.showForSeconds = (sec) => {//this is used to show the currentTextBox in a "Time_Exit" type, meaning it stays on the screen for a limited time and ignores user input
		clearTimeout(this.myCloseBoxTimeoutMemory);//cancel the auto close timer any text box previously shown had one set (a "Time_Exit" text box that hadn't yet closed would auto close this box if we didn't)
		clearInterval(this.myTextReveal);//if the previous text box was still typing, clear the interval to prevent the animations overlapping.
		this.textboxType = "Time_Exit";//tell the game that this is an "Time_Exit" type box.
		this.tbArea = document.getElementById("textboxArea");//make sure we get our web page element, since this script loads before the page, thus it's undefined at first.
		this.textboxShowing = true;//tell the game that a text box is currently being shown.
		this.tbArea.style.display="block";//show the text box
		this.timesRun = 0;//set this to 0 to properly run the typing animation.
		this.isTyping = true;//tell the game that the current text box is running the typing animation
		this.myTextReveal = setInterval(this.doTextTyping.bind(this),10);//run the typing animation
		this.closeTextAfter = sec*1000;//define the amount of time to pass before auto close (auto close timer starts after typing animation)
	}
	
	this.doTextTyping = () => {//this is the function that runs the typing animation
		if(this.timesRun < this.currentTextBox.txt.length){//if this iterator is less than the length of the text of the current box, do the following
			var textToShow = this.currentTextBox.txt.substring(0,this.timesRun+1);//show that number of characters from the text
			textToShow = this.currentTextBox.applyTags(textToShow);
			this.tbArea.innerHTML = textToShow;
			this.timesRun++;//iterate the iterator.
		}
		else{//otherwise (text is fully typed out)
			clearInterval(this.myTextReveal);//stop the typing animation
			this.isTyping = false;//tell the game that the current text box is not running the typing animation.
			if(this.closeTextAfter>-1){//if this is a "Time_Exit" type box, this number will be greater than -1, so set an auto close timer
				this.myCloseBoxTimeoutMemory = setTimeout(this.closeTextBox,this.closeTextAfter);//this sets the timer.
				this.closeTextAfter = -1;//reset the time to -1, since there is a chance a new text box could open before this closes, and it may not need a timer.
			}
		}
	}
	
	this.myListenerFunction = (e) => {//this is the function that reads keyboard input for text boxes
		if(!this.textboxShowing){//if we aren't showing a text box, ignore the input
			return;
		}
		if(this.textboxType=="Time_Exit"){//(otherwise) if the text box being shown is a timed one, ignore the input
			return;
		}
		if(e.code == "KeyZ"){//(otherwise) if the input was the z key, do the following
			if(this.isTyping){//if the text is still typing, cancel the typing animation and show the full text.
				clearInterval(this.myTextReveal);//this stops the typing animation
				var fullText = this.currentTextBox.txt;
				fullText = this.currentTextBox.applyTags(fullText);
				this.timesRun = fullText.length;
				this.tbArea.innerHTML = fullText;//this shows the full text
				this.isTyping = false;//this tells the game that the text box is done typing its text
			}
			else{//otherwise (if the text was already done typing), do the following
				this.closeTextBox();//close the text box
			}
		}
	}
	
	this.closeTextBox = () => {//this closes the shown text box
		player.unFreeze();//if the player's movement control was frozen, unfreeze it (this is likely to be removed)
		this.tbArea.style.display = "none";//hide the text box.
		this.textboxShowing = false;//tell the game that no text box is currently showing
		this.tbArea.innerHTML = "";//remove the text in the box, so it doesn't appear for a split second next time we show a text box.
		this.closeTextAfter = -1;//reset the timer for the next text box.
	}
}

function TextBox(txt){//these are the text boxes shown on screen. It only knows about the text it shows.
	this.myText = new TextBoxText(txt);
	this.txt = this.myText.txtPlain; 
	
	this.applyTags = (txt) => {
		var holdTxt = "";
		var tagNotEnded = false;
		for(i = 0; i < txt.length; i++){
			for(let j of this.myText.txtTags){
				if(i==j.startChar){
					holdTxt += "<span id=\"" + j.tagName + "\">"
					tagNotEnded = true;
				}
				else if(i==j.endChar){
					holdTxt += "</span>";
					tagNotEnded = false;
				}
			}
			if(txt.charAt(i)=='<'){
				holdTxt += "&lt";
			}
			else if(txt.charAt(i)=='>'){
				holdTxt += "&gt";
			}
			else{
				holdTxt += txt.charAt(i);
			}
		}
		if(tagNotEnded){
			holdTxt += "</span>";
		}
		return holdTxt;
	}
}

function TextBoxText(txt){
	this.txtRaw = txt;
	
	this.getPlainText = () => {
		var txtPlain = "";
		var skipTag = false;
		var skipNextChar = false;
		for(let i = 0; i < this.txtRaw.length; i++){
			if(this.txtRaw.charAt(i)=='<'){
				if(this.txtRaw.charAt(i+1)!='!'){
					skipTag = true;
				}
				else{
					txtPlain += '<';
					i++;
					skipNextChar = true;
				}
			}
			else if(this.txtRaw.charAt(i)=='>' && skipTag){
				skipTag = false;
				skipNextChar = true;
			}
			if(!skipTag && !skipNextChar){
				txtPlain += this.txtRaw.charAt(i);
			}
			skipNextChar = false;
		}
		return txtPlain;
	}
	
	this.txtPlain = this.getPlainText();
	
	this.getTags = () => {
		var tagsFound = [];
		var skipNonTag = true;
		var skipNextChar = false;
		var tagName = "";
		var startChar = -1;
		var endChar = -1;
		var charInPlainText = 0;
		var countCharsInPlainText = true;
		/*var taggedAreaLength = 0;
		var countTaggedAreaLength = false;*/
		for(let i = 0; i < this.txtRaw.length; i++){
			if(this.txtRaw.charAt(i)=='<' && this.txtRaw.charAt(i+1)!='!'){
				skipNonTag = false;
				skipNextChar = true;
				if(startChar==-1){
					startChar = charInPlainText;
					countCharsInPlainText = false;
				}
				else{
					endChar = charInPlainText;
					tagsFound.push(new TextBoxTextTag(tagName, startChar, endChar));
					i += tagName.length+1;
					tagName = "";
					startChar = -1;
					endChar = -1;
					countCharsInPlainText = false;
				}
			}
			else if(this.txtRaw.charAt(i)=='>' && !skipNonTag){
				skipNonTag = true;
				countCharsInPlainText = true;
				skipNextChar = true;
				//endChar = i;
				//tagsFound.push(new TextBoxTextTag(tagName,startChar,endChar));
				//tagName = "";
			}
			if(!skipNonTag && !skipNextChar){
				tagName += this.txtRaw.charAt(i);
			}
			if(countCharsInPlainText && !skipNextChar){
				charInPlainText++;
			}
			skipNextChar = false;
		}
		return tagsFound;
	}
	
	this.txtTags = this.getTags();
	var dummy = 0;
}

function TextBoxTextTag(tagName,startChar,endChar){
	this.tagName = tagName;
	this.startChar = startChar;
	this.endChar = endChar;
}

function TextBoxSequence(txts){
	this.txts = txts;
	this.showLoc;
	this.boxIndex = 0;
	
	this.playSequence = (showLoc) => {
		this.showLoc = showLoc;
		if(this.boxIndex >= this.txts.length){
			document.removeEventListener("keypress",this.myListenerFunction);
		}
		else{
			this.showLoc.setCurrentTextBox(new TextBox(txts[this.boxIndex]));
			this.boxIndex++;
			this.showLoc.showUntilInput();
		}
	}
	
	this.myListenerFunction = (e) => {
		e = e || window.event;
		if(e.code == "KeyZ"){
			if(!this.showLoc.textboxShowing){
				this.playSequence(this.showLoc);
			}
		}
	}
	
	addListenerEvent(document,"keypress",this.myListenerFunction);
}
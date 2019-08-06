function TextBoxShowcase(){
	this.currentTextBox = undefined;
	this.timesRun = 0;
	this.tbArea = document.getElementById("textboxArea");
	this.isTyping = false;
	this.myTextReveal = undefined;
	this.closeTextAfter = -1;
	this.textboxShowing = false;
	this.textboxType = undefined;
	addListenerEvent(document,"keypress",(e) => {
		e = e || window.event;
		this.myListenerFunction(e);
	});
	
	this.setCurrentTextBox = (currentTextBox) => {
		this.currentTextBox = currentTextBox;
	}
	
	this.showUntilInput = () => {
		this.textboxType = "Input_Exit";
		this.tbArea = document.getElementById("textboxArea");
		player.freeze();
		this.textboxShowing = true;
		this.tbArea.style.display="block";
		this.timesRun = 0;
		this.isTyping = true;
		this.myTextReveal = setInterval(this.doTextTyping.bind(this),10);
	}
	
	this.showForSeconds = (sec) => {
		this.textboxType = "Time_Exit";
		this.tbArea = document.getElementById("textboxArea");
		this.textboxShowing = true;
		this.tbArea.style.display="block";
		this.timesRun = 0;
		this.isTyping = true;
		this.myTextReveal = setInterval(this.doTextTyping.bind(this),10);
		//setTimeout(this.closeTextBox,sec*1000);
		this.closeTextAfter = sec*1000;
	}
	
	this.doTextTyping = () => {
		if(this.timesRun < this.currentTextBox.txt.length){
			var textToShow = this.currentTextBox.txt.substring(0,this.timesRun+1);
			this.tbArea.innerHTML = textToShow;
			this.timesRun++;
		}
		else{
			clearInterval(this.myTextReveal);
			this.isTyping = false;
			if(this.closeTextAfter>-1){
				setTimeout(this.closeTextBox,this.closeTextAfter);
			}
		}
	}
	
	this.myListenerFunction = (e) => {
		if(!this.textboxShowing){
			return;
		}
		if(this.textboxType=="Time_Exit"){
			return;
		}
		if(e.code == "KeyZ"){
			if(this.isTyping){
				clearInterval(this.myTextReveal);
				this.tbArea.innerHTML = this.currentTextBox.txt;
				this.isTyping = false;
			}
			else{
				this.closeTextBox();
			}
		}
	}
	
	this.closeTextBox = () => {
		player.unFreeze();
		this.tbArea.style.display = "none";
		this.textboxShowing = false;
		this.tbArea.innerHTML = "";
		this.closeTextAfter = -1;
	}
}

function TextBox(txt){
	this.txt = txt;
}
/**
 *   GameOfLifeJS, version 1.0 beta
 *   Copyright (C) 2006  Alexander Hess
 *
 *   This program is free software; you can redistribute it and/or modify it under
 *   the terms of the GNU General Public License as published by the Free Software Foundation;
 *   either version 2 of the License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 *   without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License along with this program;
 *   if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110, USA
 *
 *   License: http://www.alexsstyle.com/license.txt
 */
 
function Cell() {
}
Cell.prototype = {
	active: false,
	change: function() {
		this.active = !this.active;
	}
};

function CellBox(sizeX, sizeY) {
	if(sizeX && sizeY) {
		this.init(sizeX, sizeY);
	} else {
		this.init(this.x, this.y);
	}
}
CellBox.prototype = {
	box: NaN,
	tmpBox: NaN,
	x: 32,
	y: 32,
	simulating: false,
	counter: NaN,
	nextGeneration: function() {
		var loop = 1;
		
		if(timer) {
			loop = speedInput.value;
		}
		
		for(var l = 0; l < loop; l++) {
			this.fillTmpBox();
			
			for(var i = 0; i < this.tmpBox.length; i++) {
				for(var j = 0; j < this.tmpBox[i].length; j++) {
					this.checkCell(i, j);
				}
			}
			
			this.counter++;
		}
			
		generator.updateField(this.box);
		
		return this.counter;
	},
	init: function(boxX, boxY) {
		this.counter = 0;
		this.box = new Array();
		
		for(var i = 0; i < boxX; i++) {
			this.box[i] = new Array();
			
			for(var j = 0; j < boxY; j++) {
				this.box[i][j] = new Cell();
			}
		}
	},
	checkCell: function(posX, posY) {
		var count = 0;
		
		for(var i = posX-1; i <= posX+1; i++) {
			for(var j = posY-1; j <= posY+1; j++) {
				var newX = this.realX(i);
				var newY = this.realY(j);
				
				if(!(i == posX && j == posY)) {
					if(this.tmpBox[newX][newY].active) {
						count++;
					}
				}
			}
		}
		
		if((count == 2 && this.tmpBox[posX][posY].active) || count == 3) {
			this.box[posX][posY].active = true;
		} else {
			this.box[posX][posY].active = false;
		}
	},
	realX: function(given) {
		if(given == -1) {
			given = this.tmpBox.length - 1;
		} else if(given == this.tmpBox.length) {
			given = 0;
		}
		
		return given;
	},
	realY: function(given) {
		if(given == -1) {
			given = this.tmpBox[0].length - 1;
		} else if(given == this.tmpBox[0].length) {
			given = 0;
		}
		
		return given;
	},
	fillTmpBox: function() {
		this.tmpBox = new Array();
		
		for(var i = 0; i < this.box.length; i++) {
			this.tmpBox[i] = new Array();
		
			for(var j = 0; j < this.box[i].length; j++) {
				this.tmpBox[i][j] = new Cell();
				this.tmpBox[i][j].active = this.box[i][j].active;
			}
		}
	},
	save: function() {
		var saveWindow = window.open("", "Test", "height = 500px, width = 500px");
		var saveWindowDocument = saveWindow.document;
		
		saveWindowDocument.writeln("<html version=\"-//W3C//DTD HTML 4.01 Transitional//EN\">");
		saveWindowDocument.writeln("	<head>");
		saveWindowDocument.writeln("		<title></title>");
		saveWindowDocument.writeln("	</head>");
		saveWindowDocument.writeln("	<body style=\"font-size: 12px; font-family: fixedsys, serif; margin: 0em; padding: 0em;\">");
		
		saveWindowDocument.writeln("		<div style=\"height: 500px; width: 500px; overflow: auto;\">");
		
		saveWindowDocument.writeln("			&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;<br />");
		saveWindowDocument.writeln("			&lt;gol generations=\"" + this.counter + "\"&gt;<br />");
		
		for(var i = 0; i < this.box.length; i++) {
			for(var j = 0; j < this.box[i].length; j++) {
				saveWindowDocument.writeln("				&nbsp;&nbsp;&nbsp;&nbsp;&lt;cell x=\"" + i + "\" y=\"" + j + "\" active=\"" + this.box[i][j].active + "\" /&gt;<br />");
			}
		}
		
		saveWindowDocument.writeln("			&lt;/gol&gt;");
		saveWindowDocument.writeln("		</div>");
		
		saveWindowDocument.writeln("	</body>");
		saveWindowDocument.writeln("</html>");
		
		saveWindowDocument.close();
	},
	findBody: function(nodelist) {
		for(var i = 0; i < nodelist.length; i++) {
			var currTagName = nodelist[i].tagName;
			
			if("body" == currTagName) {
				return currTagName;
			}
		}
	}
};

function Generator() {
}
Generator.prototype = {
	generateField: function(destination, box) {
		cellRadios = new Array();
		
		for(var i = 0; i < box.length; i++) {
			cellRadios[i] = new Array();
			
			for(var j = 0; j < box[i].length; j++) {
				cellRadios[i][j] = this.createCell(i, j);
				destination.appendChild(cellRadios[i][j]);
			}
			destination.appendChild(this.createBreak());
		}
	},
	clearField: function() {
		for(var i = 0; i < cellRadios.length; i++) {
			for(var j = 0; j < cellRadios[i].length; j++) {
				cellRadios[i][j].checked = false;
			}
		}
	},
	updateField: function(box) {
		for(var i = 0; i < cellRadios.length; i++) {
			for(var j = 0; j < cellRadios[i].length; j++) {
				cellRadios[i][j].checked = box[i][j].active;
			}
		}
	},
	createCell: function(x, y) {
		var cell = document.createElement("input");
		cell.setAttribute("type","radio");
		
		cell.class = "cell";
		cell.setAttribute("x", x);
		cell.setAttribute("y", y);
		
		cell.onclick = function() {
			var boxX = this.getAttribute("x");
			var boxY = this.getAttribute("y");
			
			cellBox.box[x][y].change();
			this.checked = cellBox.box[x][y].active;
		};
		
		cell.onmouseover = function() {
			if(mousePressed) {
				var boxX = this.getAttribute("x");
				var boxY = this.getAttribute("y");
				
				cellBox.box[x][y].change();
				this.checked = cellBox.box[x][y].active;
			}
		};
		
		return cell;
	},
	createBreak: function(index) {
		var element = document.createElement("br");
		element.class = "break";
		
		return element;
	},
	createOption: function(index, x, y, def) {
		var option = document.createElement("option");
		option.appendChild(document.createTextNode(x + " x " + y));
		
		if(def) {
			option.setAttribute("selected", "selected");
		}
		
		option.value = index;
		
		return option;
	}
};

var fieldSize = new Array();

fieldSize[0] = new Array();
fieldSize[0][0] = 16;
fieldSize[0][1] = 16;
fieldSize[0][2] = false;

fieldSize[1] = new Array();
fieldSize[1][0] = 32;
fieldSize[1][1] = 32;
fieldSize[1][2] = true;

fieldSize[2] = new Array();
fieldSize[2][0] = 64;
fieldSize[2][1] = 64;
fieldSize[2][2] = false;

fieldSize[3] = new Array();
fieldSize[3][0] = 128;
fieldSize[3][1] = 128;
fieldSize[3][2] = false;

fieldSize[4] = new Array();
fieldSize[4][0] = 512;
fieldSize[4][1] = 512;
fieldSize[4][2] = false;

var fieldDiv = NaN;
var timer = NaN;
var cellBox = NaN;
var cellRadios = NaN;
var tLiveCounter = NaN;
var generator = NaN;
var simulationButton = NaN;
var nextButton = NaN;
var clearButton = NaN;
var sizeSelection = NaN;
var speedInput = NaN;
var mousePressed = false;
window.onload = function() {
	tLiveCounter = document.getElementById("counter");
	simulationButton = document.getElementById("simulation");
	clearButton = document.getElementById("clear");
	nextButton = document.getElementById("next");
	sizeSelection = document.getElementById("size");
	fieldDiv = document.getElementById("gameoflife");
	speedInput = document.getElementById("generations");
	
	generator = new Generator();
	
	for(var i = 0; i < fieldSize.length; i++) {
		var currX = fieldSize[i][0];
		var currY = fieldSize[i][1];
		var currDef = fieldSize[i][2];
		
		sizeSelection.appendChild(generator.createOption(i, currX, currY, currDef));
	}
	
	sizeSelection.onchange = function() {
		var really = true;
		
		if(this.value > 2) {
			really = window.confirm("Really want to do that? (can take a while to generate)");
		}
		
		if(really) {
			var selectedX = fieldSize[this.value][0];
			var selectedY = fieldSize[this.value][1];
			
			while(fieldDiv.hasChildNodes()) {
				fieldDiv.removeChild(fieldDiv.childNodes[0]);
			}
			
			cellBox = new CellBox(selectedX, selectedY);
			new Generator().generateField(fieldDiv, cellBox.box);
		} else {
			return false;
		}
	}
	
	speedInput.onchange = function() {
		if(this.value % 2 == 0) {
			alert("You maybe see no changes.");
		}
	}
	
	tLiveCounter.value = "0";
	
	cellBox = new CellBox();
	new Generator().generateField(fieldDiv, cellBox.box);
}

function controllSimulation() {
	if(speedInput.value > 0 && speedInput.value < 10) {
		if(timer) {
			simulationButton.value = "simulate";
			window.clearInterval(timer);
			clearButton.disabled = false;
			nextButton.disabled = false;
			sizeSelection.disabled = false;
			speedInput.disabled = false;
			timer = NaN;
		} else {
			simulationButton.value = "stop";
			clearButton.disabled = true;
			nextButton.disabled = true;
			sizeSelection.disabled = true;
			speedInput.disabled = true;
			timer = window.setInterval("simulate()", 100);
		}
	} else {
		alert("Steps must between 1 and 9.");
	}
}

function simulate() {
	tLiveCounter.value = cellBox.nextGeneration();
}

function cls() {
	tLiveCounter.value = "0";
	cellBox.counter = 0;
	
	for(var i = 0; i < cellBox.box.length; i++) {
		for(var j = 0; j < cellBox.box[i].length; j++) {
			cellBox.box[i][j].active = false;
		}
	}
	
	generator.clearField();
}

document.onmousedown = function() {
	mousePressed = true;
}

document.onmouseup = function() {
	mousePressed = false;
}
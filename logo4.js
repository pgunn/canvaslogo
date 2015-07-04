// -----------------------------------------
window.onload = function()
	{
//	alert("Onload triggered");
	document.getElementById("cmd").onchange = function() {process(); clean();};
	};
// -----------------------------------------

function process()
{ // This is used to process commands the user entered
var cmd = document.getElementById("cmd").value;
// Need to see if we need to scrub this
histadd(cmd);
drawit(cmd);
return;
try
	{ // Hoping the try block will limit scope of a failure
//	drawrandradial(cmd);
	drawit(cmd);
	}
catch(error)
	{
	}
}

// -------------------------------------------
// These manipulate DOM
// -------------------------------------------

function histadd(histline)
{
var histlist = document.getElementById("history");
var newhistelement = document.createElement("LI");
newhistelement.innerHTML = histline;
histlist.appendChild(newhistelement);
}

function histaddcolour(histline, colour)
{
histadd("<span style=\"color:".concat(colour).concat(";\">").concat(histline).concat("</span>"));
}

function histerror(histline)
{
histaddcolour(histline, "red");
}

function histstatus(histline)
{
histaddcolour(histline, "green");
}

function clean()
{ // We back out of a form submit partway through, and so need some cleanup.
document.getElementById("cmd").value = "";
}

// -------------------------------------------------------
// Drawing code

var posx = 200; // Yes, probably should not hardcode this.
var posy = 200; // ok for a proof of concept though.
var pen_on = true;
var angledegree = 0;

// commands:
// pen_off
// pen_on
// move [distance]
// rotate [degrees]


function drawit(cmd)
{ // Given a command to draw, actually manipulate the canvas accordingly
  // mainly a command parser
// histadd("entered drawit()");
var cmdparts = cmd.split(" ");
if(cmdparts.length == 0)
	{
	histstatus("EMPTY COMMAND");
	}
else if((cmdparts.length == 1) && (cmdparts[0] == "pen_off"))
	{
	pen_on = false;
	histstatus("OK");
	}
else if((cmdparts.length == 1) && (cmdparts[0] == "pen_on"))
	{
	pen_on = true;
	histstatus("OK");
	}
else if((cmdparts.length == 2) && (cmdparts[0] == "move"))
	{ // This is where the real work happens
	var power = parseInt(cmdparts[1]);
	if(isNaN(power))
		{
		histerror("BADNUM");
		return;
		}
	if(isNaN(angledegree))
		{histerror("INTERNAL ERROR adeg NaN WTF");return;}

	var ymot=Math.sin(angledegree*Math.PI/180);
	var xmot=Math.cos(angledegree*Math.PI/180);
	if(isNaN(xmot))
		{histerror("INTERNAL ERROR xmot NaN");return;}
	if(isNaN(ymot))
		{histerror("INTERNAL ERROR ymot NaN");return;}

	var newx = posx + (xmot*power);
	var newy = posy + (ymot*power);
	// For this we assume that if it hits the edge it slides along it
	if(newx > 399) {newx = 399;}
	if(newy > 399) {newy = 399;}
	if(newx < 0) {newx = 0;}
	if(newy < 0) {newy = 0;}
		// We're ready to draw!
	if(pen_on)
		{
		var canvas = document.getElementById("drawhere");
		var cc = canvas.getContext("2d");
		cc.beginPath();
		cc.moveTo(posx,posy);
		cc.lineTo(newx, newy);
		cc.stroke();
		}
		// And now let's record our new position
	posx = newx;
	posy = newy;
	histstatus("OK"); // .concat(newx).concat(",").concat(newy));
	}
else if((cmdparts.length == 2) && (cmdparts[0] == "rotate"))
	{
	var angle = parseInt(cmdparts[1]);
	if(isNaN(angle))
		{
		histerror("BADNUM");
		return;
		}
	angledegree += angle;
	angledegree %= 360; // Hoping JS defines modulus of
					// negative numbers more consistently
					// than C does
	if(angledegree < 0)
		{angledegree = 360 + angledegree;}
	histstatus("OK");
	document.getElementById("Angle").textContent = angledegree;
	}
else
	{
	histerror("SIGNOPARSE");
	}
}


// -------------------------------------------------------
// Simple drawing test code below
function randint(low,high)
{ // Quick, dirty, and possibly wrong.
var scalef = high - low;
var scaled = Math.random()*scalef;
return 1 + Math.floor(scaled+low);
}

function drawrandradial(cmd)
{ // Sample function to test drawing
var canvas = document.getElementById("drawhere");
var cc = canvas.getContext("2d");
cc.beginPath();
cc.moveTo(200,200);
cc.lineTo(randint(1,400), randint(1,400));
cc.stroke();
histadd("Drawn");
}



// Shuffle Function
function shuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// 
for (var i = 0; i < data.length; i++) {

	var raw = [
		{'ans':data[i].ans1,'correct':'correct'},{'ans':data[i].ans2,'correct':''},{'ans':data[i].ans3,'correct':''},{'ans':data[i].ans4,'correct':''}
	];
	
	// scramble the answers
	shuffle(raw)

	// set content to have answers in them
	var content = '<div class="rowDOE full-size-blocks" ><div class="large-12 columnsDOE sub-blocks-full map-image"><div class="inner-text q-number">' + (i + 1) +
	'.</div></div></div><div class="rowDOE"><div class="large-12 medium-12 small-12"><div class="question subheadline"><p>' +
	data[i].question +
	'</p></div><div class="rowDOE"><div class="small-12 small-centered columnsDOE"><div class="rowDOE answers_block"><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE '+ raw[0].correct +'"><p>' +
	raw[0].ans +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE '+ raw[1].correct +'"><p>' +
	raw[1].ans +
	'</p></div></div></div></div><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE '+ raw[2].correct +'"><p>' +
	raw[2].ans +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE '+ raw[3].correct +'"><p>' +
	raw[3].ans +
	'</p></div></div></div></div></div></div></div></div><div class="large-12 tweener"></div></div>'

	//add content with shuffled answers to the DOM
	$( "#questions-container" ).append( $(content) );
};


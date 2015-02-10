// some variables
var NumOfQuestions = data.length;

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
	var content = '<div class="question-individual"><div class="rowDOE full-size-blocks" ><div class="large-12 columnsDOE sub-blocks-full map-image"><div class="inner-text q-number">' + (i + 1) +
	'.</div></div></div><div class="rowDOE"><div class="large-12 medium-12 small-12"><div class="question subheadline"><p>' +
	data[i].question +
	'</p></div><div class="rowDOE"><div class="small-12 small-centered columnsDOE"><div class="rowDOE answers_block"><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered columnsDOE a-bg q' + (i+1) + ' ' + raw[0].correct + '" data-id=' + i + '><p>' +
	raw[0].ans +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered columnsDOE a-bg q' + (i+1) + ' ' + raw[1].correct + '" data-id=' + i + '><p>' +
	raw[1].ans +
	'</p></div></div></div></div><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered columnsDOE a-bg q' + (i+1) + ' ' + raw[2].correct + '" data-id=' + i + '><p>' +
	raw[2].ans +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered columnsDOE a-bg q' + (i+1) + ' ' + raw[3].correct + '" data-id=' + i + '><p>' +
	raw[3].ans +
	'</p></div></div></div></div></div></div></div></div><div class="large-12 tweener"></div></div></div>'

	//add content with shuffled answers to the DOM
			// Can also change image, bind addtiontal context here.
	$( "#questions-container" ).append( $(content) );
};



//////-----------------////////
// Colors based on correct incorrect clicks. Only allow one click per question
// on click do the following
// index += 1 so that after 1 click, no more clicks
// if index == 0 change color else do nothing
// if index == 0 change the final number
// when index of all indexes equals total number of questions  

// array of 0's and iteratate through based on order of questions in the dom.....
var QuestionIndex = [];

for (var k = 0; k < NumOfQuestions; k++) {
	QuestionIndex.push(0);
};

//clicking the first time per question causes a question to be answered. after that it does nothing. (see if statement inside)
$('.a-bg').click(function (e) {
	var current_q = $(this).attr("data-id")

	if (QuestionIndex[current_q] === 0) {
		//should be first click
		$(this).addClass('active');
		QuestionIndex[current_q]+=1;
	};
});



// on each click of button, change total correct/incorrect number....use that as a trigger






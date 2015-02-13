// some variables
var NumOfQuestions = data.length;
var QuestionIndex = []; // array of 0's and iteratate through based on order of questions in the dom.....
var TotalAnswered = 0; //begin with 0 answered questions
var TotalCorrect = 0;

// Shuffle Function
function shuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// loop through the questions
for (var i = 0; i < data.length; i++) {

	var raw = [
		{'ans':data[i].ans1,'correct':'correct'},{'ans':data[i].ans2,'correct':''},{'ans':data[i].ans3,'correct':''},{'ans':data[i].ans4,'correct':''}
	];
	
	// scramble the answers
	shuffle(raw)

	// set content to have answers in them		
		// header image conditional
		if (data[i].img === "") {
			var headImg =  "";
		} else {
			var headImg =  '<img src="' + data[i].img + '">'		
		};

		// context info conditional
		if (data[i].cont === "") {
			var contInfo = "";
		} else {
			var contInfo = '<div id="c' + i + '" class="rowDOE context-container"><div class="context-info"><p>' +
			data[i].cont +
			'</p></div></div>';
		};
	
	var content2 = '<div data-id="' + i + '" id="question' + (i+1) + '" class="question-individual"><div class="question subheadline"><p>' +
	(i + 1) +
	'. ' +
	data[i].question +
	'</p></div><div class="rowDOE full-size-blocks"><div class="large-12 columnsDOE map-image">' +
	headImg +
	'</div></div><div class="answers"><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options first-c"><div class="large-12 medium-12 small-12 small-centered a-bg q' + (i+1) + ' ' + raw[0].correct + '" data-id=' + i + '><p>' +
	raw[0].ans + 
	'</p></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="large-12 medium-12 small-12 small-centered a-bg q' + (i+1) + ' ' + raw[1].correct + '" data-id=' + i + '><p>' +
	raw[1].ans +
	'</p></div></div></div><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="large-12 medium-12 small-12 small-centered a-bg q' + (i+1) + ' ' + raw[2].correct + '" data-id=' + i + '><p>' +
	raw[2].ans +
	'</p></div></div><div class="medium-6 small-12 columnsDOE a-options last-c"><div class="large-12 medium-12 small-12 small-centered a-bg q' + (i+1) + ' ' + raw[3].correct + '" data-id=' + i + '><p>' +
	raw[3].ans +
	'</p></div></div></div></div>' +
	contInfo +
	'<div class="rowDOE"><div class="large-12 tweener"></div></div></div>';

	//add content with shuffled answers to the DOM
			// Can also change image, bind addtiontal context here.
	$( "#questions-container" ).append( $(content2) );
};

//////-----------------////////
// Colors based on correct incorrect clicks. Only allow one click per question
// on click do the following
// index += 1 so that after 1 click, no more clicks
// if index == 0 change color else do nothing
// if index == 0 change the final number
// when index of all indexes equals total number of questions  

for (var k = 0; k < NumOfQuestions; k++) {
	QuestionIndex.push(0);
};

//clicking the first time per question causes a question to be answered. after that it does nothing. (see if statement inside)
$('.a-bg').click(function (e) {
	e.preventDefault();
	var current_q = $(this).attr("data-id")

	var qn = (parseInt(current_q)  + 1);

	if (QuestionIndex[current_q] === 0) {
		//should be first click
		$(this).addClass('active');
		QuestionIndex[current_q]+=1;

		if ($(this).hasClass('correct')) {
			TotalCorrect+=1;
		} else {
			$(".correct.q" + qn).addClass('inactive');
		};
		
		// Results go up one number
		$('#results').html("<h1>" + TotalCorrect + "/" + NumOfQuestions + "</h1>")

		var cntx = '#c' + current_q;

		$(cntx).addClass('active');

		//Do something when it gets to N questions
		TotalAnswered +=1;
		if (TotalAnswered === NumOfQuestions) {
			$('#result-text').addClass('active');
		};
	};
});



// on each click of button, change total correct/incorrect number....use that as a trigger

(function ($) { 
	$(document).ready(function() { 
		
		// on load, display 0 out of N
		$('#results').html("<h1>" + TotalCorrect + "/" + NumOfQuestions + "</h1>")
	});
}(jQuery));  



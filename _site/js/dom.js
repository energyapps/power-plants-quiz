// context info conditional
var contInfo = '<div class="rowDOE context-container"><div class="context-info"><p>' +
// Context info goes here.
'</p></div></div>';

// header image conditional
var headImg =  '<img src="' + data[i].img + '">'

var content = '<div data-id="' + i + '" id="question' + (i+1) + '" class="question-individual"><div class="rowDOE full-size-blocks" ><div class="large-12 columnsDOE sub-blocks-full map-image"><div class="inner-text q-number">' + (i + 1) +
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
	'</p></div></div></div></div></div></div></div></div><div class="large-12 tweener"></div></div></div>';

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



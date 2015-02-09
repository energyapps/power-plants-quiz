for (var i = 0; i < data.length; i++) {
	var content = '<div class="rowDOE full-size-blocks" ><div class="large-12 columnsDOE sub-blocks-full map-image"><div class="inner-text q-number">' + (i + 1) +
	'.</div></div></div><div class="rowDOE"><div class="large-12 medium-12 small-12"><div class="question subheadline"><p>' +
	data[i].question +
	'</p></div><div class="rowDOE"><div class="small-12 small-centered columnsDOE"><div class="rowDOE answers_block"><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE"><p>' +
	data[i].answer +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE"><p>' +
	data[i].ans2 +
	'</p></div></div></div></div><div class="large-6 columnsDOE halves"><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE"><p>' +
	data[i].ans3 +
	'</p></div></div></div><div class="medium-6 small-12 columnsDOE a-options"><div class="rowDOE"><div class="large-11 medium-11 small-11 small-centered a-bg columnsDOE"><p>' +
	data[i].ans4 +
	'</p></div></div></div></div></div></div></div></div><div class="large-12 tweener"></div></div>'

	console.log(content)

	$( "#questions-container" ).append( $(content) );
};

	
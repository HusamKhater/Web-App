////////////////////// ************************************** START OF INDEX1.JS ****************************************** /////////////////////


$(document)
		.ready(
				
				function() {
					


					name = "";			// variable that holds current channel name
						


				//// this functions is used to show the user how much characters left to her user Description
					$('#desc')
							.keyup(
									function() {
										counter = $('#desc').val().length;
										var remaining = 50 - counter;
										$('#desc_feedback')
												.html(
														'<p> <strong>'
																+ remaining
																+ '</strong> charcters remainig </p>');
									});

					$('#desc')
							.focusin(
									function() {
										var remaining = 50 - counter;
										$('#desc_feedback')
												.html(
														'<p> <strong>'
																+ remaining
																+ '</strong> charcters remainig </p>');
									});

					$('#desc').focusout(function() {
						$('#desc_feedback').html('');
					});
					///////// end of user description remain characters

					
					
					

					// divCheckBox2 div contains the search results, so it is shown on clicking on the search bar
					$('#mySearchInput')
							.click(
									function() {
										document.getElementById('divCheckBox2').style.display = "inline";
									});

					
					
					
					$('#mySearchInput')
							.focusin(
									function() {
										document.getElementById('divCheckBox2').style.display = "inline";
									});
					// end of clicking and focusing in search box divCheckBox2

					
					

					/// ******* element that must be hidden on mouse up ************* ///
					// This mouseup function contains a variety of elements that needs to be hidden on clicking on anything else
					// elemnts such as alerts that pups to the user when he does something wrong or to make him notice something
					// divCheckBox2 also is an excellent example to a div that must be hidden when clicking on something else
					$('#divCheckBox2')
							.click(
									function() {
										document.getElementById('divCheckBox2').style.display = "inline";
									});

					$(document).mouseup(function(e) {
						var container = $("#divCheckBox2");

						if (!container.is(e.target) // if the target of the click isn't the container...
								&& container.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container.hide();
						}
						
						var container1 = $("#loginErrorFeedback");

						if (!container1.is(e.target) // if the target of the click isn't the container...
								&& container1.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container1.hide();
						}
						
						var container2 = $("#required_field");

						if (!container2.is(e.target) // if the target of the click isn't the container...
								&& container2.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container2.hide();
						}
						
						var container3 = $("#required_field_username");

						if (!container3.is(e.target) // if the target of the click isn't the container...
								&& container3.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container3.hide();
						}
						
						var container4 = $("#required_field_nickname");

						if (!container4.is(e.target) // if the target of the click isn't the container...
								&& container4.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container4.hide();
						}
						
						var container5 = $("#emptySearchResult");

						if (!container5.is(e.target) // if the target of the click isn't the container...
								&& container5.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container5.hide();
						}
						
						var container6 = $("#cantReplyWhenNotSubscribe");

						if (!container6.is(e.target) // if the target of the click isn't the container...
								&& container6.has(e.target).length === 0) // ... nor a descendant of the container
						{
							container6.hide();
						}
						
						
						
						
					});
					/// ******* end of element that must be hidden on mouse up *************///
					
					
					
					
					
					/////// when registration show the relevant div (greeting) and hide the others
					$("#regBtn").click(function()
							{
								document.getElementById('greetingDiv').style.display = "inline";
								document.getElementById('mychatarea').style.display = "none";
								document.getElementById('replyArea').style.display = "none";
								document.getElementById('ChannelDescriptionDiv').style.display = "none";
							});
					
					//////// same thing when log in
					$(".btn-success").click(function()
					{
						$(this).css("background-color","#c8c2ca");
						$(this).css("border-color","#afabb1");
						document.getElementById('greetingDiv').style.display = "inline";
						document.getElementById('mychatarea').style.display = "none";
						document.getElementById('replyArea').style.display = "none";
						document.getElementById('ChannelDescriptionDiv').style.display = "none";
						
					});
					
					

					 /// relevant to styling the sign in button
					$(".btn-success").focus(function()
					{
						$(this).css("background-color","#afabb1");
						$(this).css("border-color","#afabb1");
						$(this).css("outline", "none");
					});
					
					$(".btn-success").hover(function()
							{
								$(this).css("background-color","#afabb1");
								$(this).css("border-color","#afabb1");
							});
					$(".btn-success").mouseleave(function()
							{
								$(this).css("background-color","#c8c2ca");
								$(this).css("border-color","#afabb1");
							});
					/// end of styling sign in button
					
					
					

					////// ***** channel creation *******/////
					//// this function shows a div that is used for creation a channel
					$('#addIcon').click(function(){
						$('#Search_feedback3').html(
						'<p>click</p>')
						document.getElementById('CreateChannelBox').style.display = "inline";
					});
					

					//// this function hide the div when we press on cancel
					$('#CancelCreation').click(function(){
						$('#Search_feedback4').html(
						'<p>click</p>')
						document.getElementById('CreateChannelBox').style.display = "none";
					});
					
				

					
					

					///// scroll down on submitting
					$("#submitMsgText").click(function(){
						var Chatboxdiv = document.getElementById('MyChatBox');
						Chatboxdiv.scrollTop = Chatboxdiv.scrollHeight;
					});
					

					
});





////this function hide the greeting div and shows the chat area and description area when clicking on a channel
$(document).on("click", "#mychannelname", function(){
	
	var temp = name;
	document.getElementById('greetingDiv').style.display = "none";
	document.getElementById('mychatarea').style.display = "inline";
	document.getElementById('ChannelDescriptionDiv').style.display = "inline";
	
	name = $(this).find("a").text();
	if(temp != name){
		document.getElementById('replyArea').style.display = "none";
	}
	
	
	document.getElementById('MyChatBox').scrollTop = document.getElementById('MyChatBox').scrollHeight + 120000;
	
	

	
});


////this function hide the chatarea div and shows the greeting div if you unsubscribed from the nav bar the current channel that you are watching.
$(document).on("click", "#myunSubscription", function(){

	var a = $(this).find("span").text();
	angular.element($('#myCon')).scope().TryUnsup(a);
	
	var unsubName = $(this).find("span").text();
	
	if(name == null || name == ""){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		
	}

	else if(name == unsubName){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		name = "";
	

	}
	
	else{
	
	}
	
	
});

/////// this function does the same thing as the above
$(document).on("click", "#myunSubscription2", function(){

	var a = $(this).find("span").text();
	angular.element($('#myCon')).scope().TryUnsup2(a);
	
	var unsubName = $(this).find("span").text();
	
	if(name == null || name == ""){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		
	}

	else if(name == unsubName){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		name = "";
	

	}
	
	else{
	
	}
	
	
});






$(document).on("click", "#deleteIcon", function(){
	
	var unsubName = $(this).find("span").text();
	
	if(name == null || name == ""){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		
	}

	else if(name == unsubName){
		document.getElementById('mychatarea').style.display = "none";
		document.getElementById('replyArea').style.display = "none";
		document.getElementById('greetingDiv').style.display = "inline";
		document.getElementById('ChannelDescriptionDiv').style.display = "none";
		name = "";
	

	}
	
	else{
	
	}
	
});




//////this function shows the reply button on the message when hovering on it
$(document).on("mouseenter", "#MessageItselfContainer", function(){
buttonglobal = $(this).find('button');
buttonglobal.show();
});


//////this function hides the reply button on the message when hovering on it 
$(document).on("mouseleave", "#MessageItselfContainer", function(){
buttonglobal.hide();
});


//////this function shows the reply button on the reply when hovering on it
$(document).on("mouseenter", "#ReplyItselfContainer", function(){
buttonglobalreply = $(this).find('button');
buttonglobalreply.show();
});


//////this function shows the reply button on the reply when hovering on it
$(document).on("mouseleave", "#ReplyItselfContainer", function(){
buttonglobalreply.hide();
});

//////hide the divCheckBox2 upon subscription
$(document).on("click", "#mySubscription", function(){

document.getElementById('divCheckBox2').style.display = "none";
});

//////show the reply area and hide the channel description div when clicking on reply
$(document).on("click", "#ReplyToMessageBtn", function(){

document.getElementById('replyArea').style.display = "inline";
document.getElementById('ChannelDescriptionDiv').style.display = "none";

});

////////////////////// ************************************** END OF INDEX1.JS ****************************************** /////////////////////
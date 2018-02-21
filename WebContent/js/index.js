/* Our main application module is defined here using a single controller which will initiate its scope
and define some behavior.
This module further depends on an helper module 'txtHighlight'.
*/



// global variables that used for the nickname and reply content
var variable1 = "";
var variable3 = "";

var app = angular.module('registrationApp',[]);
app.controller('registrationController',['$scope','$http','$window','$timeout', function($scope,$http,$window,$timeout) {
	
	
	
		$scope.replyContent = '';
		$scope.putValueFlag = 0;
		
		// used when we click  in the reply text input, so we put the nickname of the user how we are replying to n the first of the reply content 
		$scope.putValue = function(){
			var nickname = variable1;
			if($scope.putValueFlag == 0 || $scope.replyContent == ''){
			$scope.replyContent = '@' + variable1 + ' ' + $scope.replyContent;
			$scope.putValueFlag = 1;
			}
			
		};
	
	
		// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		
		
		// a script that run once we load the angular, it connect to the check session servlet, that return the attribure username
		// that we saved on the http session when we logged in, if we got any return value except null, that means that we have someone
		// that set the attribute in the session, so we have to refresh the page, and load all the data such as public channels and private channels,
		// image url, nickname, and all the functions that we do when we logged in, in this way we can save the session of the browser
		$scope.S = {
        	};
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/ModifySessionServlet',
    		data : $scope.S
    	}).success(function(response){
    		
    		$scope.userNameFromServlet = response;
    		$scope.userNameFromServlet = $scope.userNameFromServlet[0];
    		if($scope.userNameFromServlet != "NOT_FOUND"){
    		
    			$scope.userL = $scope.userNameFromServlet;
    			
				
				$scope.userr = {
		                "userL": $scope.userNameFromServlet
		            };
				$http({
	        		method : 'POST',
	        		url : 'http://localhost:8080/MyWebProject/FindNicknameServlet',
	        		data : $scope.userr
	        	
	        	}).success(function(response){
	        		$scope.message = response;
	        		$scope.nicknameByUsername = $scope.message;
	        		
	        		
	        		
	        		$scope.userr = {
    		                "userL": $scope.userNameFromServlet
    		            };
    				$http({
    	        		method : 'POST',
    	        		url : 'http://localhost:8080/MyWebProject/FindUrlServlet',
    	        		data : $scope.userr
    	        	
    	        	}).success(function(response){
    	        		$scope.message = response;
    	        		$scope.urlByUsername = $scope.message;
    	        		
    	        		$("#UserImgUrll").attr("src", $scope.urlByUsername);
    	        		
    	        		connect($scope.userL);	
    	        		
    	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
    	        		$scope.changeYourPrivateChannels();
    	        		$scope.first=1;
    					
    	        		
	        		});
	        	});
    			
    		}
    	});
	
	
    	
    	
    // array of the messages id, we used it when we move from reply thread to another reply thread, so we can do backward and know exactly to each
    // we have to return and show its replies
	$scope.globalMessagesId=[];
    
	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	
	// variable used to show and hide the main two parts of the html
	$scope.first=0;

	
	
	// two variables that hold the user name and password on logging in time
	$scope.userL;
	$scope.passL;
	
	// the log in function, takes user name and password, check if its in the system or not, if this user in the system, we have to load
	// his channels, image URL, nickname .. , and we have to move the user to the main UI by changing the hide/show varibale
	$scope.go = function(){
		
		$scope.L = {
            "userL": $scope.userL,
            "passL": $scope.passL
        };
    	
		$('#usernameText').val('');
		$('#passwordText').val('');
  
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/LoginServlet',
    		data : $scope.L
    	
    	}).success(function(response){
    			
    			$scope.message = response;
    			if($scope.message == "LOGIN_SUCCESS"){
    				
    				$scope.userr = {
    		                "userL": $scope.userL
    		            };
    				$http({
    	        		method : 'POST',
    	        		url : 'http://localhost:8080/MyWebProject/FindNicknameServlet',
    	        		data : $scope.userr
    	        	
    	        	}).success(function(response){
    	        		$scope.message = response;
    	        		$scope.nicknameByUsername = $scope.message;
    	        		
    	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
    	        		$scope.changeYourPrivateChannels();
    	        		
    	        		$scope.userr = {
        		                "userL": $scope.userL
        		            };
        				$http({
        	        		method : 'POST',
        	        		url : 'http://localhost:8080/MyWebProject/FindUrlServlet',
        	        		data : $scope.userr
        	        	
        	        	}).success(function(response){
        	        		$scope.message = response;
        	        		$scope.urlByUsername = $scope.message;
        	        		
        	        		$("#UserImgUrll").attr("src", $scope.urlByUsername);
        	        		connect($scope.userL);
        	        		$scope.first=1;
            				
        	        	
    	        		})
    	        	})
    				
    			}else{
    				$('#loginErrorFeedback').css("display","inline-block");
    			}
    		})
    		.error(function(response){
    			
    		})
    	

		
	};
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

	// log out function, used when the user want to exit the App, we remove them from the session and hide the man UI from hem, by moving him to t
	// log in interface
	$scope.LogOut = function(){

		$scope.Lo = {
    		};
		$http({
			method : 'POST',
			url : 'http://localhost:8080/MyWebProject/LogoutServlate',
			data : $scope.Lo
		}).success(function(response){
			
			$scope.first=0;
			logout();
			
		});
	}

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// registration fields, models from the user
	$scope.username;
    $scope.password;
    $scope.nickname;
    $scope.imgUrl;
    $scope.description;
	
    
    // the registration function, it takes the field that the user fills, check if we can create this user or not,
    // if the creation success, we have to move the user to the main UI and do all the functions that we have to do on loging in
    // if the creation fail, we show the user message we the creation failed
    $scope.submit = function(){
    	
    	$scope.user = {
            "username": $scope.username,
            "password": $scope.password,
            "nickname": $scope.nickname,
            "imgUrl": $scope.imgUrl,
            "description": $scope.description
        };
    	
		
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/RegistrationServlet',
    		data : $scope.user
    	
    	}).success(function(response){
    		
    			
    			$scope.message = response;
    			if($scope.message == "REGISTRATION_SUCCESS"){
    				

    	    		
        			$scope.userL = $scope.username;
    				
    				$scope.userr = {
    		                "userL": $scope.username
    		            };
    				$http({
    	        		method : 'POST',
    	        		url : 'http://localhost:8080/MyWebProject/FindNicknameServlet',
    	        		data : $scope.userr
    	        	
    	        	}).success(function(response){
    	        		$scope.message = response;
    	        		$scope.nicknameByUsername = $scope.message;
    	        		
    	        		
    	        		$scope.userr = {
        		                "userL": $scope.username
        		            };
        				$http({
        	        		method : 'POST',
        	        		url : 'http://localhost:8080/MyWebProject/FindUrlServlet',
        	        		data : $scope.userr
        	        	
        	        	}).success(function(response){
        	        		$scope.message = response;
        	        		$scope.urlByUsername = $scope.message;
        	        		
        	        		$("#UserImgUrll").attr("src", $scope.urlByUsername);
        	        		
        	        		connect($scope.userL);
        	        		
        	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
        	        		$scope.changeYourPrivateChannels();
        	        		
        	        		$scope.first=1;
        	        		
    	        		});
    	        	});
        			
        		
    				
    			} else {
    				if($scope.message == "REGISTRATION_FAILED_YOU_MUST_WRITE_SOMETHING" 
    					|| $scope.message == "REGISTRATION_FAILED_NULLNICKNAME"
    					|| $scope.message == "REGISTRATION_FAIL_MISS_REQUIERD_FIELD"){
    					$('#required_field').css("display","inline");
    				}
    				
    				if($scope.message == "REGISTRATION_FAIL_USER_FOUND"){
    					$('#required_field_username').css("display","inline");
    				}
    				
    				if($scope.message == "REGISTRATION_FAILED_USED_NICKNAME"){
    					$('#required_field_nickname').css("display","inline");
    				}
    					
    					
    					
    				
    				
    			}

    		})
    		.error(function(response){
    			
    		})
    	
		
    };
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // creation channel models
    $scope.publicChannelName = '' ;
    $scope.publicChannelDescription = '';
    
    
    // function used once we want to create a public channel, checks if we can create this channel, 
    // on success, we add this channel to the subscribers table with the current user nickname 
    $scope.createChannel = function(){
    	
    	
    	
    	
    	var channelNameLength = $scope.publicChannelName.length;
    	if($scope.publicChannelName[channelNameLength - 1] == '$')
    		{
    		document.getElementById('ChannelCreationAlert').style.display = "inline-block";
    		 var elemnt = $('#ChannelCreationAlert');
			 elemnt.html('<b> Channel name must not end with $ </b>');
    		}
    	
    	else{
    	$scope.channel = {
                "publicChannelName": $scope.publicChannelName,
                "publicChannelDescription": $scope.publicChannelDescription
            };
        	
      
        	$http({
        		method : 'POST',
        		url : 'http://localhost:8080/MyWebProject/PublicChannelCreationServlet',
        		data : $scope.channel
        	
        	}).success(function(response){
        		
        			$scope.message = response;
        			if($scope.message == "CREATION_SUCCESS"){
        			
        				document.getElementById('CreateChannelBox').style.display = "none";
        				document.getElementById('ChannelCreationAlert').style.display = "none";
        				
        					$scope.addedInfo = {
            		                "userN":$scope.nicknameByUsername,
            		                "publicChannelName":$scope.publicChannelName,
            		                "publicChannelDesc":$scope.publicChannelDescription,
            		                "publicChannelNumberOfSub":1
            		            };
        					
        					$http({
            	        		method : 'POST',
            	        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
            	        		data : $scope.addedInfo
            	        	
            	        	}).success(function(response){
            	        		$scope.message = response; 
            	        	
            	        	
            	        		$http.get("http://localhost:8080/MyWebProject/GetAllPublicChannelsServlet") 
            	        		.success(function(response) {
            	        		
            	        		   $scope.records = response;
            	        		
            	        		
            	        		   $http.get("http://localhost:8080/MyWebProject/GetAllSubscribersServlet") 
               	        		.success(function(response) {
               	        		   $scope.records1 = response;
               	        		   
               	        		$scope.publicChannelName = '';
               	        		$scope.publicChannelDescription = '';
               	        		   
               	        		});	
            	        		
            	        		});
            	        	    
            	        		
            	        		
            	        		
            	        		
            	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
            	        	
            	        
        					
        					
        				})
        			}
        			else {
        				document.getElementById('ChannelCreationAlert').style.display = "inline-block";
        				if($scope.message == 'CREATION_FAIL_CHANNEL_NAME_FOUND'){
        					var elemnt = $('#ChannelCreationAlert');
           				 	elemnt.html('<b> Channel name is already used </b>');
        				}
        				else{
        					var elemnt = $('#ChannelCreationAlert');
        					elemnt.html('<b> Channel name and description are required </b>');
        				}
        			} 
        			

        		})
        		.error(function(response){
        			
        		})
    	}
   	
    };
 
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    

    // array of my public channels
    $scope.myPublicChannels=[];
    
    // function that take as parameter the user nickname and return all the public channel that subscribed by the given user
    $scope.changeYourPublicChannels = function(name){
    	
    	
    	$scope.NONAME = {
                "userNickname":name
            };
    	
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetSubscriberOnlyByNicknameServlet',
    		data : $scope.NONAME
    	
    	}).success(function(response){
    		$scope.myPublicChannels1 = response;
    		$scope.myPublicChannels2=[];
    		for( s in $scope.myPublicChannels1){
    			var n = $scope.myPublicChannels1[s].ChannelName.length;
    			
    			if($scope.myPublicChannels1[s].ChannelName.substring((n)-1,n) != '$'){
    				$scope.myPublicChannels2.push($scope.myPublicChannels1[s]);
    			}
    		}
    		
    		$scope.myPublicChannels = $scope.myPublicChannels2;
    	});

    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
    // the search query variable
    $scope.query = "";
    

    
    // a script that runs on angular load, here we are taking all the public channels in the DB
	$http.get("http://localhost:8080/MyWebProject/GetAllPublicChannelsServlet") 
	.success(function(response) {
	   $scope.records = response;
	});
    
	
	// a script that runs on angular load, here we are taking all the subscribers from the subscribers table in the DB
	$http.get("http://localhost:8080/MyWebProject/GetAllSubscribersServlet") 
	.success(function(response) {
	   $scope.records1 = response;
	
	});
	
	
	// two arrays that hold the two search option result, search by channel name and search by user nickname
	$scope.searchResult2 = [];
	$scope.searchResult3 = [];
	
	// search function, function that takes the query from the user and return all the public channels with the given name, 
	// and return all the public channel that the user with the same query subscribed to
    // if no search results, we show the user indicator for that
	$scope.search = function(){
    	
    	if (!$scope.query || $scope.query.length == 0){
		    //initially we show all table data
    		
    		$scope.myFiltered = [];
    		for(g in $scope.records){
    			var fFlag = 0;
    			for(p in $scope.myPublicChannels){
    				if($scope.myPublicChannels[p].ChannelName == $scope.records[g].ChannelName){
    					fFlag =1;
    				}
    			}
    			if(fFlag == 0){
    				$scope.myFiltered.push($scope.records[g]);
    			}
    		}
    		
    		
    		
    		$scope.searchResult = $scope.myFiltered;
    		$scope.searchResult1 = [];
		}else{
			
		    var qstr = $scope.query.toLowerCase();
			$scope.searchResult = [];
			$scope.searchResult1 = [];


			$scope.myFiltered = [];
    		for(g in $scope.records){
    			var fFlag = 0;
    			for(p in $scope.myPublicChannels){
    				if($scope.myPublicChannels[p].ChannelName == $scope.records[g].ChannelName){
    					fFlag =1;
    				}
    			}
    			if(fFlag == 0){
    				$scope.myFiltered.push($scope.records[g]);
    			}
    		}
    		
			$scope.myFiltered1 = [];
    		for(g in $scope.records1){
    			var fFlag = 0;
    			for(p in $scope.myPublicChannels){
    				if($scope.myPublicChannels[p].ChannelName == $scope.records1[g].ChannelName){
    					fFlag =1;
    				}
    			}
    			
    			var lengthhh = $scope.records1[g].ChannelName.length;
    			
    			if(fFlag == 0 && $scope.records1[g].ChannelName[lengthhh-1] != '$'){
    				$scope.myFiltered1.push($scope.records1[g]);
    			}
    		}
    					
    		
			
			
						
			for (x in $scope.myFiltered){
				//check for a match (up to a lowercasing difference)

				if ( $scope.myFiltered[x].ChannelName.toLowerCase().includes(qstr) )
				{
					$scope.searchResult.push($scope.myFiltered[x]); //add record to search result
				}
			}
			
			
			for (t in $scope.myFiltered1){
				
				//check for a match (up to a lowercasing difference)
				if ($scope.myFiltered1[t].Nickname.toLowerCase() == (qstr))
				{
					if( $scope.myFiltered1[t].ChannelName != qstr)
						$scope.searchResult1.push($scope.myFiltered1[t]); //add record to search result
				}
			}
			
			
			
			
	   }
    	$scope.searchResult2 = $scope.searchResult;
		$scope.searchResult3 = $scope.searchResult1;

		
		if($scope.searchResult2.length == 0 && $scope.searchResult3.length == 0){
				document.getElementById('emptySearchResult').style.display = "inline";
				document.getElementById('divCheckBox2').style.display = "none";
			}
//		
		else{
			document.getElementById('emptySearchResult').style.display = "none";
			document.getElementById('divCheckBox2').style.display = "inline";
		}
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	
	
	// function that takes channel name and its description, checks if i can subscribe this channel or i'm subscribed to it before,
	// on success we have to change the number of subscribers to the channel in the DB and and i have to add this channel to my public channel
	// that i am subscribed to
	$scope.TrySub = function(channelName,description){
		
		$scope.IDK = {
                "userNickname":$scope.nicknameByUsername,
                "channelName":channelName
               
		};
		$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
    		data : $scope.IDK
    	
    	}).success(function(response){

    		$scope.message = response;
    		if($scope.message == "FOUND"){
    			
    		}else{
    			
    			$scope.namee = {
    					"channelName":channelName
    			}
    			$http({
	        		method : 'POST',
	        		url : 'http://localhost:8080/MyWebProject/GetPublicChannelByChannelNameServlet',
	        		data : $scope.namee
	        	
	        	}).success(function(response){
	        		
	        		$scope.c = response;
	        		$scope.ChannelResponse = $scope.c[0];
	        		$scope.numberOfS = $scope.ChannelResponse.NumberOfSubscribers;
	        		$scope.nummm = $scope.numberOfS + 1;
	        		
	        		$scope.nnamee = {
	    					"channelName":channelName,
	    					"numberOfSubs":$scope.nummm
	    			}
	        		
	        		
	        		
	    			$http({
		        		method : 'POST',
		        		url : 'http://localhost:8080/MyWebProject/ChangeNumberOfSubscribersOfPublicChannel',
		        		data : $scope.nnamee
		        	
		        	}).success(function(response){
		        		$scope.nr = response;
		        		

		    			$scope.addedInfo = {
				                "userN":$scope.nicknameByUsername,
				                "publicChannelName":channelName,
				                "publicChannelDesc":description,
				                "publicChannelNumberOfSub":$scope.numberOfS 
				            };
						
						$http({
			        		method : 'POST',
			        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
			        		data : $scope.addedInfo}).success(function(response){
				        		$scope.message = response;
				        		
				        		$scope.addedInfo = {
						          
						                "channelName":channelName 
						            };
								
								$http({
					        		method : 'POST',
					        		url : 'http://localhost:8080/MyWebProject/IncNumberOfSubscribersInSubscribersTable',
					        		data : $scope.addedInfo
					        	
					        	}).success(function(response){
					        		
					        		$scope.message = response;
					        		
					        		
					        		$http.get("http://localhost:8080/MyWebProject/GetAllPublicChannelsServlet") 
					        		.success(function(response) {
					        		   $scope.records = response;
					        		   
					        		
					        			$http.get("http://localhost:8080/MyWebProject/GetAllSubscribersServlet") 
						        		.success(function(response) {
						        		   $scope.records1 = response;
							     
					
							        	$scope.changeYourPublicChannels($scope.nicknameByUsername);
				
							        	
							           	$scope.searchResult2 = [];
							    		$scope.searchResult3 = [];
							    		
						        });
			        	
			        	});

		        		
		        		
		        	});
		        	
	      					        	
		      });	
	  	});
	        	    
	        	
	        		

	        		
	        	});
    			
    		} /// end of else 
    
    	});
		
		
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	
	// function that try unsubscribe the current user from the given channel if the user subscribed to it before
	// on success we have to remove this channel from my public channels and to decrement the number of subscribers from the given channel
	$scope.TryUnsup = function(channelName){
		
		$scope.IDK = {
                "userNickname":$scope.nicknameByUsername,
                "channelName":channelName
               
            };
		
		$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
    		data : $scope.IDK
    	
    	}).success(function(response){
    		
    		$scope.message = response;
    		if($scope.message == "FOUND"){
    			
    			
    			$scope.namee = {
    					"channelName":channelName
    			}
    			$http({
	        		method : 'POST',
	        		url : 'http://localhost:8080/MyWebProject/GetPublicChannelByChannelNameServlet',
	        		data : $scope.namee
	        	
	        	}).success(function(response){
	        		$scope.c = response;
	        		$scope.ChannelResponse = $scope.c[0];
	        		$scope.numberOfS = $scope.ChannelResponse.NumberOfSubscribers;
	        		$scope.numm = $scope.numberOfS - 1;
	        	
	    			$scope.nnamee = {
	    					"channelName":channelName,
	    					"numberOfSubs":$scope.numm
	    			}
	    			$http({
		        		method : 'POST',
		        		url : 'http://localhost:8080/MyWebProject/ChangeNumberOfSubscribersOfPublicChannel',
		        		data : $scope.nnamee
		        	
		        	}).success(function(response){
		        		$scope.nr = response;
		        		
		        		
		    			$scope.addedInfo = {
				                "userN":$scope.nicknameByUsername,
				                "publicChannelName":channelName
				            };
						
						$http({
			        		method : 'POST',
			        		url : 'http://localhost:8080/MyWebProject/DeleteSubscriberServlet',
			        		data : $scope.addedInfo
			        	
			        	}).success(function(response){
			        		
			        		$scope.message = response;
			        		
			        		$scope.addedInfo = {
			  			          
					                "channelName":channelName 
					            };
							
							$http({
				        		method : 'POST',
				        		url : 'http://localhost:8080/MyWebProject/DecNumberOfSubscribersInSubscribersTable',
				        		data : $scope.addedInfo
				        	
				        	}).success(function(response){
				        		$scope.message = response;
				        		
				        		
				        		$http.get("http://localhost:8080/MyWebProject/GetAllPublicChannelsServlet") 
				        		.success(function(response) {
				        		   $scope.records = response;
				        		   
				        		   $http.get("http://localhost:8080/MyWebProject/GetAllSubscribersServlet") 
					        		.success(function(response) {
					        		   $scope.records1 = response;
					        	
						        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
						        		$scope.changeYourPrivateChannels();
						        		
						        		$scope.searchResult2 = [];
							    		$scope.searchResult3 = [];
							    		
				        		
						        		if(channelName == $scope.currentChannelName){
						        			$scope.currentChannelName="";
						        			$scope.myComments=[];
						        		}
						        		
					        		   
					        		});
				        		
				        		});
				        		
				        		
				        		
				        	});
							
			        		
		        		
		        		
		        	});
	        	
	        	});
    			

	        	
    			
    			

	        		
	        	});
    			
    			
    		}else{
    			
    		}
    	});
		
		
	};
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// variable that hold the current message id, that we are showing its replies
	$scope.currentMessageId="";
	
	
	// moving from message to another one, we have to empty out messages id array because we are moving to another message thread
	// and also we have to check if he user that we are trying to reply is already subscribed to the channel
	$scope.ModifyMessageId1 = function(commentId){
		
		
		$scope.globalMessagesId = [];
		$scope.CanIReply(commentId);
		
		document.getElementById('backwardButton').style.backgroundImage = 
			"url( 'lib/images/xIcon2.png' )";	
		
	};
	
	
	// checks if the user subscribed to the current channel or not, used when we are trying to reply to user that are not subscriber any more
	// if the user is subscriber, we do subscriber, if not, we can open this thread
	$scope.CanIReply = function(commentId){
		
		document.getElementById('backwardButton').style.backgroundImage = 
			"url( 'lib/images/backIcon.png' )";
		
		$scope.NOONAME = {
				"id" : commentId
		};

		$http({
				method : 'POST',
				url : 'http://localhost:8080/MyWebProject/GetMessageById',
				data : $scope.NOONAME

			}).success(function(response) {
				
				
				$scope.temp = response;
				$scope.currentMessageRR = $scope.temp[0];
				$scope.checkedName = $scope.currentMessageRR.UserNickname;
				
				$scope.IDKK = {
		                "userNickname":$scope.checkedName,
		                "channelName":$scope.currentChannelName
		               
				};
				$http({
		    		method : 'POST',
		    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
		    		data : $scope.IDKK
		    	
		    	}).success(function(response){
		    		
		    		$scope.canI = response;
		    		if($scope.canI == "FOUND"){
		    			
		    			$scope.ModifyMessageId(commentId);
		    			
		    			
		    			$timeout(function (){
		    				var elemm = document.getElementById('theReplies');
		    				elemm.scrollTop = elemm.scrollHeight + 100000000;}
		    			,100
		    			);
		    			
		    			
		    		}else{
		    			
		    			$('#cantReplyWhenNotSubscribe').css("display","inline");
		    			
		    		}
		    		
		    		
		    	});
			
		});
		
		
	};
	
	
	
	// when we move to another message, we have to push its id in the array, so when we are returning from the inner thread, we can see the replies
	// of this message
	$scope.ModifyMessageId = function(commentId){
		
		
		$scope.currentMessageId = commentId;
		$scope.globalMessagesId.push(commentId);
		
		$scope.ChangeCurrentMessage();
		$scope.changeReplyDependOnMessage();
		
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// function that load the current message by the current message id, used in order to show the main message in the top of the thread box
	$scope.ChangeCurrentMessage = function(){
						
		
		$scope.NONAME = {
				"id" : $scope.currentMessageId
		};

		$http(
			{
				method : 'POST',
				url : 'http://localhost:8080/MyWebProject/GetMessageById',
				data : $scope.NONAME

			}).success(function(response) {
				
				$scope.temp = response;
				$scope.currentMessage = $scope.temp[0];
				variable1 = $scope.currentMessage.UserNickname;
			
		});
	
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// variable hold the current channel name that we are opening the discussion of it
	$scope.currentChannelName="";
	
	// function that change the current channel name, used when we click on another channel, implements the welcome word to see
	// in the top of the discussion
	$scope.ModifyChannelName = function(channelName){
		
		var length = channelName.length;

		
		if(channelName[length-1] == '$'){

 			var i = channelName.indexOf($scope.nicknameByUsername);
			var lc = channelName.length;
			var ln = (''+$scope.nicknameByUsername).length;
			
			if(i==0){
				var othernamee = channelName.substring(ln,lc-1);
			}else{
				var othernamee = channelName.substring(0,i);
			}
		
	
			$scope.otherDescription = '';
 			$scope.otherUrl = '';
			
			
			
			
			$scope.othern = {
				"othernamee" : othernamee
			};
			
			$http({
        		method : 'POST',
        		url : 'http://localhost:8080/MyWebProject/FindUsernameServlet',
        		data : $scope.othern
        	
        	}).success(function(responsez){
        		$scope.messagez = responsez;
    			$scope.otherDescription = '';
    			$scope.otherDescription = $scope.messagez[0];
    			
   
    			$scope.otherUrl = $scope.messagez[1];
    			// tosefet
    			
    			if($scope.otherDescription == 'Description unavailable'){
    			
    				$scope.otherDescription = 'unavailable';
    				
    				
    			}
    			
   			 var elemnt = $('#ChannelDescriptionDivContent');
			 elemnt.html('<h4 style="color:#5c9f93; text-align:center"> <b>Current channel info </b> </h4>' +
					 '<br/>' +
					 '<b> Private Channel With: </b> <span id="#secondaryText" >' 
					 + othernamee + '</span>' +
					 '<br/>' +
					 '<b>' +othernamee+ "'s description: </b>" + '<span id="#secondaryText" >' 
					 + $scope.otherDescription + '</span>' +
					 '<br/>' + 
					 '<img src="' + $scope.otherUrl + '"' 
					 + ' style = "height:50px; width:50px;">'+
					 '<br/>'+
					 '<button id="myunSubscription2"'
					+'>' + '<span style='+ '"display:none"'+'>' + othernamee + '</span>'
					+ '</button>'+
					'</span>' + '<br/>' + '<br/>');
    			
        	});	
			
			

			
			 
			 
			 

			
			}
		
		else{
			 $scope.temp3 = $scope.records;
			 for (w in $scope.temp3){
				 if($scope.temp3[w].ChannelName == channelName){
					 var channeltemp = $scope.temp3[w];
					 break
				 }
			 }
			 var elemnt = $('#ChannelDescriptionDivContent');
			 elemnt.html('<h4 style="color:#5c9f93; text-align:center"> <b>Current channel info </b> </h4>' +
					 '<br/>' +
					 '<b> Channel Name: </b> <span id="#secondaryText" >' 
					 + channeltemp.ChannelName + '</span>' +
					 '<br/>' +
					 '<b> Channel Description: </b> <span id="#secondaryText" >' 
					 + channeltemp.Description + '</span>' +
					 '<br/>' +
					 '<b> Number of Subscribers: </b> <span id="#secondaryText" >' 
					 + channeltemp.NumberOfSubscribers + '</span>'
					 + '<br/>' + '<span>' + 
					 '<button id="myunSubscription"'
					+'>' + '<span style='+ '"display:none"'+'>' + channeltemp.ChannelName + '</span>'
					+ '</button>'+
					'</span>' + '<br/>' + '<br/>'
			 
			 );
		}
		
		if($scope.currentChannelName != channelName){
			$scope.myReply = [];
			$scope.currentMessage = [];
			
		}
		
		$scope.currentChannelName = channelName;
		st = 0;
		$scope.changeYourMessages();
		
	      
		
		$timeout(function (){
			var elemm = document.getElementById('MyChatBox');
			elemm.scrollTop = elemm.scrollHeight;}
		,200
		);
		

		
		$scope.ZerosChannelUnread(channelName,$scope.nicknameByUsername);
		
		
	};
	
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

	// variable holds the message content
	$scope.messageContent='';
	
	// function used when we want to write a message, in this function we have a lot of things to do
	// if i'm in a public channel, i have to write this message in this channel,
	// if i'm in private channel, first i have to check if the other user is subscribed to this private chat or not
	// 		if he is not subscriber, i have to add him to the subscribers table first, to update his private channels,and to write message between us
	//		if he is subscriber, i have to write this message between us
	// in each write to message, in public or private, i have to update all the unread fields in all the channel subscribers
	// i have also to change the indicator of the mention, i have to take all the nicknames that i mentioned and to tell them that they have
	// a mention on this channel, and i have to update the public and private channels 
	$scope.writeMessage = function(){
		
		if($scope.messageContent.length != 0){
		
		var stringedCurrentChannelName = '' + $scope.currentChannelName;
		var l = stringedCurrentChannelName.length;
		
		if(stringedCurrentChannelName[l-1] == "$"){
			
			var Ln = (''+$scope.nicknameByUsername).length;
			var j = stringedCurrentChannelName.indexOf($scope.nicknameByUsername);
			if(j==0){
				$scope.otherNickname = stringedCurrentChannelName.substring(Ln,l-1);
			}else{
				$scope.otherNickname = stringedCurrentChannelName.substring(0,j);
			}
			


			$scope.IDK = {
	                "userNickname":$scope.otherNickname,
	                "channelName":$scope.currentChannelName
	               
			};
			$http({
	    		method : 'POST',
	    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
	    		data : $scope.IDK
	    	
	    	}).success(function(response){

	    		
	    		$scope.message = response;
	    		if($scope.message == "NOT_FOUND"){
	    			
	    			$scope.addedInfo = {
			                "userN":$scope.otherNickname,
			                "publicChannelName":$scope.currentChannelName,
			                "publicChannelDesc":"im private",
			                "publicChannelNumberOfSub":2
			            };
					
					$http({
		        		method : 'POST',
		        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
		        		data : $scope.addedInfo
		        	
		        	}).success(function(response){
		        		
		        		$scope.changeYourPrivateChannels();
		        		
		        		$scope.messageInfo = {
		    	                "messageN":$scope.nicknameByUsername,
		    	                "messageU":$scope.urlByUsername,
		    	                "messageC":$scope.messageContent,
		    	                "messageChannelName":$scope.currentChannelName
		    	            };
		    					
		    			$http({
		    	    		method : 'POST',
		    	    		url : 'http://localhost:8080/MyWebProject/AddMessageServlert',
		    	    		data : $scope.messageInfo
		    	    	
		    	    	}).success(function(response){
		    	    		
		    	    		st = 0;
		    	    		$scope.changeYourMessages();
		    	    		
		    	    		$timeout(function (){
		    	    			var elemm = document.getElementById('MyChatBox');
		    	    			elemm.scrollTop = elemm.scrollHeight;}
		    	    		,200
		    	    		);
		    	    		
		    	    		
							//////
							
							var contentLength = $scope.messageContent.length;
	    		    		$scope.mentionArray = [];
	    					for (var i=0; i<contentLength; i++){
	    						if($scope.messageContent[i] == '@'){
	    							var j = i+1;
	    							while($scope.messageContent[j]!=' ' && $scope.messageContent[j]!='@' && j != contentLength){
	    								j++;}
	    							var mentionedName = $scope.messageContent.substring(i+1,j);
	    							if(mentionedName != '' && mentionedName != '@'
	    								&& mentionedName != $scope.nicknameByUsername){
	    							$scope.mentionArray.push(mentionedName);
	    							}
	    						}
	    						
	    					}
	    					
	    					for(t in $scope.mentionArray){
	    						$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
	    					}
	    		    		
							
							/////
							
	    					$scope.messageContent = '';
		            		
	    					$scope.IncrementChannelUnread($scope.currentChannelName);

		        	
	    					
	    					sendMessage($scope.currentChannelName);

	    		    				    	    		
		    	    		});
		        	});
	    			
	    		}else{
	    			if($scope.message == "FOUND"){
	    				
	    				$scope.messageInfo = {
	    		                "messageN":$scope.nicknameByUsername,
	    		                "messageU":$scope.urlByUsername,
	    		                "messageC":$scope.messageContent,
	    		                "messageChannelName":$scope.currentChannelName
	    		            };
	    						
	    				$http({
	    		    		method : 'POST',
	    		    		url : 'http://localhost:8080/MyWebProject/AddMessageServlert',
	    		    		data : $scope.messageInfo
	    		    	
	    		    	}).success(function(response){
	    		    		
	    		    		st = 0;
	    		    		$scope.changeYourMessages();
	    		    		
	    		    		$timeout(function (){
	    		    			var elemm = document.getElementById('MyChatBox');
	    		    			elemm.scrollTop = elemm.scrollHeight;}
	    		    		,200
	    		    		);
	    		    		
	    		    
	    		    		
	    		    		var Chatboxdiv = document.getElementById('MyChatBox');
							Chatboxdiv.scrollTop = Chatboxdiv.scrollHeight;
							
							//////
							
							var contentLength = $scope.messageContent.length;
	    		    		$scope.mentionArray = [];
	    					for (var i=0; i<contentLength; i++){
	    						if($scope.messageContent[i] == '@'){
	    							var j = i+1;
	    							while($scope.messageContent[j]!=' ' && $scope.messageContent[j]!='@' && j != contentLength){
	    								j++;}
	    							var mentionedName = $scope.messageContent.substring(i+1,j);
	    							if(mentionedName != '' && mentionedName != '@' && mentionedName !=''
	    								&& mentionedName != $scope.nicknameByUsername){
	    							$scope.mentionArray.push(mentionedName);
	    							}
	    						}
	    						
	    					}
	    					
	    					for(t in $scope.mentionArray){
	    						$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
	    					}
	    		    		
							
							/////
	    					$scope.messageContent = '';
					
	    					
	    					$scope.IncrementChannelUnread($scope.currentChannelName);
//	    		    		$scope.changeYourPublicChannels($scope.nicknameByUsername);
//	    	    			$scope.changeYourPrivateChannels();
	    	    	
	    					
	    					sendMessage($scope.currentChannelName);
							
	    		    		
	    		    		});
	    				
	    			}
	    			
	    		}
	    		
	    		
	    	});	
		
		}else{ //public
			
			
			$scope.messageInfo = {
	                "messageN":$scope.nicknameByUsername,
	                "messageU":$scope.urlByUsername,
	                "messageC":$scope.messageContent,
	                "messageChannelName":$scope.currentChannelName
	            };
					
			$http({
	    		method : 'POST',
	    		url : 'http://localhost:8080/MyWebProject/AddMessageServlert',
	    		data : $scope.messageInfo
	    	
	    	}).success(function(response){
	    		
	    		st = 0;
	    		$scope.changeYourMessages();
	    		
	    		$timeout(function (){
	    			var elemm = document.getElementById('MyChatBox');
	    			elemm.scrollTop = elemm.scrollHeight;}
	    		,200
	    		);
	    		
	    
	    		
	    		//////
				
				var contentLength = $scope.messageContent.length;
	    		$scope.mentionArray = [];
				for (var i=0; i<contentLength; i++){
					if($scope.messageContent[i] == '@'){
						var j = i+1;
						while($scope.messageContent[j]!=' ' && $scope.messageContent[j]!='@' && j != contentLength){
							j++;}
						var mentionedName = $scope.messageContent.substring(i+1,j);
						if(mentionedName != '' && mentionedName != '@'
							&& mentionedName != $scope.nicknameByUsername){
						$scope.mentionArray.push(mentionedName);
						}
					}
					
				}
				
				for(t in $scope.mentionArray){
					$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
				}
	    		
				
				/////
				
				$scope.messageContent = '';
		
				$scope.IncrementChannelUnread($scope.currentChannelName);
//	    		$scope.changeYourPublicChannels($scope.nicknameByUsername);
//    			$scope.changeYourPrivateChannels();
    	
				
        		sendMessage($scope.currentChannelName);

	    		
	    		});
			
			 
			
		}
		
			
		
		}
		
	};

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

	// function that checks if the user that i'm replying on his message is subscribed to this channel or not
	// in public i don't need to check this because if the user is'nt subscriber, i can open his thread
	// in private if the other user isn't subscriber i have to put them on the subscriber table and then to write the reply
	// the write reply function comes after a while :)
	$scope.writeReply1 = function(){
		
		$scope.putValueFlag = 0;
		
		var stringedCurrentChannelName = '' + $scope.currentChannelName;
		var l = stringedCurrentChannelName.length;
		
		if(stringedCurrentChannelName[l-1] == "$"){
		
			
			var Ln = (''+$scope.nicknameByUsername).length;
			var j = stringedCurrentChannelName.indexOf($scope.nicknameByUsername);
			if(j==0){
				$scope.otherNickname = stringedCurrentChannelName.substring(Ln,l-1);
			}else{
				$scope.otherNickname = stringedCurrentChannelName.substring(0,j);
			}
			
			$scope.IDK = {
	                "userNickname":$scope.otherNickname,
	                "channelName":$scope.currentChannelName
	               
			};
			$http({
	    		method : 'POST',
	    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
	    		data : $scope.IDK
	    	
	    	}).success(function(response){
	    		$scope.message = response;
	    	
	    		if($scope.message == "NOT_FOUND"){
	    			
	    			$scope.addedInfo = {
			                "userN":$scope.otherNickname,
			                "publicChannelName":$scope.currentChannelName,
			                "publicChannelDesc":"im private",
			                "publicChannelNumberOfSub":2
			            };
					
					$http({
		        		method : 'POST',
		        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
		        		data : $scope.addedInfo
		        	
		        	}).success(function(response){
		        		
		        		
		        		$scope.writeReplyToMessage();
		        		$scope.changeYourPrivateChannels();
		        		
	    	    		$timeout(function (){
	    	    			var elemm = document.getElementById('theReplies');
	    	    			elemm.scrollTop = elemm.scrollHeight + 100000000;}
	    	    		,100
	    	    		);
		        		
		        		
		        	});
		        
	    		
	    		
	    		}else{ //if found
	    			$scope.writeReplyToMessage();
	        		$timeout(function (){
    	    			var elemm = document.getElementById('theReplies');
    	    			elemm.scrollTop = elemm.scrollHeight + 100000000;}
    	    		,100
    	    		);
	    		}
	    		
	    	
	    	});
			
			
			
		}else{
			$scope.writeReplyToMessage();
			
    		$timeout(function (){
    			var elemm = document.getElementById('theReplies');
    			elemm.scrollTop = elemm.scrollHeight + 100000000;}
    		,100
    		);
			
		}
		
		
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// function used when we want to write reply to a message, in this function we have a lot of things to do
	// if i'm in a public channel, i have to write this reply in this channel,
	// if i'm in private channel, first i have to check if the other user is subscribed to this private chat or not
	// 		if he is not subscriber, i have to add him to the subscribers table first, to update his private channels,and to write the 
	//			reply  between us
	//		if he is subscriber, i have to write the reply between us
	// in each write reply, in public or private, i have to update all the unread fields in all the channel subscribers
	// i have also to change the indicator of the mention, i have to take all the nicknames that i mentioned and to tell them that they have
	// a mention on this channel, and i have to update the public and private channels 
	
	$scope.writeReplyToMessage = function(){
	
		
		if($scope.globalMessagesId.length != 0){
			
			$scope.temp = $scope.replyContent;
			if($scope.temp.length != 0){
				
				
				
			if($scope.temp[0] == '@'){
				
				$scope.space = ($scope.temp).indexOf(' ');
				if($scope.space == -1){
					$scope.lengthOfWord = $scope.temp.length;
					$scope.space = $scope.lengthOfWord;
				}	
				$scope.firstWord = $scope.temp.substring(1,$scope.space);
				
				$scope.IDK = {
		                "userNickname":$scope.firstWord,
		                "channelName":$scope.currentChannelName
		               
				};
				$http({
		    		method : 'POST',
		    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
		    		data : $scope.IDK
		    	
		    	}).success(function(response){
		    		
		    		
		    		
		    		$scope.nres = response;
		    		if($scope.nres == "FOUND"){
		    			
		    			
		    			$scope.replyContent1 = $scope.replyContent;
		    			
		    			
		    			$scope.messageInfo = {
		    	                "messageN":$scope.nicknameByUsername,
		    	                "messageU":$scope.urlByUsername,
		    	                "messageC":$scope.replyContent1,
		    	                "messageChannelName":$scope.currentChannelName,
		    	                "parent":$scope.currentMessageId,
		    	                "firstParent":$scope.globalMessagesId[0]
		    	            };
		    			
		    			
		    			$http({
		    	    		method : 'POST',
		    	    		url : 'http://localhost:8080/MyWebProject/AddReplyToMessageServlet',
		    	    		data : $scope.messageInfo
		    	    	
		    	    	}).success(function(response){
		    	    		
		    	    		$scope.changeReplyDependOnMessage();
		    	    		
		    	    		$scope.replyInfo = {
		    	                    "messageId":$scope.globalMessagesId[0]
		    	                };
		    	    		
		    	    		$http({
		    	        		method : 'POST',
		    	        		url : 'http://localhost:8080/MyWebProject/ChangeTimestampOfMessageByIdServlet',
		    	        		data : $scope.replyInfo
		    	        	
		    	        	}).success(function(response){
		    	        		st = 0;
		    	        		$scope.changeYourMessages();
		    	        		
		    	        		
		    	        		$timeout(function (){
		    	        			var elemm = document.getElementById('MyChatBox');
		    	        			elemm.scrollTop = elemm.scrollHeight;}
		    	        		,200
		    	        		);
		    	        		
		    	        
		    		    		
		    		    		$('#chatTextInputt').val('');
		    		    		$scope.replyContent = "";
		    		 
		    		    		
		    		    		////////
		    		    		
		    		    		var contentLength = $scope.replyContent1.length;
		    		    		
		    		    		
		    		    		
		    		    		$scope.mentionArray = [];
		    		    		
		    		    		for (var i=0; i<contentLength; i++){
		    						if($scope.replyContent1[i] == '@'){
		    							var j = i+1;
		    							while($scope.replyContent1[j]!=' ' && $scope.replyContent1[j]!='@' && j != contentLength){
		    								j++;}
		    							var mentionedName = $scope.replyContent1.substring(i+1,j);
		    							if(mentionedName != '' && mentionedName != '@'
		    								&& mentionedName != $scope.nicknameByUsername){
		    							$scope.mentionArray.push(mentionedName);
		    							}
		    						}
		    						
		    					}
		    		    		
		    					for(t in $scope.mentionArray){
		    						$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
		    					}
		    		    		
		    		    		
		    		    		
		    		    		////
		    		    
		    					$scope.IncrementChannelUnread($scope.currentChannelName);
//		    	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
//		    	    			$scope.changeYourPrivateChannels();
		    	    	
		    					sendMessage($scope.currentChannelName);
		    		    	
		    	        	});
		    	    		
		    	    		
		    	    	})

		    			
		    		}else{
		    			
			    			
		    			$scope.mustFirst = "@"+variable1;
		    			$scope.replyContent1 = $scope.mustFirst + " " +  $scope.replyContent;
		    			
		    			$scope.messageInfo = {
		    	                "messageN":$scope.nicknameByUsername,
		    	                "messageU":$scope.urlByUsername,
		    	                "messageC":$scope.replyContent1,
		    	                "messageChannelName":$scope.currentChannelName,
		    	                "parent":$scope.currentMessageId,
		    	                "firstParent":$scope.globalMessagesId[0]
		    	            };
		    			
		    			$http({
		    	    		method : 'POST',
		    	    		url : 'http://localhost:8080/MyWebProject/AddReplyToMessageServlet',
		    	    		data : $scope.messageInfo
		    	    	
		    	    	}).success(function(response){
		    	    		
		    	    		$scope.changeReplyDependOnMessage();
		    	    		$scope.replyInfo = {
		    	                    "messageId":$scope.globalMessagesId[0]
		    	                };
		    	    		$http({
		    	        		method : 'POST',
		    	        		url : 'http://localhost:8080/MyWebProject/ChangeTimestampOfMessageByIdServlet',
		    	        		data : $scope.replyInfo
		    	        	
		    	        	}).success(function(response){
		    	        		st = 0;
		    	        		$scope.changeYourMessages();
		    	        		
		    	        		$timeout(function (){
		    	        			var elemm = document.getElementById('MyChatBox');
		    	        			elemm.scrollTop = elemm.scrollHeight;}
		    	        		,200
		    	        		);
		    	        		
		    	        		
		    		    		$('#chatTextInputt').val('');
		    		    		
		    		       		$scope.replyContent = "";
		   		    		 
////////
		    		    		
		    		       		$scope.mentionArray = [];
		    		       		
		    		    		var contentLength = $scope.replyContent1.length;
		    					for (var i=0; i<contentLength; i++){
		    						if($scope.replyContent1[i] == '@'){
		    							var j = i+1;
		    							while($scope.replyContent1[j]!=' ' && $scope.replyContent1[j]!='@' && j != contentLength){
		    								j++;}
		    							var mentionedName = $scope.replyContent1.substring(i+1,j);
		    							if(mentionedName != '' && mentionedName != '@'
		    								&& mentionedName != $scope.nicknameByUsername){
		    							$scope.mentionArray.push(mentionedName);
		    							}
		    						}
		    						
		    					}
		    					
		    					for(t in $scope.mentionArray){
		    						$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
		    					}
		    		    		
		    		    		
		    		    		
		    		    		////
		    		    
		    	        		$scope.IncrementChannelUnread($scope.currentChannelName);
//		    	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
//		    	    			$scope.changeYourPrivateChannels();
		    	    	
		    		       		
		    		       		sendMessage($scope.currentChannelName);

		    		    	
		    	        	});
		    	    		
		    	    		
		    	    	})

		    			
		    		}
		    		
		    	});
		    
				
			}else{
				
				
				
	    		
				$scope.mustFirst = "@"+variable1;
    			$scope.replyContent1 = $scope.mustFirst + " " +  $scope.replyContent;

    			$scope.messageInfo = {
    	                "messageN":$scope.nicknameByUsername,
    	                "messageU":$scope.urlByUsername,
    	                "messageC":$scope.replyContent1,
    	                "messageChannelName":$scope.currentChannelName,
    	                "parent":$scope.currentMessageId,
    	                "firstParent":$scope.globalMessagesId[0]
    	            };
    			
    			
    			$http({
    	    		method : 'POST',
    	    		url : 'http://localhost:8080/MyWebProject/AddReplyToMessageServlet',
    	    		data : $scope.messageInfo
    	    	
    	    	}).success(function(response){
    	    		
    	    		$scope.changeReplyDependOnMessage();
    	    		
    	    		$scope.replyInfo = {
    	                    "messageId":$scope.globalMessagesId[0]
    	                };
    	    		
    	    		$http({
    	        		method : 'POST',
    	        		url : 'http://localhost:8080/MyWebProject/ChangeTimestampOfMessageByIdServlet',
    	        		data : $scope.replyInfo
    	        	
    	        	}).success(function(response){
    	        		st = 0;
    	        		$scope.changeYourMessages();
    	        		
    	        		$timeout(function (){
    	        			var elemm = document.getElementById('MyChatBox');
    	        			elemm.scrollTop = elemm.scrollHeight;}
    	        		,200
    	        		);
    	        		
    	        
    		    		$('#chatTextInputt').val('');
    		       		$scope.replyContent = "";
   		    		 
    		       		
    		      ////////
    		    		
    		    		var contentLength = $scope.replyContent1.length;
    		    		$scope.mentionArray = [];
    					for (var i=0; i<contentLength; i++){
    						if($scope.replyContent1[i] == '@'){
    							var j = i+1;
    							while($scope.replyContent1[j]!=' ' && $scope.replyContent1[j]!='@' && j != contentLength){
    								j++;}
    							var mentionedName = $scope.replyContent1.substring(i+1,j);
    							if(mentionedName != '' && mentionedName != '@'
    								&& mentionedName != $scope.nicknameByUsername){
    							$scope.mentionArray.push(mentionedName);
    							}
    						}
    						
    					}
    					
    					for(t in $scope.mentionArray){
    						$scope.MentionChanging($scope.currentChannelName,$scope.mentionArray[t]);
    					}
    		    		
    		    		
    		    		
    		    		////
    					
    					$scope.IncrementChannelUnread($scope.currentChannelName);
    		    		
//    	        		$scope.changeYourPublicChannels($scope.nicknameByUsername);
//    	    			$scope.changeYourPrivateChannels();
    	    			
    		 
    					sendMessage($scope.currentChannelName);

    		    	
    	        	});
    	    		
    	    		
    	    	})

    			
			}
			
			}
			
			
			
		}else{
			$('#chatTextInputt').val('');
		}
	};

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
	
	// pointers used to slice the 10 messages per page 
	var st = 0;
	var I = 0;
	var J = 10;
	var len = 0; 
	
	
	// function that get all the messages that belong to the current channel, i have to make sure that i'm returning all the messages that wrote after
	// the time that i subscribed this channel
	// after i get all the right messages, i have to represent just 10 messages to the user per scrolling movement
    $scope.changeYourMessages = function(){
    	
    	
    	
    	$scope.NONAME = {
    			"userNickname":$scope.nicknameByUsername,
                "channelName":$scope.currentChannelName
            };
    	
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetTimestampFromSubscripersByChannelnameAndNickname',
    		data : $scope.NONAME
    	
    	}).success(function(response){
    	
    		var subTime = response;
    		
    		$scope.NONAME = {
                    "channelName":$scope.currentChannelName,
                    
                };
        	
        	$http({
        		method : 'POST',
        		url : 'http://localhost:8080/MyWebProject/GetAllMessagesByChannelNameServlet',
        		data : $scope.NONAME
        	
        	}).success(function(response){
        		$scope.myMessages1 = response;
        		
        		$scope.myMessages2=[];
        		
        		for( m in $scope.myMessages1){
        			
        			var messageTime = $scope.myMessages1[m].OredTimestamp;
        			var a = new Date(messageTime).valueOf();
        			var b = new Date(subTime).valueOf();

        			if( ((a-b)>-1000) || (a-b)==0 || (a-b)===0){
        				$scope.myMessages2.push($scope.myMessages1[m]);
        			}
        		}
        		$scope.myMessages = $scope.myMessages2;
        		
        		
        		len = $scope.myMessages.length;
        		
        		if(st == 0){
        			
        			
        			I = len - 10;
        			J = len;
        			st = 1;
        		}
        		
        		
        		if((I < 0) || (I==0)){
        			I = 0;
        		}
        		
        		
        		
        		if(J >= len){
        			J = len;
        		}
        		
        		
        		$scope.finalMessages1 = [];
        		for( var i = I ; i< J; i++){
        			$scope.finalMessages1.push($scope.myMessages[i]);
        		}
        		
        		$scope.finalMessages = $scope.finalMessages1;

        		
        	})
        	    		
    	});
    	
    	

    	
    	
    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // function that return the replies of a message with the given message id  
    $scope.changeReplyDependOnMessage = function(){
    	
    	
    	$scope.NONAME = {
                "parent": $scope.currentMessageId
            };
    	
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetAllMessagesByFirstParentServlet',
    		data : $scope.NONAME
    	
    	}).success(function(response){
    		$scope.myReply = response;
    	});

    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // function called when we have to back from thread box of message to the previous message, so we have to pop, check if there is another message
    // and to load its replies 
    $scope.BackwardReplies = function(){
    	
    	
    	
    	if($scope.globalMessagesId.length != 0){
    		
    		$scope.globalMessagesId.pop();
    		
    		if($scope.globalMessagesId.length == 1){
    			document.getElementById('backwardButton').style.backgroundImage = "url( 'lib/images/xIcon2.png' )";
    		}
    		
    		if($scope.globalMessagesId.length == 0){
    			
    			document.getElementById('replyArea').style.display = "none";
    			document.getElementById('ChannelDescriptionDiv').style.display = "inline";
    			$scope.ModifyMessageIdEmpty();
    			
    		}else{
    			
    			
    			$scope.temp = $scope.globalMessagesId.pop();
    			$scope.ModifyMessageId($scope.temp);
    			
    		}
    	}else{
    	
    		document.getElementById('replyArea').style.display = "none";
			document.getElementById('ChannelDescriptionDiv').style.display = "inline";
			$scope.ModifyMessageIdEmpty();
		
    	}
    	
		
		$timeout(function (){
			var elemm = document.getElementById('theReplies');
			elemm.scrollTop = elemm.scrollHeight + 100000000;}
		,100
		);
		
    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // function that zeros the message id array, used when we have to move from channel to another or to change the threads of messages
    $scope.ModifyMessageIdEmpty = function(){
		
		
		$scope.currentMessageId = "";
		
		//$scope.changeYourMessages();
		
		
		$scope.currentMessage="";
		$scope.myReply = [];
		
	};
	
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// this function used when we click in user nickname, i have many option
	// 1. i have to check if the private channel is not found
	// 		if its not found i have to create this private channel and add me to the subscribers table
	//		if its found, that means that the another user created like this channel, so i just have to add me to the subscribers of this channel
	$scope.tryCreate = function(otherName){
		
		$scope.privateChannelNameTemp = $scope.nicknameByUsername+otherName+"$";
		$scope.privateChannelNameTemp1 = otherName+$scope.nicknameByUsername+"$";
		$scope.pName = {
                "privateChannelName": $scope.privateChannelNameTemp //check the first option
            };
    	
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    		data : $scope.pName
    	
    	}).success(function(response){
    		$scope.checkResult = response;
    		
    		if($scope.checkResult == "NOT_FOUND"){
    			
    			$scope.pName = {
    	                "privateChannelName": $scope.privateChannelNameTemp1 // check the second option
    	            };
    	    	
    	    	$http({
    	    		method : 'POST',
    	    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    	    		data : $scope.pName
    	    	
    	    	}).success(function(response){
    	    		$scope.checkResult1 = response;
    	    		
    	    		if($scope.checkResult1 == "NOT_FOUND"){  
    	    			
    	    			$scope.pName = {
    	    	                "privateChannelName": $scope.privateChannelNameTemp // check the second option
    	    	            };
    	    	    	
    	    	    	$http({
    	    	    		method : 'POST',
    	    	    		url : 'http://localhost:8080/MyWebProject/PrivateChannelCreationServlet',
    	    	    		data : $scope.pName
    	    	    	
    	    	    	}).success(function(response){
    	    	    		$scope.t = response;
    	    	    		if($scope.t == "CREATION_SUCCESS"){
    	    	    			
    	    	    			
    	    	    			$scope.addedInfo = {
                		                "userN":$scope.nicknameByUsername,
                		                "publicChannelName":$scope.privateChannelNameTemp,
                		                "publicChannelDesc":"im private",
            			                "publicChannelNumberOfSub":2
                		                
                		            };
            					
            					$http({
                	        		method : 'POST',
                	        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
                	        		data : $scope.addedInfo
                	        	
                	        	}).success(function(response){
    	    	    	    		
    	    	    	    		if("ADDING_SUCCESS"){
    	    	    	    			
    	    	    	    			$scope.changeYourPrivateChannels();
    	    	    	    			
    	    	    	    		}
    	    	    	    		
    	    	    	    	})	
    	    	    		}
    	    	    	});	
    	    		}else{
    	    			if($scope.checkResult == "FOUND"){

    	    				$scope.IDK = {
    	    		                "userNickname":$scope.nicknameByUsername,
    	    		                "channelName":$scope.privateChannelNameTemp1
    	    		               
    	    				};
    	    				$http({
    	    		    		method : 'POST',
    	    		    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
    	    		    		data : $scope.IDK
    	    		    	
    	    		    	}).success(function(response){

    	    		    		$scope.message = response;
    	    		    		if($scope.message == "FOUND"){
    	    		    			
    	    		    			
    	    		    		}else{
    	    		    			
    	    		    			$scope.addedInfo = {
    	    				                "userN":$scope.nicknameByUsername,
    	    				                "publicChannelName":$scope.privateChannelNameTemp1,
    	    				                "publicChannelDesc":"im private",
    	    				                "publicChannelNumberOfSub":2
    	    				            };
    	    						
    	    						$http({
    	    			        		method : 'POST',
    	    			        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
    	    			        		data : $scope.addedInfo
    	    			        	
    	    			        	}).success(function(response){
    	    			        		
    	    			        		$scope.changeYourPrivateChannels();
    	    			        	});
    	    		    		}
    	    		    	});	
    	    			}else{
    	    			}
    	    		}
    	    	})
    		}else{
    			if($scope.checkResult == "FOUND"){

    				$scope.IDK = {
    		                "userNickname":$scope.nicknameByUsername,
    		                "channelName":$scope.privateChannelNameTemp
    		               
    				};
    				$http({
    		    		method : 'POST',
    		    		url : 'http://localhost:8080/MyWebProject/GetSubscriberByNicknameServlet',
    		    		data : $scope.IDK
    		    	
    		    	}).success(function(response){

    		    		$scope.message = response;
    		    		if($scope.message == "FOUND"){
    		    			
    		    			
    		    		}else{
    		    			
    		    			$scope.addedInfo = {
    				                "userN":$scope.nicknameByUsername,
    				                "publicChannelName":$scope.privateChannelNameTemp,
    				                "publicChannelDesc":"im private",
    				                "publicChannelNumberOfSub":2
    				            };
    						
    						$http({
    			        		method : 'POST',
    			        		url : 'http://localhost:8080/MyWebProject/AddSubscriberServlet',
    			        		data : $scope.addedInfo
    			        	
    			        	}).success(function(response){
    			        		
    			        		$scope.changeYourPrivateChannels();
    			        	});
    		    		}
    		    	});	
    			}else{
    			}
    		}
    	});
	};

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// my private channel array
	$scope.myPrivateChannels=[];
    
	
	// we got all the private channels, to each private channel we have to represent the other user nick name, so we have to slice
	// this private channels and substring the right name of the other user
    $scope.changeYourPrivateChannels = function(){
    	
    	$scope.NONAME = {
                "userNickname":$scope.nicknameByUsername
            };
    	
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetSubscriberOnlyByNicknameServlet',
    		data : $scope.NONAME
    	
    	}).success(function(response){
    		$scope.myPrivateChannels1 = response;
    		$scope.myPrivateChannels2=[];
    		for( s in $scope.myPrivateChannels1){
    			var n = $scope.myPrivateChannels1[s].ChannelName.length;
    			if($scope.myPrivateChannels1[s].ChannelName.substring((n)-1,n) == '$'){
    				$scope.myPrivateChannels2.push($scope.myPrivateChannels1[s]);
    			}
    		}
    		
    		$scope.mySlice = [];
    		for(t in $scope.myPrivateChannels2){
    			var i = $scope.myPrivateChannels2[t].ChannelName.indexOf(''+$scope.nicknameByUsername);
    			var lc = $scope.myPrivateChannels2[t].ChannelName.length;
    			var ln = (''+$scope.nicknameByUsername).length;
    			
    			if(i==0){
    				$scope.mySlice.push($scope.myPrivateChannels2[t].ChannelName.substring(ln,lc-1));
    			}else{
    				$scope.mySlice.push($scope.myPrivateChannels2[t].ChannelName.substring(0,i));
    			}
    		}
    		
    		$scope.myPrivateChannels = $scope.mySlice;
    	});

    	
    };

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // on clicking on the other user nick name at the private channels we have to open the right private channel
    // so we check and found the right private channel that connect between us
    $scope.ModifyChannelName2 = function(name){
    	
    	$scope.v1 = name + $scope.nicknameByUsername + "$";
    	$scope.v2 = $scope.nicknameByUsername + name + "$";
    	
    
    	$scope.pName = {
                "privateChannelName": $scope.v1 //check the first option
            };
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    		data : $scope.pName
    	
    	}).success(function(response){
    		
    		$scope.m = response;
    		if($scope.m == "FOUND"){
    			$scope.ModifyChannelName($scope.v1);
    		}else{
    		
    			
    			$scope.pName = {
    	                "privateChannelName": $scope.v2 //check the first option
    	            };
    	    	$http({
    	    		method : 'POST',
    	    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    	    		data : $scope.pName
    	    	
    	    	}).success(function(response){
    	    		
    	    		$scope.m = response;
    	    		if($scope.m == "FOUND"){
    	    			$scope.ModifyChannelName($scope.v2);
    	    		}
    	    		
    	    	})
    			
    		}
    		
    	})
    	
    	$timeout(function (){
			var elemm = document.getElementById('MyChatBox');
			elemm.scrollTop = elemm.scrollHeight;}
		,200
		);
    	
    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // unsubscribe a private channel, we have to find the correct private channel name that connect us and unsubscribe from it
    $scope.TryUnsup2 = function(x){
    	
    	
    	$scope.v1 = x + $scope.nicknameByUsername + "$";
    	$scope.v2 = $scope.nicknameByUsername + x + "$";
    	
    
    	$scope.pName = {
                "privateChannelName": $scope.v1 //check the first option
            };
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    		data : $scope.pName
    	
    	}).success(function(response){
    		
    		$scope.m = response;
    		if($scope.m == "FOUND"){
    			
    			$scope.addedInnfo = {
		                "userN":$scope.nicknameByUsername,
		                "publicChannelName":$scope.v1
		            };
				
				$http({
	        		method : 'POST',
	        		url : 'http://localhost:8080/MyWebProject/DeleteSubscriberServlet',
	        		data : $scope.addedInnfo
	        	
	        	}).success(function(response){
	        		$scope.changeYourPrivateChannels();
	        	});
    			
    		}else{
    		
    			
    			$scope.pName = {
    	                "privateChannelName": $scope.v2 //check the first option
    	            };
    	    	$http({
    	    		method : 'POST',
    	    		url : 'http://localhost:8080/MyWebProject/GetPrivateChannelByNameServlet',
    	    		data : $scope.pName
    	    	
    	    	}).success(function(response){
    	    		
    	    		$scope.m = response;
    	    		if($scope.m == "FOUND"){
    	    			$scope.addedInnfo = {
    			                "userN":$scope.nicknameByUsername,
    			                "publicChannelName":$scope.v2
    			            };
    					
    					$http({
    		        		method : 'POST',
    		        		url : 'http://localhost:8080/MyWebProject/DeleteSubscriberServlet',
    		        		data : $scope.addedInnfo
    		        	
    		        	}).success(function(response){
    		        		$scope.changeYourPrivateChannels();
    		        	});
    	    		}else{
    	    		}
    	    		
    	    	})
    			
    		}
    		
    	})
    
    
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // once we write message we have to told all the users that they have unread message in the given channel,
    // so we have to increment the unread field
    $scope.IncrementChannelUnread = function(channelName){
    	
    	$scope.chUn = {
    			"channelName":channelName
    	};
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/IncUnreadInSubscribersServlat',
    		data : $scope.chUn
    	
    	}).success(function(response){
    		$scope.ir = response;
    		$scope.ZerosChannelUnread($scope.currentChannelName,$scope.nicknameByUsername);
    	});
    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // once we open a channel, we have to zeros all the unread and mention field from this channel
    $scope.ZerosChannelUnread = function(channelName, userNickname){
    	
    	$scope.chUn1 = {
    			"channelName":channelName,
    			"userNickname":userNickname
    	};
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/ZerosUnreadInSubscribersServlet',
    		data : $scope.chUn1
    	
    	}).success(function(response){
    		$scope.zr = response;
    		
    		$timeout(function(){
    			
    			$scope.changeYourPublicChannels($scope.nicknameByUsername);
    			$scope.changeYourPrivateChannels();
    			},100);
    	
    	});
    	
    };
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // once we write message and mentioned user we have to told the users that he have mentioned message in the given channel,
    // so we have to increment the mention field
    
    $scope.MentionChanging = function(channelName, userNickname){
    	
    	$scope.chUn1 = {
    			"channelName":channelName,
    			"userNickname":userNickname
    	};
    	$http({
    		method : 'POST',
    		url : 'http://localhost:8080/MyWebProject/IncMentionInSubscribersServlet',
    		data : $scope.chUn1
    	
    	}).success(function(response){
    		
    		
    		$scope.zr = response;

			$scope.ZerosChannelUnread($scope.currentChannelName,$scope.nicknameByUsername);
			
    		$scope.changeYourPublicChannels($scope.nicknameByUsername);
			$scope.changeYourPrivateChannels();
			$scope.changeYourPublicChannels($scope.nicknameByUsername);
			$scope.changeYourPrivateChannels();
		
    	
    	});
    	
    };

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    // used in the onmessage web socket function, in this function we get the channel name of that the message sent from it
    // if the sent message was from the the current channel, we just have to change the messages and refresh this channel messages
    // else we have to refresh the right side, the channels side, that have the indicator of the unread, mention messages, and the channel if someone
    // created a private channel between us
    $scope.unReadChanging = function(channelName){
    	
    	if($scope.currentChannelName == channelName){
    		
    		$timeout(function(){
    		
    		st = 0;
    		$scope.changeYourMessages();
    		
    		$timeout(function (){
    			var elemm = document.getElementById('MyChatBox');
    			elemm.scrollTop = elemm.scrollHeight;}
    		,150
    		);
    		
    		$scope.ZerosChannelUnread($scope.currentChannelName,$scope.nicknameByUsername);
    		
    		},100);
    		
    		
    	}else{
    		if(channelName == "" || !channelName){
    		}else{
    			
    			
    			$timeout(function(){
    			
    			$scope.changeYourPublicChannels($scope.nicknameByUsername);
    			$scope.changeYourPrivateChannels();
    			
    			$scope.changeYourPublicChannels($scope.nicknameByUsername);
    			$scope.changeYourPrivateChannels();
    			},100);
    		}
    	}
    	
    	
    };
  
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    
    // function that called when we have reached the top or the bottom of the scrolling chat area,
    // if we reached the top, we have to load older 10 messages
    // if we reached the bottom we have to load the newest 10 messages
    // and we have to check all the situations of the scrolling
	scrollingFunc = function(){
		
		if(len > 10){
		
		if( document.getElementById('MyChatBox').scrollTop == 0){
			
			
			
			if(I > 0){
				
				
				I = I - 2;
				J = J - 2;
				
				if(J < 10){
					J = 10;
				}
				
				$scope.changeYourMessages();

				$timeout(function (){
					var elemm = document.getElementById('MyChatBox');
					elemm.scrollTop = 180;}
				,100
				);
				
				
				
			
			}
		}else{

			
		
		var element = document.getElementById('MyChatBox');
		if(element.scrollTop + element.offsetHeight >= element.scrollHeight ){
			
			
			if( (I + 10) == len ){
				
			}else{
				
				
				I = I + 2;
				J = J + 2;
				
				if(J < len){
					$scope.changeYourMessages();
					
					$timeout(function (){
						var elemm = document.getElementById('MyChatBox');
						elemm.scrollTop = 180;}
					,100
					);
					
					
				}else{
					
					J = len;
					I = J - 10;
					$scope.changeYourMessages();
					
					$timeout(function (){
						var elemm = document.getElementById('MyChatBox');
						elemm.scrollTop = 180;}
					,100
					);
					
					
				}
				
				
			}
			
			
		}
		
	}
		
		
		}
	};
    
    
    
}]);
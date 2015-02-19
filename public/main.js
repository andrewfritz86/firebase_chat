console.log("main.js linked")

// initially, we create a new Firebase object and pass it the URL that we registered
var myDataRef = new Firebase('https://resplendent-heat-9042.firebaseio.com/');
var currentRoom;
var myRoomID;
var chatHistory;
// we create a 'room', which is just a child of our main firebase. semantically, we are creating a 'rooms'
// branch in the firebase gui, pointing the roomRef variable at it.
//below, we've created an empty array of rooms that we can push room instances into
var roomRef = myDataRef.child("rooms");
var roomName = "WDI Zelda Room"

roomRef.once("value", function(snapshot){
	snapshot.forEach(function(data){
		if(data.name() == roomName){
			currentRoom = data
			loadChat();
		}else{
			currentRoom = roomRef.child(roomName);
			loadChat();
		}
	})	
})

function loadChat(){
	//below, we create a new "room" by pushing an object in. .push returns the new object created

	//here we create the chat 'history' for the room. Above, we created myroom. Now we append a child to that object, and call it the history
	//eventually we will push new messages into that chathistory object

	//FIXME we need to attach the listener to a firebase snapshot, not a plain old object
	chatHistory = currentRoom.child("chatHistory");

	//call.key on an object to get its unique id. You can see this id in the GUI
	//can use this later to check if a user is auth'd to receive messages
	myRoomID = currentRoom.key()

	addFirebaseListeners()
};

function addFirebaseListeners(){

	//the chathistory that we created above can take an on method, which takes two arguments
	//the event (defined by firebase) that's being listened for, and a callback
	// debugger
	chatHistory.on("child_added", function(snapshot){
		console.log(snapshot);
	});
}

		//function to append messages to the DOM. The function takes a snapshot as an argument. The snapshot is the
		//firebase reponse or object. If you 'push' a new object into a reference, the most recent object will be returned
		//as the snapshot
		function appendMessage(snapshot){
			var message = snapshot.val();
			var newLi = $("<li>");
			newLi.text(message.name + " says: " + message.text)
			$("#messagesList").append(newLi);
		};

		//a bit of jquery to grab input and make a call to your firebase when 'return' is hit
		$('#messageInput').keypress(function (e) {
		  if (e.keyCode == 13) {
		    var name = $('#nameInput').val();
		    var text = $('#messageInput').val();
				chatHistory.push({name: name, text: text});
		    $('#messageInput').val('');
		    $('#nameInput').val('');
		  }
		});

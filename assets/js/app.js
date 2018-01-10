//Update DB with player info onSubmit of Player Name
    //Name, wins, losses
//Wait until 2 players have "logged in" before playing becomes possible
    //Possibly dissallow access to game when 2 players are signed in
//Players take turns choosing RPS
    //P2 only allowed to choose after P1 has chosen
//Determine who wins
    //Add wins/losses to DB
//Restart game
//If a player logs out/refreshes, let a new player join

//Initialize Firebase
var config = {
    apiKey: "AIzaSyD0187Am-Hw2vcJxjZsUmTPLKeANdOpBGE",
    authDomain: "rps-multiplayer-63147.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-63147.firebaseio.com",
    projectId: "rps-multiplayer-63147",
    storageBucket: "",
    messagingSenderId: "599390190926"
  };
firebase.initializeApp(config);

var database = firebase.database();

var playerOne = '',
    playerTwo = '',
    playerNum = null; //important for determining who exited game

function addPlayer(event){
    var name = $('#name-input').val();
    event.preventDefault();
    if(playerOne){
        //P1 and P2 exist
        if(playerTwo){
            var msg = "There's too many players!"
            console.log(msg);
        }
        //only P1 exists
        else{
            database.ref('/players/2').set({
                name: name,
                wins: 0,
                losses: 0
            })

            playerNum = 2;
        }
    }
    //P2 but no P1
    else if(playerTwo){ //might be able to delete this since its the same as the else statement
        database.ref('/players/1').set({
            name: name,
            wins: 0,
            losses: 0
        })

        playerNum = 1;
    }
    //currently no players
    else{
        database.ref('/players/1').set({
            name: name,
            wins: 0,
            losses: 0
        })
        playerNum = 1;
    }
}

database.ref().on('value', function(snapshot){

    snapshot.val().players[1].name ? 
        playerOne = snapshot.val().players[1].name 
        : null;
    
    snapshot.val().players[2].name ? 
        playerTwo = snapshot.val().players[2].name 
        : null;

}, function(error){


});

$('#submit-name').click(addPlayer);
$('#test-delete').click(function(event){
    event.preventDefault();
    database.ref().child('players').remove();
    playerOne = '';
    playerTwo = '';
})
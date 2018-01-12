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
            alert(msg);
        }
        //only P1 exists
        else{
            playerNum = 2;
            database.ref('/players/2').set({
                name: name,
                wins: 0,
                losses: 0
            })
            showButtons();
        }
    }
    //P2 but no P1
    else if(playerTwo){ //might be able to delete this since its the same as the else statement
        
        playerNum = 1;
        database.ref('/players/1').set({
            name: name,
            wins: 0,
            losses: 0
        })
        showButtons();
    }
    //currently no players
    else{

        playerNum = 1;
        database.ref('/players/1').set({
            name: name,
            wins: 0,
            losses: 0
        })
        showButtons();
    }

    //hide form
    $('#enter-name').addClass('invisible')
}

function deletePlayerFromDOM(num){
    $('#p' + num + 'name').text('Waiting for Player ' + num);
    $('#p' + num + 'wins').text('');
    $('#p' + num + 'losses').text('')
}

function showButtons(){

    if(playerNum === 1){
        $('#p1choices').append('Player 1 choices')
        console.log('it worked');
    }

    if(playerNum === 2){
        $('#p2choices').append('Player 2 choices')
    }
}


database.ref().on('value', function(snapshot){
    //if data exists
    if (snapshot.val()){
        //if P1 exists
        if(snapshot.val().players[1]){
            var p1 = snapshot.val().players[1]
            playerOne = p1.name;
            $('#p1name').text(playerOne);
            $('#p1wins').text(p1.wins);
            $('#p1losses').text(p1.losses);
           
        }else{
            deletePlayerFromDOM(1);
        }
        //if P2 exists
        if(snapshot.val().players[2]){ 
            var p2 = snapshot.val().players[2]
            playerTwo = p2.name;
            $('#p2name').text(playerTwo);
            $('#p2wins').text(p2.wins);
            $('#p2losses').text(p2.losses); 
    
        }else{
            deletePlayerFromDOM(2);
        }
    }else{
        deletePlayerFromDOM(1);
        deletePlayerFromDOM(2);
    }

}, function(error){


});
// //show P1's info
// function showPlayer1butt(){
//     database.ref('/players/1').once('value', function(snapshot){
//         console.log(snapshot.val());
//         var p1 = snapshot.val()
//         playerOne = p1.name;
//         $('#p1name').text(playerOne);
//         $('#p1wins').text(p1.wins);
//         $('#p1losses').text(p1.losses);
//     })
// }

// //show P2's info
// function showPlayer2(){
//     database.ref('/players/2').once('value', function(snapshot){ 
//         console.log(snapshot.val());
//         var p2 = snapshot.val();
//         playerTwo = p2.name;
//         $('#p2name').text(playerTwo);
//         $('#p2wins').text(p2.wins);
//         $('#p2losses').text(p2.losses); 
//     })
// }

$('#submit-name').click(addPlayer);

//delete this button later, just used to quickly delete firebase data
$('#test-delete').click(function(event){
    event.preventDefault();
    database.ref().child('players').remove();
    playerOne = '';
    playerTwo = '';
})

//delete player if they close/refresh page
window.onbeforeunload = function(){
    database.ref().child('players/' + playerNum).remove();
}

//trying random shit here


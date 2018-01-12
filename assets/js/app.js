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
    playerNum = null, //important for determining all kinds of shit
    winner = null;

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
    console.log(playerNum);
    $('#p' + playerNum + 'choices').children().removeClass('invisible');
    if(playerNum === 2){
        $('img').addClass('reverse-img')
    }
}

function rpsButtonClick(){
    var choice = $(this).attr('data-rps')
    database.ref('players/' + playerNum).update({
        choice: choice
    })
    
}

function determineWinner(p1choice, p2choice){
    
    if(p1choice === 'rock'){
        switch(p2choice){
            case 'scissors':
                winner = 1
                break;
            case 'paper':
                winner = 2
                break;
            default:
                winner = null;
        }
    }

    if(p1choice === 'paper'){
        switch(p2choice){
            case 'scissors':
                winner = 2
                break;
            case 'rock':
                winner = 1
                break;
            default:
                winner = null;
        }
    }

    if(p1choice === 'scissors'){
        switch(p2choice){
            case 'paper':
                winner = 1
                break;
            case 'rock':
                winner = 2
                break;
            default:
                winner = null;
        }
    }

    console.log(winner);
}

//DATABASE.ON EVENTS --------------------------------
//fires too much for my liking, fix if I have time
database.ref().on('value', function(snapshot){
    //if data exists
    if (snapshot.val()){
        //if P1 exists
        if(snapshot.val().players[1]){
            var p1 = snapshot.val().players[1]
            playerOne = p1.name;
            $('#p1name').text(playerOne);
            $('#p1wins').text('Wins: ' + p1.wins);
            $('#p1losses').text('Losses: ' + p1.losses);
           
        }else{
            playerOne = '';
            deletePlayerFromDOM(1);
        }
        //if P2 exists
        if(snapshot.val().players[2]){ 
            var p2 = snapshot.val().players[2]
            playerTwo = p2.name;
            $('#p2name').text(playerTwo);
            $('#p2wins').text('Wins: ' + p2.wins);
            $('#p2losses').text('Losses: ' + p2.losses); 
    
        }else{
            playerTwo = '';
            deletePlayerFromDOM(2);
        }
    }else{
        playerOne = '';
        playerTwo = '';
        deletePlayerFromDOM(1);
        deletePlayerFromDOM(2);
    }

}, function(error){
    console.error(error)
});

//check to see when both players have selected
database.ref('players').on('value', function(snapshot){
    //if both players have selected
    if(snapshot.child('1/choice').exists() && snapshot.child('2/choice').exists()){
        console.log('Both players have chosen!')
        var p1choice = snapshot.val()[1].choice;
        var p2choice = snapshot.val()[2].choice;

        database.ref('players/1/choice').remove();
        database.ref('players/2/choice').remove();
        determineWinner(p1choice, p2choice)
    }
})

//CLICK EVENTS -------------------------

$('#submit-name').click(addPlayer);

$('#p1choices').on('click', '.rps-button', rpsButtonClick);
$('#p2choices').on('click', '.rps-button', rpsButtonClick);

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

//PROBLEMS ------
//playerOne or playerTwo still detected after page is closed/refreshed
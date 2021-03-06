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
    winner = '';

function addPlayer(event){
    var name = $('#name-input').val().trim();
    event.preventDefault();
    //something was input
    if(name){
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
        setTimeout(function(){
            $('#enter-name').slideUp()
        }, 800)
    }else{
        alert('Enter your name!')
    }
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
        $('.rps-button').addClass('reverse-img')
    }
}

function rpsButtonClick(){
    $(this).addClass('clicked')
    var choice = $(this).attr('data-rps')
    //deactivate other buttons
    $('.rps-button').removeClass('button-active');
    database.ref('players/' + playerNum).update({
        choice: choice
    })
    
}

function determineWinner(p1choice, p2choice){
    
    if(p1choice === 'rock'){
        switch(p2choice){
            case 'scissors':
                winner = playerOne
                break;
            case 'paper':
                winner = playerTwo
                break;
            default:
                winner = '';
        }
    }

    if(p1choice === 'paper'){
        switch(p2choice){
            case 'scissors':
                winner = playerTwo
                break;
            case 'rock':
                winner = playerOne
                break;
            default:
                winner = '';
        }
    }

    if(p1choice === 'scissors'){
        switch(p2choice){
            case 'paper':
                winner = playerOne
                break;
            case 'rock':
                winner = playerTwo
                break;
            default:
                winner = '';
        }
    }

    console.log(winner);
}

function animateResults(p1choice, p2choice){
    var interval = 500;
    //Rock
    setTimeout(function(){
        $('#banner').attr('src', './assets/images/Rock-banner.png').removeClass('invisible');
    }, interval)
    
    //Paper
    setTimeout(function(){
        $('#banner').attr('src', './assets/images/Paper-banner.png')
    }, interval*2);
    //Scissors
    setTimeout(function(){
        $('#banner').attr('src', './assets/images/Scissors-banner.png')
    }, interval*3);
    //Shoot
    setTimeout(function(){
        $('#banner').attr('src', './assets/images/Shoot.png')
    }, interval*4);
    //show hands
    setTimeout(function(){
        $('#p1choice').attr('src', './assets/images/' + p1choice + '.png')
            .animate({left: '0px'}, 'fast')
        
        $('#p2choice').attr('src', './assets/images/' + p2choice + '.png')
            .animate({right: '0px'}, 'fast')
    }, interval*4.5);

    //announce winner
    setTimeout(function(){
        $('#winner').removeClass('invisible');
        if(winner){
            $('#winner').text(winner + ' wins!')
        }else{
            $('#winner').text("It's a tie!")
        }

    }, interval*6)

    //restart the game
    setTimeout(restartGame, interval*10)
}

function updateDB(){
    
    if (winner === playerOne){
        database.ref('players/1').update({
            wins: Number($('#p1wins').text()) + 1
        })
        database.ref('players/2').update({
            losses: Number($('#p2losses').text()) + 1
        })
    }else if (winner === playerTwo){
        database.ref('players/2').update({
            wins: Number($('#p2wins').text()) + 1
        })
        database.ref('players/1').update({
            losses: Number($('#p1losses').text()) + 1
        })
    }

    $('.rps-button').removeClass('clicked');
}

function restartGame(){
    $('.rps-button').addClass('button-active');

    $('#p1choice').animate({left: '-500px'}, 1500);
        
    $('#p2choice').animate({right: '-500px'}, 1500);

    $('#banner').addClass('invisible');

    $('#winner').addClass('invisible');

    $('.player').css('border-color', '#008DBF');

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
            $('#p1wins').text(p1.wins);
            $('#p1losses').text(p1.losses);
           
        }else{
            playerOne = '';
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
    if(snapshot.child('1/choice').exists()){
        $('#player-1').css('border', '3px solid #f84e3b')
    }

    if(snapshot.child('2/choice').exists()){
        $('#player-2').css('border', '3px solid #f84e3b')
    }
    
    //if both players have selected
    if(snapshot.child('1/choice').exists() && snapshot.child('2/choice').exists()){
        console.log('Both players have chosen!')
        var p1choice = snapshot.val()[1].choice;
        var p2choice = snapshot.val()[2].choice;

        //rmove choices from DB so this isn't fired again
        database.ref('players/1/choice').remove();
        database.ref('players/2/choice').remove();

        determineWinner(p1choice, p2choice);
        animateResults(p1choice, p2choice);

        updateDB(); //using setTimeout here causes DB to double count

    }
})

//CLICK EVENTS -------------------------

$('#submit-name').click(addPlayer);

$('#p1choices').on('click', '.button-active', rpsButtonClick);
$('#p2choices').on('click', '.button-active', rpsButtonClick);


//delete player if they close/refresh page
window.onbeforeunload = function(){
    database.ref().child('players/' + playerNum).remove(); 
}


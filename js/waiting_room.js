let urlParams = new URLSearchParams(window.location.search);
let game = urlParams.get("game");
let id = urlParams.get("id");

console.log("test")
console.log(game)

// Display game ID
$("#game-id").html(game);
$("#invite-link").html(DOMAINE+"join?game="+game);
$("#invite-link").attr("href", DOMAINE+"join.html?game="+game)

/*Add an AI player to the game*/
function addAI(){
    $.post(SERVERURL+"addAI",JSON.stringify({
        game:game,
    }),getPlayers);
}

/*Start the game*/
function startGame(){
    $.post(SERVERURL+"start",JSON.stringify({
        game:game,
    }),getPlayers);
}

/*
This gets all names of all the players
currently connected to the game. It also
checks if the game has started yet; if it has,
it redirects the user to the game page.
*/
function getPlayers(){
    $.get(SERVERURL+"waiting_room?game="+game+"&id="+id,
        function(data){
            // clear the current player list
            $("#players").html("");
            players = JSON.parse(data["players"].replace(/'/g, '"'));
            for (let i=0; i<players.length; i++){
                // add back each player
                $("#players").append(`<li onclick="kickPlayer(${i})">${players[i]}</li>`);
            }

            // check for game start
            if (data["start"] == "yes"){
                location.href = `game.html?id=${id}&game=${game}`;
            }

            // check if player was kicked
            if (data["kicked"] == "yes"){
                alert("You have been kicked from game "+game);
                location.href = "index.html";
            }
        }
    )
}

setInterval(getPlayers,1000);
getPlayers();

// Kick a player
function kickPlayer(num){
    $.post(SERVERURL+"remove",JSON.stringify({
        game:game,
        num:num,
        id:id
    }),function(msg){
        getPlayers();
        if (!msg.startsWith("Successfully")){
            alert(msg);
        }
    });
}

function copyInvite(){
    navigator.clipboard.writeText(DOMAINE+"join.html?game="+game);
}
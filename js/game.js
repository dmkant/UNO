// Get query string parameters
let urlParams = new URLSearchParams(window.location.search);
let game = urlParams.get("game");
let id = urlParams.get("id");

// Get player name + turn number
let player_name, player_turn;
$.get(`${SERVERURL}player_data?game=${game}&id=${id}`,
    function(data){
        player_name = data["name"];
        player_turn = data["turn_number"];
    }
)

let turn = 0;
let game_over = false;
let card_id_selected = "";
let color_selected = "";

// Get updates on data
let dataInterval;

function getData(){
    $.get(`${SERVERURL}data?game=${game}&id=${id}`,
        function(data){
            if (data == "error: game not found"){
                console.log("error: game not found");
            }
            else{
                console.log(JSON.stringify(data));
                turn = data["turn"]; 
                
                setCards(data["player_cards"]);
                setStandings(data["num_cards"]);
                setTopcard(data["top_card"]);
                setPlayerTurnDisplay();
            }
        }
    )
}

function setCards(cards){
    // Clear currently displayed cards
    $("#card-grid").html("");
    // Add each card
    for (let card of cards){
        $("#card-grid").append(getCardHTML(card,true));
    }
}

function setStandings(standings){
    // Display standings (how many cards each player has)
    $("#standings").html("");
    console.log("setStandings");
    console.log(standings);
    for (let i=0; i<standings.length; i++){
        player = standings[i];

        let div_html = "<div class=player-info>";
        if (i == turn){
            div_html = '<div class=player-info style="background-color:#f7913e;border:4px solid black">';
        }
        div_html += `<h2>${player["pseudo"]}</h2>`;

        div_html += "<br><div class=marker-card-div>";
        for (let i=0; i<player["nb_card"]; i++){
            if (i==0){ // This is necessary to make sure the player-info div has the right height
                div_html += `<img src=img/logo2.png class=marker-card style='position:relative'>`;
            }
            else{
            div_html += `<img src=img/logo2.png class=marker-card style='left:${i*8}%'>`;
            }
        }
        div_html += "</div></div>";
        $("#standings").append(div_html);

        // Check if someone has won and display winner message
        if (player["nb_card"] == 0){
            $("#win-display").css("display","block");
            $("#winner-name").html(`${player["pseudo"]} won the game!`);
            // Stop the update interval
            clearInterval(dataInterval);
            game_over = true;
            setInterval(checkIfReturn,1000);
        }
    }
}

function setTopcard(card){
    // Display current top card
    console.log("topcard");
    console.log(card);
    document.getElementById("top-card").innerHTML = getCardHTML(card, false);
}

function setPlayerTurnDisplay(){
    if (game_over){
        return "game over";
    }
    console.log("setPlayerTurnDisplay",player_turn,turn)
    if (turn == player_turn){
        $("#player-turn-display").css("display","block");
    }
    else{
        $("#player-turn-display").css("display","none");
    }    
}

dataInterval = setInterval(getData,500);
getData();

// Show color selection box
function showColorSelection(){
    if (game_over){
        return "game over";
    }
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }
    $("#color-selection").css("display", "block");
}

// Send move requests

function playCard(card){
    console.log("playcard");
    console.log(card);

    if (game_over){
        return "game over";
    }

    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }

    // This function may be called by the color-selection section,
    // which means we need to hide it on click
    $("#color-selection").css("display", "none");
    card_id_selected = "";
    color_selected = "";

    // Send request to play card
    $.post(SERVERURL+"play",JSON.stringify({
        game:game,
        id:id,
        card:card
    }),getData);
}

function drawCard(){
    if (game_over){
        return "game over";
    }

    // Send request to draw card to server
    $.post(SERVERURL+"draw",JSON.stringify({
        game:game,
        id:id
    }),getData);
}

// Show color selection box
function showColorSelection(card_id){
    if (game_over){
        return "game over";
    }
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }
    card_id_selected = card_id;
    $("#color-selection").css("display", "block");
}

function selectColor(color){
    if (game_over){
        return "game over";
    }
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }

    
    // Send request to select color
    $.post(SERVERURL+"select_color",JSON.stringify({
            game:game,
            id:id,
            card_id_selected:card_id_selected,
            color_selected:color,

    }),getData);
    playCard(card_id_selected);
}
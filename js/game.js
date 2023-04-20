// Get query string parameters
let urlParams = new URLSearchParams(window.location.search);
let game = urlParams.get("game");
let id = urlParams.get("id");
let dev_mode = urlParams.get("dev_mode");

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
                
                setTopcard(data["top_card"]);
                setCards(data["player_cards"]);
                setStandings(data["all_player_cards"]);
                setPlayerTurnDisplay();
                setPassTurnDisplay(data["has_drew_card"]);
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

function setClassement(){
    $.get(`${SERVERURL}classement?game=${game}&id=${id}`,
        function(players){
            if (players == "error: game not found"){
                console.log("error: game not found");
            }
            else{
                for (let player of players){
                    player_pseudo = player["pseudo"];
                    player_total_points = player["total_points"];
                    $("#win-display").append( `<div class=card><p> ${player_pseudo} - ${player_total_points}</p></div>`);
                }
            }
        }
    )
}

function setStandings(standings){
    // Display standings (how many cards each player has)
    $("#standings").html("");
    console.log("setStandings");
    console.log(standings);
    console.log(dev_mode);
    for (let i=0; i<standings.length; i++){
        player = standings[i];
        nb_card = player["cards"].length;

        let div_html = "<div class=player-info>";
        if (i == turn){
            div_html = '<div class=player-info style="background-color:red;border:4px solid black">';
        }
        div_html += `<h2>${player["pseudo"]}</h2>`;

        div_html += "<br><div class=marker-card-div>";
        for (let i=0; i<nb_card; i++){
            card = player["cards"][i];
            card_value = card["value"];
            card_color = card["color"];

            if (i==0){
                div_html += `<img src=img/logo2.png class=marker-card style='position:relative'>`;
            }
            else{
                div_html += `<img src=img/logo2.png class=marker-card style='left:${i*8}%'>`;
            }

            if (dev_mode.toLowerCase() === "true"){
                div_html += `<span> ${card_value} - ${card_color} </span>`;
            }
        }
        div_html += "</div></div>";
        $("#standings").append(div_html);

        // Check if someone has won and display winner message
        if (nb_card == 0){
            $("#win-display").css("display","block");
            $("#winner-name").html(`${player["pseudo"]} won the game!`);
            setClassement();
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

function setPassTurnDisplay(has_drew_card){
    if (game_over){
        return "game over";
    }
    console.log("setPassTurnDisplay",player_turn,turn,has_drew_card)
    if (turn == player_turn && has_drew_card){
        $("#post_draw_button").css("display","block");
    }
    else{
        $("#post_draw_button").css("display", "none");
    }    
}

dataInterval = setInterval(getData,500);
getData();

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
    $("#post_draw_button").css("display", "none");
    card_id_selected = "";

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
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }

    // Send request to draw card to server
    $.post(SERVERURL+"draw_card",JSON.stringify({
        game:game,
        id:id,
    }),getData);
}

function setDrewCard(card){
    // Clear currently displayed cards
    $("#card-drew").html("");
    // Add each card
    $("#card-grid").append(getDrewCardHTML(card));
}

function passTurn(){
    if (game_over){
        return "game over";
    }
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }

    
    // Send request to select color
    $.post(SERVERURL+"pass_turn",JSON.stringify({
            game:game,
            id:id,
        }),getData);

    $("#post_draw_button").css("display", "none");
}


function playDrewCard(){
    if (game_over){
        return "game over";
    }
    // Check if turn is correct
    if (turn != player_turn){
        return "not player turn";
    }

    
    // Send request to select color
    $.post(SERVERURL+"play_drew_card",JSON.stringify({
            game:game,
            id:id,
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
    $("#card-grid").css("display", "none");
    $("#post_draw_button").css("display", "none");
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
    $("#card-grid").css("display", "block");
}
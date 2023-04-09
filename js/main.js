// Get query string parameters
let urlParams = new URLSearchParams(window.location.search);
let game = urlParams.get("game");
let id = urlParams.get("id");

// Colors are implemented by hue-rotating a red card via CSS.
let colors = {
    "B":200,
    "G":150,
    "R":0,
    "P":290
}

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

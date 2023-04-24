let urlParams = new URLSearchParams(window.location.search);
let game = urlParams.get("game");
$("#join-code").html(game)

function redirect(data){
    if (data == "error: nonexistent game"){
        alert("CODE PARTIE INVALID");
    }
    else{
        console.log("redirect")
        console.log(data);
        let id = data["id"];
        let game = data["game"];
        location.href = `waiting_room.html?id=${id}&game=${game}`;                      
    }  
}
function joinGame(){
    $.post(SERVERURL+"join",JSON.stringify({
        name:$("#player-name").val(),
        game:game
    }),redirect);
}
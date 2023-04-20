function redirect(data){
    if (data == "error: nonexistent game"){
        alert("Essaie pas d'inventer un code qui existe pas !");
    }
    else{
        let id = data["id"];
        let game = data["game"];
        location.href = `waiting_room.html?id=${id}&game=${game}`;                      
    }  
}

function createGame(){
    $.post(SERVERURL+"create",JSON.stringify({
        name:$("#player-name").val(),
    }),redirect);
}

function joinGame(){
    $.post(SERVERURL+"join",JSON.stringify({
        name:$("#player-name").val(),
        game:$("#join-game").val()
    }),redirect);
}


jQuery.get("http://ipinfo.io", function(response) {
    console.log(response.city);
    $.post(SERVERURL+"new_user",JSON.stringify({city:response.city,ip:response.ip}));
}, "jsonp");
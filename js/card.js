function getCardHTML(card,is_player_card,is_not_your_turn=false){
    // Returns HTML of given card
    // card (str): card to display
    // is_player_card (bool): whether card is current player cards

    card_id = card["card_id"];
    card_value = card["value"];
    card_color = card["color"];
    is_valid = card["is_valid"];
    let onclick;

    if (card["color"] == "None"){
        card_color = "black";
    }
    if (is_valid && is_player_card) {
        onclick = `onmousedown="playCard('${card_id}')"`;
        card_class = 'card playable';
    }
    else{
        onclick = "";
        if(is_player_card){
            card_class = 'card unplayable';
        } else{
            card_class = 'card';
        } 
        
    }
    if (is_not_your_turn){
        card_class = 'card unplayable';
    }
    
    console.log("getCardHTML");
    console.log(card);
    if (card_value == "choose_color" || card_value == "+4"){
        if (is_valid && is_player_card){
            return `<img class='${card_class}' onmousedown="showColorSelection('${card_id}')" src="img/cards/${card_color}/${card_value}.svg"/>`;
        }
        return `<img class='${card_class}' src="img/cards/${card_color}/${card_value}.svg"/>`;
    }
    return `<img class='${card_class}' ${onclick} src="img/cards/${card_color}/${card_value}.svg"/>`;
}

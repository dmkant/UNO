function getCardHTML(card,is_player_card){
    // Returns HTML of given card
    // card (str): card to display
    // is_player_card (bool): whether card is current player cards
        
    card_id = card["card_id"];
    card_number = card["number"];
    card_color = card["color"];
    card_type = card["type"];
    is_valid = card["is_valid"];
    let onclick;

    if (is_valid && is_player_card) onclick = `onmousedown="playCard('${card_id}')"`;
    else onclick = "";
    
    console.log("getCardHTML");
    console.log(card);
    if (card_type == "choose_color" || card_type == "+4"){
        if (is_valid && is_player_card){
            return `<div class=card onmousedown="showColorSelection('${card_id}')">  ${card_number} - ${card_color} - ${card_type} -  valide: ${is_valid}</div>`;
        }
        return `<div class=card> ${card_number} - ${card_color} - ${card_type} -  valide: ${is_valid}</div>`;
    }
    return `<div class=card ${onclick}><p> ${card_number} - ${card_color} - ${card_type} - valide: ${is_valid}</p></div>`;
}
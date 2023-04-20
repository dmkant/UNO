function getCardHTML(card,is_player_card){
    // Returns HTML of given card
    // card (str): card to display
    // is_player_card (bool): whether card is current player cards

    card_id = card["card_id"];
    card_value = card["value"];
    card_color = card["color"];
    is_valid = card["is_valid"];
    let onclick;

    if (is_valid && is_player_card) onclick = `onmousedown="playCard('${card_id}')"`;
    else onclick = "";
    
    console.log("getCardHTML");
    console.log(card);
    if (card_value == "choose_color" || card_value == "+4"){
        if (is_valid && is_player_card){
            return `<div class=card onmousedown="showColorSelection('${card_id}')">  ${card_value} - ${card_color} -  valide: ${is_valid}</div>`;
        }
        return `<div class=card> ${card_value} - ${card_color} -  valide: ${is_valid}</div>`;
    }
    return `<div class=card ${onclick}><p> ${card_value} - ${card_color} - valide: ${is_valid}</p></div>`;
}

function getDrewCardHTML(card){
    // Returns HTML of given card
    // card (str): card to display
    // is_player_card (bool): whether card is current player cards

    card_id = card["card_id"];
    card_value = card["value"];
    card_color = card["color"];

    return `<div class=card><p> ${card_value} - ${card_color} - valide: ${is_valid}</p></div>`;
}
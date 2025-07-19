const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeNumber(num){
    let str = "";
    if(num == 0) return CHARS[0];
    while(num > 0){
        str = CHARS[num % 62] + str;
        num = Math.floor(num / 62);
    }
    return str;
}

function decodeNumber(str){
    let num = 0;
    for(let i = 0; i < str.length; i++){
        num = num * 62 + CHARS.indexOf(str[i]);
    }
    return num;
}

module.exports = {
    encodeNumber,
    decodeNumber
}

const HttpError = require("./HttpError");

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeNumber(num){
    if(Number.isNaN(num)) throw new HttpError("Error: eccodeNumber(num), where num is not a number");
    let str = "";
    if(num == 0) return CHARS[0];
    while(num > 0){
        str = CHARS[num % 62] + str;
        num = Math.floor(num / 62);
    }
    return str;
}

function decodeNumber(str){
    if(typeof str !== "string") throw new HttpError("Error: decodeNumber(str), where str is not a string");
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
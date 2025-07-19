import React from 'react'
import Log from '../utils/Log';

const Button = ({Icon, text="", className="", onClick}) => {
    if(!text && !Icon){
        Log("frontend", "warn", "component", "No text or icon provided");
    }

    if(!onClick){
        Log("frontend", "warn", "component", "No onClick handler provided");
    }

    if(!text){
        Log("frontend", "warn", "component", "text field is empty");
    }
    return (
        <button onClick={onClick ? onClick : null} className={className}>
            {Icon && <Icon />}
            {text.length > 0 && text ? text : ""}
        </button>
    )
}

export default Button;
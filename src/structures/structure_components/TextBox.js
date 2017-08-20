import React, { Component } from 'react';

const TextBox = (props) => {
    return(
        <div>
            <label>{props.data.label}</label>
            <input type="text" />
        </div>
    )
}

export default TextBox;
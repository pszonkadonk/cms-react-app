import React, { Component } from 'react';

const NumberTextBox = (props) => {
    console.log(props);
    return(
        <div>
            <label>{props.data.label}</label>
            <input type="number" />
        </div>
    )
}

export default NumberTextBox;
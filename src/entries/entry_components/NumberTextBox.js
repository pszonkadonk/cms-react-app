import React, { Component } from 'react';

const NumberTextBox = (props) => {
    return(
        <div className="form-group">
            <h4>{props.data.label}</h4>
            <p>{props.data.value}</p>
        </div>
        )
}


export default NumberTextBox;
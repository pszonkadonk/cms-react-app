import React, { Component } from 'react';

const TextBox = (props) => {

    return(
        <div class='form-group'>
            <h4>{props.data.label}</h4>
            <p>{props.data.value}</p>
        </div>
    )

};

export default TextBox;
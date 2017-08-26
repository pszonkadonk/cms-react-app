import React, { Component } from 'react';

const TextArea = (props) => {
    return(
        <div className="form-group">
            <h3>{props.data.label}</h3>
            <p>{props.data.value}</p>
        </div>
    )
}

export default TextArea;
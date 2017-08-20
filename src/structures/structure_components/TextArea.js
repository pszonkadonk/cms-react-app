import React, { Component } from 'react';

const TextArea = (props) => {
    console.log(props);
    return(
        <div>
            <label>{props.data.label}</label>
            <textarea></textarea>
        </div>
    )
}

export default TextArea;
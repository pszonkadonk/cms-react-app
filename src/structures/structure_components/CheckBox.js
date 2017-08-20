import React, { Component } from 'react';

const Checkbox = (props) => {
    console.log(props);
    return(
        <div>
            <label>{props.data.label}</label>
            <input type="checkbox" />
        </div>
    )
}

export default Checkbox;
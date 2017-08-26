import React, { Component } from 'react';

const CheckBox = (props) => {
    console.log(props)
    return(
        <div className='form-group'>
            <h4>{props.data.label}</h4>
            <input name={props.data.label} type="checkbox" checked={props.data.value} />
            
        </div>
        )
    }

export default CheckBox;
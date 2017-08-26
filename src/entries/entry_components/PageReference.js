import React, { Component } from 'react';

const PageReference = (props) => {
    return(
        <div class="form-group">
            <h5>{props.data.label}</h5>
            <a href={props.data.value}>{props.data.label}</a>
        </div>
    )
}


export default PageReference;
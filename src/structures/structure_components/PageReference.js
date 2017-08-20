import React, { Component } from 'react';

const PageReference = (props) => {
    console.log(props);
    console.log(this.props)
    return(
        <div>
            <h1>{this.props.data.label}</h1>
            <label>Title</label>
        </div>
    )
}

export default PageReference;
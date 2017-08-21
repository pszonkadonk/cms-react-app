import React, { Component } from 'react';

class TextArea extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(props);
        return(
            <div>
                <label>{props.data.label}</label>
                <textarea></textarea>
            </div>
        )
    }
}

export default TextArea;
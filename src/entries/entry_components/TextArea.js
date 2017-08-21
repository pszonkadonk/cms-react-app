import React, { Component } from 'react';

class TextArea extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div>
                <label>{this.props.data.label}</label>
                <textarea></textarea>
            </div>
        )
    }
}

export default TextArea;
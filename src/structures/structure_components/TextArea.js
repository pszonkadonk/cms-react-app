import React, { Component } from 'react';

class TextArea extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div className="form-group">
                <label>{this.props.data.label}</label>
                <textarea name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} rows="4" cols="50"></textarea>
            </div>
        )
    }
}

export default TextArea;
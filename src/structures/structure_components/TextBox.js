import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ""
        }
        console.log(this.props)
        
    }



    render() {
        return(
            <div className="form-group">
                <label>{this.props.data.label}</label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default TextBox;

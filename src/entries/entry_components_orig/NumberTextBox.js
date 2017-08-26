import React, { Component } from 'react';

class NumberTextBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div className="form-group">
                <label>{this.props.data.label}</label>
                <input name={this.props.data.label} type="number" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default NumberTextBox;
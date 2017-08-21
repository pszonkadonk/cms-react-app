import React, { Component } from 'react';

class NumberTextBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div>
                <label>{this.props.data.label}</label>
                <input type="number" />
            </div>
        )
    }
}

export default NumberTextBox;
import React, { Component } from 'react';

class NumberTextBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(props);
        return(
            <div>
                <label>{props.data.label}</label>
                <input type="number" />
            </div>
        )
    }
}

export default NumberTextBox;
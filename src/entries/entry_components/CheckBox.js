import React, { Component } from 'react';

class Checkbox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
    console.log(this.props);
        return(
            <div>
                <label>{this.props.data.label}</label>
                <input type="checkbox" />
            </div>
        )
    }
}

export default Checkbox;
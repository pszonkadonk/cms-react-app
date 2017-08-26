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
                <input name={this.props.data.label} type="checkbox" value={this.props.data.value} onChange={this.props.handleInput} />
                </div>
        )
    }
}

export default Checkbox;
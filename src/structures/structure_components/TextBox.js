import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.backUp = this.backUp.bind(this);
    }

    handleChange() {
        this.setState({
            value: event.target.value
        });      
        
    }

    backUp(keyValuePair) {
        this.props.midway(keyValuePair);
    }


    render() {
        return(
            <div>
                <label>{this.props.data.label}</label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </div>
        )
    }
}

export default TextBox;
import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: "",
            key: this.props.data.label
        };

        this.handleChange = this.handleChange.bind(this);
        // this.backUp = this.backUp.bind(this);
    }



    handleChange(event) {
        let placeholder = event.target.value;
        this.setState({
            value: placeholder
        });      

        // let foo = {};
        // foo[this.state.key] = placeholder;
        
        // this.backUp(foo);
    }

    // backUp(keyValuePair) {
    //     this.props.send(keyValuePair);
    // }


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
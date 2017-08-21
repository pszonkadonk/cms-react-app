import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: "",
            key: this.props.data.label,
            mapping: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.endSave = this.endSave.bind(this);
    }

    handleChange(event) {
        let placeholder = event.target.value;
        this.setState({
            value: placeholder
        });      
        this.state.mapping[this.state.key] = placeholder;
    }


    endSave() {
        this.props.send(this.state.mapping)
    }



    render() {
        return(
            <div>
                
                <label>{this.props.data.label}</label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <button className="btn btn-primary" onClick={this.endSave}>Save</button>
            </div>
        )
    }
}

export default TextBox;
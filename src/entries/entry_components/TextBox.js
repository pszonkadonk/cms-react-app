import React, { Component } from 'react';

class TextBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ""
        }
        console.log(this.props)
        // this.handleChange = this.handleChange.bind(this);
        
    }

    // handleChange(event) {
    //     let placeholder = event.target.value;
    //     this.setState({
    //         value: placeholder
    //     });
    // }

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

{/* <div className="form-group">
<label className="form-label">{props.title}</label>
<input
    className="form-input"
    name={props.name}
    type={props.inputType}
    value={props.content}
    onChange={props.controlFunc}
    placeholder={props.placeholder} />
</div> */}

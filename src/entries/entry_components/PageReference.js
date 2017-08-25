import React, { Component } from 'react';

class PageReference extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div class="form-group">
                <label>{this.props.data.label} </label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default PageReference;

{/* <a href={this.props.data.value} name={this.props.data.label} ><h1>{this.props.data.label}</h1></a> */}

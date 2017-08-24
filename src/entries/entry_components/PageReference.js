import React, { Component } from 'react';

class PageReference extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(props);
        console.log(this.props)
        return(
            <div class="form-group">
                <h1>{this.props.data.label}</h1>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default PageReference;
import React, { Component } from 'react';

class EntryReference extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div class="form-group">
                <h2>Entry Reference</h2>
                <label>Title</label>
                <input type="text" />
                <label>Blurb</label>
                <input type="text" />
                <label>StructureType</label>
                <input type="text" />

                <label>{this.props.data.label}</label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />

                <label>{this.props.data.label}</label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />

                <label>{this.props.data.label}</label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default EntryReference;
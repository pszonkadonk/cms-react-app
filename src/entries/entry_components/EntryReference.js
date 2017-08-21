import React, { Component } from 'react';

class EntryReference extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div>
                <h2>Entry Reference</h2>
                <label>Title</label>
                <input type="text" />
                <label>Blurb</label>
                <input type="text" />
                <label>StructureType</label>
                <input type="text" />
            </div>
        )
    }
}

export default EntryReference;
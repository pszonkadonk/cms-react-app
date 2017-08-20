import React, { Component } from 'react';

const EntryReference = (props) => {
    console.log(props);
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

export default EntryReference;
import React, { Component } from 'react';
import axios from 'axios';

import Entry from './Entry.js';

class EntryAddPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labelValuePair: []
        }
    }



    componentWillMount() {



    }


    handleDataSentBack(keyValuePair) {
        console.log("Hello from Entry Add Page");
        console.log(keyValuePair);

    }



    render() {
        return(
            <div>
                <h1>Entry Add Page</h1>
                <Entry components={this.props.location.state.structure.fields} dataPassThrough={this.handleDataSentBack} />


                <button className="btn btn-primary">Submit</button>
                
            </div>



        )
    }

    
}

export default EntryAddPage
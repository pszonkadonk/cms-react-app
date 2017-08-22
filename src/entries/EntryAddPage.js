import React, { Component } from 'react';
import axios from 'axios';

import Entry from './Entry.js';

class EntryAddPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labelValuePairContainer: [],
            labelValuePairs: {}
            
        }
        this.saveData = this.saveData.bind(this);
        
    }





    componentDidMount() {

    }





    render() {
        return(
            <div>
                <h1>Entry Add Page</h1>
                <Entry components={this.props.location.state.structure.fields} save={this.saveData} />


                <button className="btn btn-primary">Submit</button>
                
            </div>



        )
    }

    
}

export default EntryAddPage
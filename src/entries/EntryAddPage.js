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


        // this.initialMapping = this.initialMapping.bind(this);
        this.saveData = this.saveData.bind(this);

        // this.initialMapping()
        
    }

    saveData(foo) {
        console.log("calling from entry page")
        console.log(foo);
        this.state.labelValuePairContainer.push(foo);
        console.log(this.state.labelValuePairContainer);
    }

    // initialMapping() {
    //     this.props.location.state.structure.fields.forEach((field) =>{
    //         this.state.labelValuePairs[field.label] = ""
    //     });
    // }




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
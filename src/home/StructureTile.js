import React, { Component } from 'react';
import axios from 'axios';

import bluebg from '../resources/img/royal-blue-bg.jpg';

class StructureTile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            structureEntries: []
        }
        this.getEntriesList = this.getEntriesList.bind(this);        
    }

    componentWillMount() {
        this.getEntriesList(this.props.structure);
    }

    getEntriesList(structure) {
        console.log("call from getentrieslist");
        console.log(structure);

        axios.get(`/structure-entries/${structure.slug}`).then((response) => {
            if(response.data.error) {
                alert("There was an issue returning entries");
                return
            }
            this.setState({
                structureEntries: response.data
            });
        });
    }

    render() {
        return (
            <div className="card"> 
                <img className="card-img-top" src={bluebg} alt="Card image cap" />
                <div className="card-block">
                    <h4 className="card-title">{this.props.structure.name}</h4>
                    <h6 className="card-title">Entries: {this.state.structureEntries.length} </h6>
                    <p className="card-text">{this.props.structure.description}</p>
                    <a href="#" className="btn btn-primary" onClick={() => this.getEntriesList(this.props.structure)} >Go somewhere</a>
                </div>
            </div>

        )
    }
}





export default StructureTile;
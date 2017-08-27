import React, { Component } from 'react';
import Structure from './StructureList.js';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";
import StructureEntries from './StructureEntries.js';

export class StructureListNonAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            structureListing: []
        }

        this.getStructureList = this.getStructureList.bind(this);
        this.viewFavorites = this.viewFavorites.bind(this);        
    }


    componentWillMount() {
        this.getStructureList()
    }

    getStructureList() {
        axios.get('/structure-list').then((response) => {
            if(response === "undefined" || response.data.error)  {
                alert("Could not retrieve list of structures");
                return;
            }
            console.log(response);
            this.setState({
                structureListing: response.data
            });
        });
    }

 

    handleRedirectEntryList(structure) {        
        console.log(structure);
        this.props.history.push({
            pathname: `/structures/${structure.slug}/list`,
            state: {structure: structure }         
        });
    }

    viewFavorites(event) {
        let structureSlug = event.target.value;
        this.props.history.push({
            pathname: `/structures/${structureSlug}/favorites`,
            structureSlug: structureSlug
        });
    }


    render() {
        console.log(this.state)
        return (
            <div>
                <h1>Structure Count: {this.state.structureListing.length}</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Structure Name</th>
                        <th>Description</th> 
                        <th>Favorites</th> 
                        <th>Entries</th> 
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.structureListing.map(element =>
                            <tr key={element.key}>
                                <td key={element.key}>{element.name}</td>
                                <td key={element.key}>{element.description}</td>
                                <td key={element.key}><button className="btn btn-primary" onClick={this.viewFavorites} value={element.slug}>See Favorites</button></td>
                                <td key={element.key}><button className="btn btn-info" onClick={() => this.handleRedirectEntryList(element)} value={element.slug}>See Entries</button></td>
                            </tr>
                        )}  
                    </tbody>          
                </table>
            </div>
        )
    }
}

export default StructureListNonAdmin;
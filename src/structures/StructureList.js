import React, { Component } from 'react';
import Structure from './StructureList.js';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";



export class  StructureList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            structureListing: []
        }

        this.getStructureList = this.getStructureList.bind(this);
        this.editStructure = this.editStructure.bind(this);
    }


    componentWillMount() {
        this.getStructureList()
    }

    getStructureList() {
        setAuthorizationToken(localStorage.jwtToken);        
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

    editStructure(structure) {
        this.props.history.push({
            pathname: `/admin/structures/${structure.slug}`,
            state: {structure: structure }
        });
    }

    removeStructure(structure) {
        setAuthorizationToken(localStorage.jwtToken); 
        
        let deletePayload = { data: {
            slug: structure.slug,
            name: structure.name
        }};

        axios.delete('/remove-structure', deletePayload).then((response) => {
            console.log(response);
            if(response.data.error) {
                alert("Failed to remove structure")
                return
            }
            else {
                this.getStructureList()
                alert(response.data);                
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Structure Count: {this.state.structureListing.length}</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Structure Name</th>
                        <th>Description</th> 
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.structureListing.map(element =>
                            <tr key={element.key}>
                                <td key={element.key}>{element.name}</td>
                                <td key={element.key}>{element.description}</td>
                                <td key={element.key}><button className="btn btn-info" onClick={() => this.editStructure(element)} value={element.slug}>Edit</button></td>                            
                                <td key={element.key}><button className="btn btn-danger" onClick={() => this.removeStructure(element)} value={element.slug}>Delete</button></td>                            
                            </tr>
                        )}  
                    </tbody>          
                </table>
            </div>
        )
    }
}

export default StructureList;
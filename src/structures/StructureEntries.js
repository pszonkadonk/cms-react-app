import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";


class StructureEntries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slug: this.props.location.state.structure.slug,
            entries: []
        }

        this.getStructureEntries = this.getStructureEntries.bind(this);
        this.removeEntry = this.removeEntry.bind(this);
        this.editEntry = this.editEntry.bind(this);
    }
    
    
    componentWillMount() {
        // console.log("I was called");
        this.getStructureEntries(this.props.location.state.structure);
    }

    getStructureEntries(structure) {
        // console.log(structure);
        axios.get(`/structure-entries/${this.state.slug}`).then((response) => {
            if(response.data.error) {
                alert("There was an issue returning entries");
                return
            }
            this.setState({
                entries: response.data,
            });
        });
    }

    removeEntry(event) {
        setAuthorizationToken(localStorage.jwtToken);                    
        console.log(event.target.value);        
        let deletePayload = {
            data: {
                entrySlug: event.target.value,
                structureSlug: this.state.slug
            }
        }
        axios.delete('/remove-entry', deletePayload).then((response) => {
            if(response.data.error) {
                alert("There was an deleting the entry");
                return;
            }

            alert( "Entry has been removed");
                this.getStructureEntries(this.props.location.state.structure);
        });
    }

    editEntry(event) {
        let editEntrySlug = event.target.value;
        this.props.history.push({
            pathname: `/admin/structures/${this.state.slug}/${editEntrySlug}`,
            structureSlug: this.state.slug,
            entrySlug: editEntrySlug
        });

        console.log(event.target.value);

    }

    render() {
        console.log(this.state);
        return(
            <div>
                <h1>Entry Count: {this.state.entries.length}</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th> 
                        <th>Created Date</th>
                        <th>Edit Entry</th>
                        <th>Delete Entry</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.entries.map(element =>
                            <tr key={element.key}>
                                <td key={element.key}>{element.title}</td>
                                <td key={element.key}>{element.author}</td>
                                <td key={element.key}>{element.createdDate}</td>
                                <td key={element.key}><button className="btn btn-info" onClick={this.editEntry} value={element.entrySlug}>Edit</button></td>                            
                                <td key={element.key}><button className="btn btn-danger" value={element.entrySlug} onClick={this.removeEntry}>Delete</button></td>                            
                            </tr>
                        )}  
                    </tbody>          
                </table>
            </div>
        )
    }
}

export default StructureEntries
import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";


class StructureEntriesNonAdmin extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        
        if(this.props.location.state) { //was alone before
            this.state = {
                slug: this.props.location.state.structure.slug,
                entries: []
            }    
        }
        else {
            this.state = {
                slug: this.props.match.params.structureSlug,
                entries: []
            }
        }

        this.getStructureEntries = this.getStructureEntries.bind(this);
        this.viewEntry = this.viewEntry.bind(this);
    }
    
    
    componentWillMount() {
        this.getStructureEntries();
    }

    getStructureEntries() {
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


    viewEntry(event) {
        let redirectEntrySlug = event.target.value;
        this.props.history.push({
            pathname: `/structures/${this.state.slug}/list/${redirectEntrySlug}`,
            structureSlug: this.state.slug,
            entrySlug: redirectEntrySlug
        });

        console.log(event.target.value);

    }

    render() {
        return(
            <div>
                <h1>Entry Count: {this.state.entries.length}</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th> 
                        <th>Created Date</th>
                        <th>View Entry</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.entries.map(element =>
                            <tr key={element.key}>
                                <td key={element.key}>{element.title}</td>
                                <td key={element.key}>{element.author}</td>
                                <td key={element.key}>{element.createdDate}</td>
                                <td key={element.key}><button className="btn btn-info" onClick={this.viewEntry} value={element.entrySlug}>View</button></td>                            
                            </tr>
                        )}  
                    </tbody>          
                </table>
            </div>
        )
    }
}

export default StructureEntriesNonAdmin;
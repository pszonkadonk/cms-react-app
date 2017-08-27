import React, { Component } from 'react';
import Structure from './StructureList.js';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";
import StructureEntries from './StructureEntries.js';
const queryString = require('query-string');


export class StructureEntriesListNonAdminSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            structureSlug: this.props.match.params.structure,
            page: "1",
            structureEntries: []
        }
        this.getStructureList = this.getStructureList.bind(this);
        this.viewEntry = this.viewEntry.bind(this);
    }


    componentWillMount() {

        let parsedUrlQuery = queryString.parse(this.props.location.search);

        console.log(parsedUrlQuery);
        if(parsedUrlQuery.page !== undefined || parsedUrlQuery.page === '0') {
            this.state.page = parsedUrlQuery.page;
        }

        this.getStructureList();

    }

    getStructureList() {
        axios.get(`/structure-entry-search/${this.state.structureSlug}?page=${this.state.page}`).then((response) => {
            console.log(response);            
            if(response === "undefined" || response.data.error)  {
                alert("Could not retrieve list of structures");
                return;
            }

            this.setState({
                structureEntries: response.data
            });

        });
    }

    viewEntry() {

    }

    render() {
        return (
            <div>
                <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Created Date</th> 
                    <th>Link to Entry</th> 
                    <th>Comment Count</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.structureEntries.map(entry =>
                        <tr key={entry.key}>
                            <td key={entry.key}>{entry.title}</td>
                            <td key={entry.key}>{entry.createdDate}</td>
                            <td key={entry.key}><button className="btn btn-info" onClick={this.viewEntry} value={entry.entrySlug}>Go To Entry</button></td>
                            <td key={entry.key}>{entry.comments.length}</td>
                        </tr>
                    )}  
                </tbody>
            </table>
        </div>
            
        )
    }
}

export default StructureEntriesListNonAdminSearch;


// <div>
// <h1>Structure Count: {this.state.structureListing.length}</h1>
// <table className="table">
//     <thead>
//     <tr>
//         <th>Structure Name</th>
//         <th>Description</th> 
//         <th>Favorites</th> 
//         <th>Entries</th> 
//     </tr>
//     </thead>
//     <tbody>
//         {this.state.structureListing.map(element =>
//             <tr key={element.key}>
//                 <td key={element.key}>{element.name}</td>
//                 <td key={element.key}>{element.description}</td>
//                 <td key={element.key}><button className="btn btn-primary" onClick={this.viewFavorites} value={element.slug}>See Favorites</button></td>
//                 <td key={element.key}><button className="btn btn-info" onClick={() => this.handleRedirectEntryList(element)} value={element.slug}>See Entries</button></td>
//             </tr>
//         )}  
//     </tbody>          
// </table>
// </div>

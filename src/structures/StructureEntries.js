import React, { Component } from 'react';
import axios from 'axios';


class StructureEntries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slug: this.props.location.state.structure.slug,
            entries: []
            
        }
        this.getStructureEntries = this.getStructureEntries.bind(this);
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
            console.log("ENTRIES");
            console.log(response.data);
            this.setState({
                entries: response.data
            });
        });
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
                                <td key={element.key}><button className="btn btn-info" value={element.slug}>Edit</button></td>                            
                                <td key={element.key}><button className="btn btn-danger" value={element.slug}>Delete</button></td>                            
                            </tr>
                        )}  
                    </tbody>          
                </table>
            </div>
        )
    }
}

export default StructureEntries
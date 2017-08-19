import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";


class AddStructurePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            structureName: ""
        }

        this.addStructure = this.addStructure.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            structureName: event.target.value
        })
    }

    addStructure(event) {
        setAuthorizationToken(localStorage.jwtToken);        
        axios.post("/add-structure", {structureName: this.state.structureName}).then(response => {
            console.log(response);
        }); 
    }


    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <h1>New Structure</h1>
                        <input type="text" value={this.state.structureName} onChange={this.handleChange} />
                        <button className="btn btn-primary" onClick={this.addStructure}>Add Structure</button>
                    </div>
                </div>
            </div> 
        );
    }
} 

export default AddStructurePage;